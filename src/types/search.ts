import {Product} from "@/src/types/product";
import {Company} from "@/src/types/company";
import moment from "moment/moment";
import {PaginationLinks, PaginationMeta} from "@/src/types/pagination";
import {SuggestedProduct} from "@/src/types/suggestedProduct";

export enum SearchableType {
    Product = 'product',
    Company = 'company',
    ProductRequest = 'product_request',
}

export enum SearchSortBy {
    Score = 'score',
    Name = 'name',
    Favorites = 'favorites',
}

export interface ApiSearchResponseItem {
    type: SearchableType;
    model: Product | Company | SuggestedProduct;
}

export interface SearchResponseList {
    data: ApiSearchResponseItem[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface ApiSearchHistoryResponseItem {
    created_at: moment.Moment;
    id: string,
    searchable_type: SearchableType;
    searchable: Product | Company;
}

export interface SearchHistoryList {
    data: ApiSearchHistoryResponseItem[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

