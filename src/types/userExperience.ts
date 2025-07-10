import {PaginationLinks, PaginationMeta} from "@/src/types/pagination";
import moment from "moment/moment";

export interface UserExperienceHistoryItem {
    points: number;
    reason: string;
    type: 'add' | 'level_up';
    created_at: moment.Moment;
}

export interface UserExperienceHistory {
    data: UserExperienceHistoryItem[];
    links: PaginationLinks;
    meta: PaginationMeta;
}
