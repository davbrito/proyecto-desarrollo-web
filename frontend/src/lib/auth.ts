import { createStore } from "zustand/vanilla";

interface SessionData {
  token: string;
}

interface AuthState {
  session: SessionData | null;
  setSession: (session: SessionData | null) => void;
}

const authStore = createStore<AuthState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function getSession(): Promise<SessionData | null> {
  const state = authStore.getState();
  if (state.session) {
    return state.session;
  }

  await refreshSession();

  return authStore.getState().session;
}

export async function refreshSession(): Promise<SessionData | null> {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    const data: SessionData = await response.json();
    authStore.getState().setSession(data);
    return data;
  } else {
    authStore.getState().setSession(null);
    return null;
  }
}
