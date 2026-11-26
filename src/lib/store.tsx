import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  emptyScript,
  platformSpecs,
  plans,
  sceneTemplate,
  type AppNotification,
  type Character,
  type Project,
  type ScheduledPost,
  type Scene,
  FREE_PLAN_SECONDS,
} from "./catalog";
import { toast } from 'sonner';
import { LibrarySync, emptyLibrary, parseLibrary, type Collection, type LibraryOperation, type SyncStatus } from './library-sync';

const STATE_KEY = "storypop:state:v1";

/* ---------------- Types ---------------- */

export interface UserProfile {
  fullName: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  language: string;
}

export interface SocialAccount {
  id: string;
  /** Platform id from platformSpecs (tiktok, instagram, ...). */
  platform: string;
  name: string;
  connected: boolean;
  handle: string;
}

export interface PostMeta {
  title: string;
  description: string;
  hashtags: string[];
  cta: string;
  keyword: string;
  platforms: string[];
}

export interface CreateDraft {
  idea: string;
  topic?: string;
  mode?: "idea" | "product" | "template";
  productUrl?: string;
  template?: string;
  audience: string;
  tone: string;
  platform: string;
  cta: string;
  script: { hook: string; body: string; cta: string };
  scenes: Scene[];
  characterId: string;
  voiceId: string;
  styleId: string;
  duration: number;
  ratio: "9:16" | "16:9" | "1:1";
  monetizationSafe?: boolean;
  post: PostMeta;
}

export interface Subscription {
  planId: string | null;
  billing: "monthly" | "yearly";
  minutesTotalSeconds: number;
  minutesUsedSeconds: number;
  renewsOn: string | null;
}

interface PersistedState {
  isAuthenticated: boolean;
  user: UserProfile;
  subscription: Subscription;
  projects: Project[];
  characters: Character[];
  notifications: AppNotification[];
  posts: ScheduledPost[];
  socialAccounts: SocialAccount[];
  preferences: Record<string, string | boolean>;
}

/* ---------------- Defaults (empty account) ---------------- */

export const emptyPost: PostMeta = {
  title: "",
  description: "",
  hashtags: [],
  cta: "",
  keyword: "",
  platforms: [],
};

const defaultDraft: CreateDraft = {
  idea: "",
  audience: "",
  tone: "",
  platform: "",
  cta: "",
  script: { ...emptyScript },
  scenes: sceneTemplate.map((s) => ({ ...s })),
  characterId: "",
  voiceId: "",
  styleId: "",
  duration: 30,
  ratio: "9:16",
  post: { ...emptyPost },
};

const emptyUser: UserProfile = {
  fullName: "",
  name: "",
  email: "",
  avatar: "",
  bio: "",
  language: "English",
};

const freeSubscription: Subscription = {
  planId: null,
  billing: "monthly",
  minutesTotalSeconds: FREE_PLAN_SECONDS,
  minutesUsedSeconds: 0,
  renewsOn: null,
};

const defaultState: PersistedState = {
  isAuthenticated: false,
  user: emptyUser,
  subscription: freeSubscription,
  projects: [],
  characters: [],
  notifications: [],
  posts: [],
  socialAccounts: [],
  preferences: {},
};

function loadState(): PersistedState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...defaultState,
      ...parsed,
      ...emptyLibrary(),
      user: { ...emptyUser, ...(parsed.user ?? {}) },
      subscription: (() => {
        const sub = { ...freeSubscription, ...(parsed.subscription ?? {}) };
        // Accounts on the Free plan always have at least the 5 free minutes.
        if (!sub.planId && sub.minutesTotalSeconds < FREE_PLAN_SECONDS) sub.minutesTotalSeconds = FREE_PLAN_SECONDS;
        return sub;
      })(),
    };
  } catch {
    return defaultState;
  }
}

/* ---------------- Context ---------------- */

interface AppState extends PersistedState {
  hydrated: boolean;
  syncStatus: SyncStatus;
  retrySync: () => void;
  signIn: (profile?: Partial<UserProfile>) => void;
  signOut: () => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  subscribe: (planId: string, billing: "monthly" | "yearly") => void;
  cancelPlan: () => void;
  addMinutes: (seconds: number) => void;
  consumeMinutes: (seconds: number) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
  addNotification: (n: Omit<AppNotification, "id" | "time" | "read">) => void;
  markNotificationsRead: () => void;
  clearNotifications: () => void;
  addPost: (post: ScheduledPost) => void;
  updatePost: (id: string, patch: Partial<ScheduledPost>) => void;
  removePost: (id: string) => void;
  addSocialAccount: (platform: string, handle: string) => boolean;
  removeSocialAccount: (id: string) => void;
  preferences: Record<string, string | boolean>;
  updatePreference: (key: string, value: string | boolean) => void;
  draft: CreateDraft;
  updateDraft: (patch: Partial<CreateDraft>) => void;
  updatePost_Draft: (patch: Partial<PostMeta>) => void;
  resetDraft: () => void;
  minutesTotal: number;
  minutesUsed: number;
  planName: string;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<CreateDraft>(defaultDraft);
  const librarySync = useRef<LibrarySync | null>(null);
  const profileIdentity = useRef<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('signed-out');
  const retrySync = useCallback(() => { void librarySync.current?.flush(); }, []);
  const mutateLibrary = useCallback((collection: Collection, kind: LibraryOperation['kind'], id: string, value?: Record<string, unknown>) => {
    const sync = librarySync.current;
    if (!sync) { toast.error('Sign in before saving to your account.'); return; }
    sync.enqueue({ operationId: crypto.randomUUID(), collection, kind, id, ...(value ? { value } : {}) });
  }, []);

  useEffect(() => {
    // Keep legacy content intact until ownership is known; never merge unscoped data.
    try {
      const raw = window.localStorage.getItem(STATE_KEY);
      if (raw && !window.localStorage.getItem('storypop:legacy-library:v1')) {
        window.localStorage.setItem('storypop:legacy-library:v1', raw);
      }
    } catch { /* Storage may be unavailable. */ }
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      // User library content belongs only in an account-keyed cache/outbox.
      window.localStorage.setItem(STATE_KEY, JSON.stringify({ ...state, ...emptyLibrary() }));
    } catch {
      /* storage unavailable — state stays in memory */
    }
  }, [state, hydrated]);

  const patchState = useCallback((patch: Partial<PersistedState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const signIn = useCallback((profile?: Partial<UserProfile>) => {
    setState((prev) => {
      const user = { ...prev.user, ...(profile ?? {}) };
      if (!user.name && user.fullName) user.name = user.fullName.split(" ")[0] ?? "";
      return { ...prev, isAuthenticated: true, user };
    });
  }, []);

  const signOut = useCallback(() => {
    librarySync.current?.stop();
    librarySync.current = null;
    profileIdentity.current = null;
    setSyncStatus('signed-out');
    void import("@/integrations/supabase/client").then(({ supabase }) => supabase.auth.signOut());
    setState(defaultState);
    setDraft(defaultDraft);
  }, []);

  // Keep the signed-in user's profile in sync with the cloud database.
  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | undefined;
    void import("@/integrations/supabase/client").then(({ supabase }) => {
      const load = async (userId: string, email: string, metaName: string) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, bio")
          .eq("id", userId)
          .maybeSingle();
        if (cancelled || profileIdentity.current !== userId) return;
        let avatarUrl = profile?.avatar_url ?? "";
        if (avatarUrl.startsWith("storage:")) {
          const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(avatarUrl.slice(8), 60 * 60 * 24 * 7);
          avatarUrl = signed?.signedUrl ?? "";
        }
        if (cancelled || profileIdentity.current !== userId) return;
        const fullName = profile?.full_name || metaName;
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          user: {
            ...prev.user,
            email,
            fullName: fullName || prev.user.fullName,
            name: (fullName || prev.user.fullName).split(" ")[0] ?? "",
            avatar: avatarUrl || prev.user.avatar,
            bio: profile?.bio ?? prev.user.bio,
          },
        }));
      };
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
          profileIdentity.current = null;
          setState(defaultState);
          return;
        }
        if (!session?.user) {
          if (event === 'INITIAL_SESSION') setState(defaultState);
          return;
        }
        if (event !== "INITIAL_SESSION" && event !== "SIGNED_IN" && event !== "USER_UPDATED") return;
        const u = session.user;
        profileIdentity.current = u.id;
        // Defer to avoid calling Supabase inside the auth callback.
        setTimeout(() => void load(u.id, u.email ?? "", String(u.user_metadata?.["full_name"] ?? "")), 0);
      });
      unsub = () => data.subscription.unsubscribe();
    });
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  // One account-isolated outbox, serialized atomic writes, and foreground refreshes.
  useEffect(() => {
    let cancelled = false;
    let identity: string | null = null;
    let unsub: (() => void) | undefined;
    void import("@/integrations/supabase/client").then(({ supabase }) => {
      if (cancelled) return;
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event !== 'INITIAL_SESSION' && event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return;
        const id = session?.user.id ?? null;
        if (id === identity && event !== 'INITIAL_SESSION') return;
        identity = id;
        librarySync.current?.stop();
        librarySync.current = null;
        setState((prev) => ({ ...prev, ...emptyLibrary() }));
        if (!id) { setSyncStatus('signed-out'); return; }
        let checkedLegacy = false;
        const sync = new LibrarySync({
          userId: id,
          storage: window.localStorage,
          exchange: async (operations) => {
            // Import only a legacy account's first cloud library; existing cloud
            // rows remain authoritative so old devices cannot resurrect deletions.
            if (!checkedLegacy) {
              const { data: existing, error: lookupError } = await supabase.from('user_library').select('user_id').eq('user_id', id).maybeSingle();
              if (lookupError) throw lookupError;
              const raw = window.localStorage.getItem('storypop:legacy-library:v1');
              if (!existing && raw) {
                const legacy = JSON.parse(raw) as Partial<PersistedState>;
                if (session?.user.email && legacy.user?.email?.toLowerCase() === session.user.email.toLowerCase()) {
                  const library = parseLibrary(legacy);
                  for (const collection of ['projects', 'characters', 'posts', 'socialAccounts'] as const) {
                    for (const item of library[collection]) sync.enqueue({ operationId: `legacy:${collection}:${item.id}`, collection, kind: 'add', id: item.id, value: { ...item } });
                  }
                }
              }
              checkedLegacy = true;
            }
            const mapped = operations.map((op) => ({ ...op, collection: op.collection === 'socialAccounts' ? 'social_accounts' : op.collection }));
            const { data: cloud, error } = await supabase.rpc('sync_user_library', { operations: JSON.parse(JSON.stringify(mapped)) });
            if (error) throw error;
            return parseLibrary(cloud);
          },
          onChange: (library) => { if (!cancelled && identity === id) setState((prev) => ({ ...prev, ...library })); },
          onStatus: (status) => { if (!cancelled && identity === id) setSyncStatus(status); },
        });
        librarySync.current = sync;
        // Never call the database inside the auth event itself.
        setTimeout(() => { if (!cancelled && identity === id) sync.start(); }, 0);
      });
      unsub = () => data.subscription.unsubscribe();
    });
    const refresh = () => { if (document.visibilityState === 'visible') void librarySync.current?.flush(); };
    window.addEventListener('online', refresh);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      cancelled = true;
      unsub?.();
      librarySync.current?.stop();
      librarySync.current = null;
      window.removeEventListener('online', refresh);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const updateUser = useCallback((patch: Partial<UserProfile>) => {
    setState((prev) => ({ ...prev, user: { ...prev.user, ...patch } }));
    const row: { full_name?: string; bio?: string; avatar_url?: string } = {};
    if (patch.fullName !== undefined) row.full_name = patch.fullName;
    if (patch.bio !== undefined) row.bio = patch.bio;
    // Only persist real URLs, not temporary in-browser previews.
    // Uploaded photos are saved separately as a storage path; signed links expire, so never store them.
    if (patch.avatar !== undefined && !patch.avatar.startsWith("blob:") && !patch.avatar.startsWith("data:") && !patch.avatar.includes("/object/sign/")) row.avatar_url = patch.avatar;
    if (Object.keys(row).length === 0) return;
    void import("@/integrations/supabase/client").then(async ({ supabase }) => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      await supabase.from("profiles").upsert({ id: data.user.id, ...row, updated_at: new Date().toISOString() });
    });
  }, []);

  const subscribe = useCallback((planId: string, billing: "monthly" | "yearly") => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan || plan.id === "free") {
      setState((prev) => ({ ...prev, subscription: { ...freeSubscription, minutesUsedSeconds: prev.subscription.minutesUsedSeconds } }));
      return;
    }
    const renews = new Date();
    renews.setMonth(renews.getMonth() + (billing === "yearly" ? 12 : 1));
    setState((prev) => ({
      ...prev,
      subscription: {
        planId,
        billing,
        minutesTotalSeconds: plan?.minuteSeconds ?? prev.subscription.minutesTotalSeconds,
        minutesUsedSeconds: prev.subscription.minutesUsedSeconds,
        renewsOn: renews.toISOString(),
      },
    }));
  }, []);

  const cancelPlan = useCallback(() => {
    setState((prev) => ({ ...prev, subscription: { ...freeSubscription, minutesUsedSeconds: prev.subscription.minutesUsedSeconds } }));
  }, []);

  const addMinutes = useCallback((seconds: number) => {
    setState((prev) => ({
      ...prev,
      subscription: { ...prev.subscription, minutesTotalSeconds: prev.subscription.minutesTotalSeconds + seconds },
    }));
  }, []);

  const consumeMinutes = useCallback((seconds: number) => {
    setState((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        minutesUsedSeconds: Math.min(prev.subscription.minutesTotalSeconds, prev.subscription.minutesUsedSeconds + seconds),
      },
    }));
  }, []);

  const addProject = useCallback((project: Project) => {
    mutateLibrary('projects', 'add', project.id, { ...project });
  }, [mutateLibrary]);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    mutateLibrary('projects', 'patch', id, { ...patch });
  }, [mutateLibrary]);

  const removeProject = useCallback((id: string) => {
    mutateLibrary('projects', 'remove', id);
  }, [mutateLibrary]);

  const addCharacter = useCallback((character: Character) => {
    mutateLibrary('characters', 'add', character.id, { ...character });
  }, [mutateLibrary]);

  const removeCharacter = useCallback((id: string) => {
    mutateLibrary('characters', 'remove', id);
  }, [mutateLibrary]);

  const addNotification = useCallback((n: Omit<AppNotification, "id" | "time" | "read">) => {
    setState((prev) => ({
      ...prev,
      notifications: [
        { ...n, id: `n_${Date.now()}`, time: new Date().toISOString(), read: false },
        ...prev.notifications,
      ],
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((prev) => ({ ...prev, notifications: prev.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const clearNotifications = useCallback(() => patchState({ notifications: [] }), [patchState]);

  const addPost = useCallback((post: ScheduledPost) => {
    mutateLibrary('posts', 'add', post.id, { ...post });
  }, [mutateLibrary]);

  const updatePost = useCallback((id: string, patch: Partial<ScheduledPost>) => {
    mutateLibrary('posts', 'patch', id, { ...patch });
  }, [mutateLibrary]);

  const removePost = useCallback((id: string) => {
    mutateLibrary('posts', 'remove', id);
  }, [mutateLibrary]);

  const addSocialAccount = useCallback((platform: string, handle: string) => {
    const spec = platformSpecs.find((p) => p.id === platform);
    const clean = handle.trim().replace(/^@?/, "@");
    if (!spec || clean.length < 2) return false;
    if (!librarySync.current || state.socialAccounts.some((a) => a.platform === platform && a.handle.toLowerCase() === clean.toLowerCase())) return false;
    const id = `${platform}-${crypto.randomUUID()}`;
    mutateLibrary('socialAccounts', 'add', id, { id, platform, name: spec.name, handle: clean, connected: false });
    return true;
  }, [mutateLibrary, state.socialAccounts]);

  const removeSocialAccount = useCallback((id: string) => {
    mutateLibrary('socialAccounts', 'remove', id);
  }, [mutateLibrary]);

  const updatePreference = useCallback((key: string, value: string | boolean) => {
    setState((prev) => ({ ...prev, preferences: { ...prev.preferences, [key]: value } }));
  }, []);

  const updateDraft = useCallback((patch: Partial<CreateDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const updatePost_Draft = useCallback((patch: Partial<PostMeta>) => {
    setDraft((prev) => ({ ...prev, post: { ...prev.post, ...patch } }));
  }, []);

  const resetDraft = useCallback(() => setDraft({ ...defaultDraft, post: { ...emptyPost } }), []);

  const planName = state.subscription.planId
    ? (plans.find((p) => p.id === state.subscription.planId)?.name ?? "Free")
    : "Free";

  const value = useMemo<AppState>(
    () => ({
      ...state,
      hydrated,
      syncStatus,
      retrySync,
      signIn,
      signOut,
      updateUser,
      subscribe,
      cancelPlan,
      addMinutes,
      consumeMinutes,
      addProject,
      updateProject,
      removeProject,
      addCharacter,
      removeCharacter,
      addNotification,
      markNotificationsRead,
      clearNotifications,
      addPost,
      updatePost,
      removePost,
      addSocialAccount,
      removeSocialAccount,
      updatePreference,
      draft,
      updateDraft,
      updatePost_Draft,
      resetDraft,
      minutesTotal: state.subscription.minutesTotalSeconds,
      minutesUsed: state.subscription.minutesUsedSeconds,
      planName,
    }),
    [
      state,
      hydrated,
      syncStatus,
      retrySync,
      draft,
      planName,
      signIn,
      signOut,
      updateUser,
      subscribe,
      cancelPlan,
      addMinutes,
      consumeMinutes,
      addProject,
      updateProject,
      removeProject,
      addCharacter,
      removeCharacter,
      addNotification,
      markNotificationsRead,
      clearNotifications,
      addPost,
      updatePost,
      removePost,
      addSocialAccount,
      removeSocialAccount,
      updatePreference,
      updateDraft,
      updatePost_Draft,
      resetDraft,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
