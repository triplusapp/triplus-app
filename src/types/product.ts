import {PaginationLinks, PaginationMeta} from "@/src/types/pagination";
import {Company} from "@/src/types/company";
import {ProductType} from "@/src/types/productType";
import {Media} from "@/src/types/media";

export interface Ingredient {
    name: string;
}

export interface Product {
    type: ProductType.Product;
    id: string;
    company: Company;
    name: string;
    description: string;
    format: string;
    brand_name: string;
    features: {
        vegan?: boolean,
        vegetarian?: boolean,
        gluten_free?: boolean,
        organic?: boolean,
        biodynamic?: boolean,
        fair_trade?: boolean,
    };
    barcode: string;
    favorited: boolean;
    num_favorites: number;
    image: string;
    media: Media[];
    stamp: string;
    stamp_background_color: string;
    stamp_text_color: string;
}

export interface ProductList {
    data: Product[];
    links: PaginationLinks;
    meta: PaginationMeta;
}


export interface IndicatorScore {
    name: string;
    color: string;
    score: number;
    description: string;
}

export interface CategoryScore {
    name: string;
    color: string;
    score: number;
    indicators: IndicatorScore[];
}

export interface FactorScore {
    name: string;
    factor: Factor;
    color: string;
    categories: CategoryScore[];
}

export enum Factor {
    Economic = 'economic',
    Environmental = 'environmental',
    Social = 'social',
}

export interface Escandall {
    label: string,
    percentage: number,
    color: string,
}

export interface ModelRamaderIndicator {
    icon: string,
    color: string,
    info: string,
}

export interface MaterialGeneticIndicator {
    color: string,
    info: string,
}
