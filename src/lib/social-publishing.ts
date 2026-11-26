import type { ScheduledPost } from './catalog';
import type { PostMeta, SocialAccount } from './store';

export const uploadPages: Record<string, string> = {
  tiktok: 'https://www.tiktok.com/tiktokstudio/upload',
  instagram: 'https://www.instagram.com/',
  youtube: 'https://studio.youtube.com/',
  facebook: 'https://www.facebook.com/',
  x: 'https://x.com/compose/post',
  linkedin: 'https://www.linkedin.com/feed/',
  pinterest: 'https://www.pinterest.com/pin-creation-tool/',
  threads: 'https://www.threads.net/',
  snapchat: 'https://my.snapchat.com/',
};

export function manualPost(account: SocialAccount, metadata: PostMeta, date: string, time: string, scheduled: boolean): ScheduledPost {
  return {
    id: `post_${crypto.randomUUID()}`,
    accountId: account.id,
    title: metadata.title.trim() || 'Untitled post',
    description: metadata.description,
    hashtags: metadata.hashtags,
    cta: metadata.cta,
    date, time,
    platform: account.name,
    delivery: 'manual',
    status: scheduled ? 'scheduled' : 'draft',
  };
}

export function captionText(post: Pick<PostMeta, 'title' | 'description' | 'cta' | 'hashtags'>): string {
  return [post.title, post.description, post.cta, post.hashtags.map((tag) => tag.startsWith('#') ? tag : `#${tag}`).join(' ')].filter(Boolean).join('\n\n');
}