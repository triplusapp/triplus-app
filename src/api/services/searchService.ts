import {apiServerRequest} from "@/src/api/core/apiRequest";
import moment from "moment";
import {
    ApiSearchHistoryResponseItem,
    ApiSearchResponseItem,
    SearchableType,
    SearchHistoryList, SearchResponseList, SearchSortBy
} from "@/src/types/search";

export const searchService = {
    async search(page: number, term: string | null, filters: string[], sortBy: SearchSortBy | null, userAuthenticated: boolean): Promise<SearchResponseList> {
        if (term?.trim() === '') {
            term = null;
        }

        let apiRequest = (await apiServerRequest());

        if (userAuthenticated) {
            apiRequest = apiRequest.endpoint('search').requiresAuth();
        } else {
            apiRequest = apiRequest.endpoint('guest/search');
        }

        apiRequest = apiRequest.queryParameters({
            page: page,
            term: term ?? '',
            filters: filters,
            sortBy: sortBy ?? '',
        });

        const response = await apiRequest.get();

        return response as SearchResponseList;
    },
    async fetchSearchHistory(page: number): Promise<SearchHistoryList> {
        const response = await (await apiServerRequest())
            .endpoint('search-history')
            .requiresAuth()
            .queryParameters({
                page: page,
            })
            .get();

        const itemsWithMomentDates = response.data.map((item: ApiSearchHistoryResponseItem) => ({
            ...item,
            created_at: moment(item.created_at)
        }));

        return {
            ...response,
            data: itemsWithMomentDates
        };
    },
    async addSearchHistory(id: string, searchable_type: SearchableType): Promise<void> {
        await (await apiServerRequest())
            .endpoint('search-history')
            .requiresAuth()
            .bodyData({
                id: id,
                searchable_type: searchable_type,
            })
            .post();
    }
};
