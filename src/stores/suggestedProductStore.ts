import {create} from 'zustand';
import {SuggestedProduct} from "@/src/types/suggestedProduct";

interface SuggestedProductState {
    suggestedProduct: SuggestedProduct | null;
    setSuggestedProduct: (product: SuggestedProduct | null) => void;
}


export const useSuggestedProductStore = create<SuggestedProductState>((set) => ({
    suggestedProduct: null,
    setSuggestedProduct: (product) => set({suggestedProduct: product}),
}))
