import {apiServerRequest} from "@/src/api/core/apiRequest";
import {Product} from "@/src/types/product";
import {PublicUser} from "@/src/types/publicUser";
import moment from "moment/moment";
import {TimeLineItem, TimeLineItemsList} from "@/src/types/timeLineItem";
import {SuggestedProduct} from "@/src/types/suggestedProduct";

export const communityService = {

    async top10users(): Promise<PublicUser[]> {
        const response = await (await apiServerRequest())
            .endpoint('community/ranking-customers')
            .requiresAuth()
            .get();

        return response as PublicUser[];
    },

    async top10products(): Promise<Product[]> {
        const response = await (await apiServerRequest())
            .endpoint('community/ranking-products')
            .requiresAuth()
            .get();

        return response as Product[];
    },

    async lastFavorites(): Promise<Product[]> {
        const response = await (await apiServerRequest())
            .endpoint('community/last-favorites')
            .requiresAuth()
            .get();

        return response as Product[];
    },

    async lastTimeLineItems(page: number = 1): Promise<TimeLineItemsList> {
        const response = await (await apiServerRequest())
            .endpoint('community/time-line')
            .requiresAuth()
            .queryParameters({
                page: page
            })
            .get();

        const transformedItems = response.data.map((timeLineItem: TimeLineItem) => ({
            ...timeLineItem,
            date: moment(timeLineItem.date)
        }));

        return {
            ...response,
            data: transformedItems
        };
    },

    async lastProducts(): Promise<Product[]> {
        const response = await (await apiServerRequest())
            .endpoint('community/last-products')
            .requiresAuth()
            .get();

        return response as Product[];
    },

    async lastProductRequests(): Promise<SuggestedProduct[]> {
        const response = await (await apiServerRequest())
            .endpoint('community/last-requests')
            .requiresAuth()
            .get();

        return response as SuggestedProduct[];
    },
};
