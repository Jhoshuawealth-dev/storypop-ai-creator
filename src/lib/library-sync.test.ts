import { describe, it, expect } from 'vitest';
import { applyOperations, emptyLibrary, LibrarySync, type LibraryOperation } from './library-sync';

const project = { id: 'p1', title: 'Original', durationSeconds: 30, createdAt: '2026-11-26', status: 'draft' as const };
const op = (kind: LibraryOperation['kind'], id: string, value?: Record<string, unknown>): LibraryOperation => ({ operationId: crypto.randomUUID(), collection: 'projects', kind, id, ...(value ? { value } : {}) });
const memoryStorage = () => {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
};
describe('account library synchronization', () => {
  it('keeps a pending field edit without losing changes from another device', () => {
    const cloud = { ...emptyLibrary(), projects: [{ ...project, durationSeconds: 60 }] };
    expect(applyOperations(cloud, [op('patch', 'p1', { title: 'New title' })]).projects[0]).toEqual({ ...project, durationSeconds: 60, title: 'New title' });
  });
  it('does not resurrect a deleted project with a stale update', () => {
    expect(applyOperations(emptyLibrary(), [op('patch', 'p1', { title: 'Old device' })]).projects).toEqual([]);
  });
  it('persists a failed write and retries it after reloading the same account', async () => {
    const storage = memoryStorage();
    const first = new LibrarySync({ userId: 'owner', storage, exchange: async () => { throw new Error('offline'); }, onChange: () => {}, onStatus: () => {} });
    first.enqueue(op('add', 'p1', project));
    await first.flush(); first.stop();
    let received: LibraryOperation[] = [];
    const second = new LibrarySync({ userId: 'owner', storage, exchange: async (batch) => { received = batch; return applyOperations(emptyLibrary(), batch); }, onChange: () => {}, onStatus: () => {} });
    await second.flush(); second.stop();
    expect(received).toHaveLength(1);
    expect(received[0]?.value?.['title']).toBe('Original');
  });
  it('never loads another account’s pending projects', async () => {
    const storage = memoryStorage();
    const first = new LibrarySync({ userId: 'alice', storage, exchange: async () => emptyLibrary(), onChange: () => {}, onStatus: () => {} });
    first.enqueue(op('add', 'p1', project)); first.stop();
    let received: LibraryOperation[] = [];
    const second = new LibrarySync({ userId: 'bob', storage, exchange: async (batch) => { received = batch; return emptyLibrary(); }, onChange: () => {}, onStatus: () => {} });
    await second.flush(); second.stop();
    expect(received).toEqual([]);
  });
  it('ignores responses from an account that has signed out', async () => {
    let resolve: (value: ReturnType<typeof emptyLibrary>) => void = () => {};
    let changes = 0;
    const sync = new LibrarySync({ userId: 'owner', storage: memoryStorage(), exchange: () => new Promise((r) => { resolve = r; }), onChange: () => { changes++; }, onStatus: () => {} });
    const request = sync.flush(); sync.stop();
    resolve({ ...emptyLibrary(), projects: [project] }); await request;
    expect(changes).toBe(0);
  });
});