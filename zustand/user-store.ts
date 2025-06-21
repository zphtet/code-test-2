import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  _hasHydrated: boolean;
  loginUser: (user: User) => void;
  logOut: () => void;
  setHasHydrated: (state: boolean) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,
      loginUser: (user) => set({ user }),
      logOut: () => set({ user: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

export default useUserStore;
