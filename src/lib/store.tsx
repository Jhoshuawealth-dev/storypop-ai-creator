import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
} from "./catalog";

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
  minutesTotalSeconds: 60,
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
  socialAccounts: platformSpecs.map((p) => ({ id: p.id, name: p.name, connected: false, handle: "" })),
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
      user: { ...emptyUser, ...(parsed.user ?? {}) },
      subscription: { ...freeSubscription, ...(parsed.subscription ?? {}) },
      socialAccounts: parsed.socialAccounts?.length ? parsed.socialAccounts : defaultState.socialAccounts,
    };
  } catch {
    return defaultState;
  }
}

/* ---------------- Context ---------------- */

interface AppState extends PersistedState {
  hydrated: boolean;
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
  toggleSocial: (id: string, handle?: string) => void;
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

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
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
    setState((prev) => ({ ...prev, isAuthenticated: false }));
  }, []);

  const updateUser = useCallback((patch: Partial<UserProfile>) => {
    setState((prev) => ({ ...prev, user: { ...prev.user, ...patch } }));
  }, []);

  const subscribe = useCallback((planId: string, billing: "monthly" | "yearly") => {
    const plan = plans.find((p) => p.id === planId);
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
    setState((prev) => ({ ...prev, projects: [project, ...prev.projects] }));
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setState((prev) => ({ ...prev, projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setState((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  }, []);

  const addCharacter = useCallback((character: Character) => {
    setState((prev) => ({ ...prev, characters: [character, ...prev.characters] }));
  }, []);

  const removeCharacter = useCallback((id: string) => {
    setState((prev) => ({ ...prev, characters: prev.characters.filter((c) => c.id !== id) }));
  }, []);

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
    setState((prev) => ({ ...prev, posts: [post, ...prev.posts] }));
  }, []);

  const updatePost = useCallback((id: string, patch: Partial<ScheduledPost>) => {
    setState((prev) => ({ ...prev, posts: prev.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }, []);

  const removePost = useCallback((id: string) => {
    setState((prev) => ({ ...prev, posts: prev.posts.filter((p) => p.id !== id) }));
  }, []);

  const toggleSocial = useCallback((id: string, handle?: string) => {
    setState((prev) => ({
      ...prev,
      socialAccounts: prev.socialAccounts.map((a) =>
        a.id === id ? { ...a, connected: !a.connected, handle: !a.connected ? (handle ?? a.handle) : "" } : a
      ),
    }));
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
      toggleSocial,
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
      toggleSocial,
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
