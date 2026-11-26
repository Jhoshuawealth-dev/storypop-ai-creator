import type { Project, Character, ScheduledPost } from './catalog';
import type { SocialAccount } from './store';

export interface LibraryData {
  projects: Project[];
  characters: Character[];
  posts: ScheduledPost[];
  socialAccounts: SocialAccount[];
}
export type Collection = keyof LibraryData;
export interface LibraryOperation {
  operationId: string;
  collection: Collection;
  kind: 'add' | 'patch' | 'remove';
  id: string;
  value?: Record<string, unknown>;
}
export type SyncStatus = 'loading' | 'saving' | 'saved' | 'offline' | 'signed-out';
export const emptyLibrary = (): LibraryData => ({ projects: [], characters: [], posts: [], socialAccounts: [] });

export function applyOperations(base: LibraryData, operations: LibraryOperation[]): LibraryData {
  const result = { ...base };
  for (const op of operations) {
    const list = result[op.collection] as { id: string }[];
    const exists = list.some((item) => item.id === op.id);
    const value = { ...op.value, id: op.id };
    const next = op.kind === 'remove'
      ? list.filter((item) => item.id !== op.id)
      : exists
        ? list.map((item) => item.id === op.id ? { ...item, ...value } : item)
        : op.kind === 'add' ? [value, ...list] : list;
    // Each operation is produced by the typed store mutation methods.
    Object.assign(result, { [op.collection]: next });
  }
  return result;
}

export function parseLibrary(value: unknown): LibraryData {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const rows = (key: string) => Array.isArray(record[key])
    ? (record[key] as unknown[]).filter((x) => x && typeof x === 'object' && typeof (x as { id?: unknown }).id === 'string')
    : [];
  return { projects: rows('projects') as Project[], characters: rows('characters') as Character[], posts: rows('posts') as ScheduledPost[], socialAccounts: rows('socialAccounts') as SocialAccount[] };
}

interface SyncOptions {
  userId: string;
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  exchange: (operations: LibraryOperation[]) => Promise<LibraryData>;
  onChange: (data: LibraryData) => void;
  onStatus: (status: SyncStatus) => void;
}

/** A serialized, durable outbox per account; pulls never overwrite pending edits. */
export class LibrarySync {
  private pending: LibraryOperation[] = [];
  private base = emptyLibrary();
  private busy = false;
  private stopped = false;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private key: string;
  constructor(private options: SyncOptions) {
    this.key = `storypop:library:v2:${options.userId}`;
    try {
      const raw = options.storage.getItem(this.key);
      if (raw) {
        const cached = JSON.parse(raw) as { base?: unknown; pending?: LibraryOperation[] };
        this.base = parseLibrary(cached.base);
        this.pending = Array.isArray(cached.pending) ? cached.pending : [];
      }
    } catch { /* A malformed cache must never affect another account. */ }
  }
  start() {
    this.publish();
    this.options.onStatus('loading');
    void this.flush();
  }
  enqueue(operation: LibraryOperation) {
    if (this.stopped) return;
    this.pending.push(operation);
    this.persist();
    this.publish();
    this.options.onStatus('saving');
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.flush(), 150);
  }
  async flush(): Promise<void> {
    if (this.stopped || this.busy) return;
    this.busy = true;
    if (this.timer) clearTimeout(this.timer);
    const batch = this.pending.slice(0, 200);
    try {
      const cloud = await this.options.exchange(batch);
      if (this.stopped) return;
      this.base = cloud;
      const acknowledged = new Set(batch.map((op) => op.operationId));
      this.pending = this.pending.filter((op) => !acknowledged.has(op.operationId));
      this.persist();
      this.publish();
      this.options.onStatus(this.pending.length ? 'saving' : 'saved');
    } catch {
      if (!this.stopped) this.options.onStatus('offline');
    } finally {
      this.busy = false;
      if (!this.stopped) this.timer = setTimeout(() => void this.flush(), this.pending.length ? 2000 : 15000);
    }
  }
  stop() {
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
  }
  private publish() { this.options.onChange(applyOperations(this.base, this.pending)); }
  private persist() {
    try { this.options.storage.setItem(this.key, JSON.stringify({ base: this.base, pending: this.pending })); }
    catch { /* Cloud saving remains available when browser storage is full. */ }
  }
}