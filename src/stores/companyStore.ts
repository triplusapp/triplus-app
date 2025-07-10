import {create} from 'zustand';
import {Company} from "@/src/types/company";

interface CompanyState {
    company: Company | null;
    setCompany: (company: Company | null) => void;
}


export const useCompanyStore = create<CompanyState>((set) => ({
    company: null,
    setCompany: (company) => set({company: company}),
}))
