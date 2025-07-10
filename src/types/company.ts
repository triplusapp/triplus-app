import {Media} from "@/src/types/media";

export interface Company {
    id: string;
    name: string;
    num_products: number;
    num_requested_products: number;
    legal_name: string | null;
    address: string | null;
    description: string | null;
    media: Media[];
}

