import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { currentUser, defaultScenes, defaultScript, usage, type Scene } from "./mock-data";

const AUTH_KEY = "storypop-auth";

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
}

const defaultDraft: CreateDraft = {
  idea: "",
  audience: "Young adults",
  tone: "Funny",
  platform: "TikTok",
  cta: "Shop now",
  script: defaultScript,
  scenes: defaultScenes,
  characterId: "joshua",
  voiceId: "david",
  styleId: "3d",
  duration: 30,
  ratio: "9:16",
};

interface AppState {
  isAuthenticated: boolean;
  user: typeof currentUser;
  signIn: () => void;
  signOut: () => void;
  draft: CreateDraft;
  updateDraft: (patch: Partial<CreateDraft>) => void;
  resetDraft: () => void;
  minutesTotal: number;
  minutesUsed: number;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(AUTH_KEY) === "1";
  });
  const [draft, setDraft] = useState<CreateDraft>(defaultDraft);

  const signIn = useCallback(() => {
    window.localStorage.setItem(AUTH_KEY, "1");
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  const updateDraft = useCallback((patch: Partial<CreateDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraft(defaultDraft), []);

  const value = useMemo<AppState>(
    () => ({
      isAuthenticated,
      user: currentUser,
      signIn,
      signOut,
      draft,
      updateDraft,
      resetDraft,
      minutesTotal: usage.totalSeconds,
      minutesUsed: usage.usedSeconds,
    }),
    [isAuthenticated, draft, signIn, signOut, updateDraft, resetDraft]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
