import moment from "moment/moment";
import {Product} from "@/src/types/product";
import {User} from "@/src/auth";
import {Company} from "@/src/types/company";
import {PaginationLinks, PaginationMeta} from "@/src/types/pagination";
import {Notification} from "@/src/types/notification";
import {SuggestedProduct} from "@/src/types/suggestedProduct";

export interface TimeLineItem {
    date: moment.Moment;
    performed_by?: User | null;
    action: 'scan' | 'favorite' | 'product_search' | 'product_request' | 'new_product' | 'new_company',
    action_label: string,
    product: Product | null;
    product_request: SuggestedProduct | null;
    company: Company | null;
    data: any;
}

export interface TimeLineItemsList {
    data: TimeLineItem[];
    links: PaginationLinks;
    meta: PaginationMeta;
}
