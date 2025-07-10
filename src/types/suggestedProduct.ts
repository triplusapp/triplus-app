import {ProductType} from "@/src/types/productType";
import {ImagePickerAsset} from "expo-image-picker/src/ImagePicker.types";

export interface SuggestedProduct {
    type: ProductType.SuggestedProduct;
    id: number;
    name: string;
    status: 'pending' | 'accepted';
    barcode: string;
    brand?: string | null;
    company_name?: string | null;
    format: string;
    image: string;
    company_request: boolean;
    company_num_request: number;
}

export interface UserProductSuggestionSubmission {
    barcode?: string | null;
    name: string;
    format?: string | null;
    brand?: string | null;
    company_name: string;
    company_email?: string | null;
    comments?: string | null;
    image: ImagePickerAsset;
}

export interface UserProductSuggestionResponse {
    existing?: boolean;
    id?: string;
}
