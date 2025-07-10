import {PaginationLinks, PaginationMeta} from "@/src/types/pagination";
import moment from "moment";

export interface Notification {
    id: string;
    is_read: boolean;
    message: string;
    date: moment.Moment;
}

export interface NotificationList {
    data: Notification[];
    links: PaginationLinks;
    meta: PaginationMeta;
}
