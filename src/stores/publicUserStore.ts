import {create} from 'zustand';
import {PublicUser} from "@/src/types/publicUser";

interface PublicUserState {
    publicUser: PublicUser | null;
    setPublicUser: (publicUser: PublicUser | null) => void;
}


export const usePublicUserStore = create<PublicUserState>((set) => ({
    publicUser: null,
    setPublicUser: (publicUser) => set({publicUser: publicUser}),
}))
