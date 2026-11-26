import { expect, it } from 'vitest';
import { manualPost, captionText } from './social-publishing';
const account = { id: 'youtube-account-1', platform: 'youtube', name: 'YouTube', handle: '@creator', connected: false };
const metadata = { title: 'Real title', description: 'Real description', cta: 'Follow', hashtags: ['creator'], keyword: '', platforms: [account.id] };
it('opening a social upload page does not mark the post as published', () => {
  expect(manualPost(account, metadata, '2026-11-27', '10:00', false).status).toBe('draft');
});
it('saved scheduling retains the actual account and all publishing metadata', () => {
  expect(manualPost(account, metadata, '2026-11-27', '10:00', true)).toMatchObject({ accountId: 'youtube-account-1', platform: 'YouTube', status: 'scheduled', description: 'Real description', hashtags: ['creator'], delivery: 'manual' });
});
it('formats hashtags for social upload', () => {
  expect(captionText(metadata)).toBe('Real title\n\nReal description\n\nFollow\n\n#creator');
});