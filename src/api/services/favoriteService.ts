import {apiServerRequest} from "@/src/api/core/apiRequest";
import {ProductList} from "@/src/types/product";

export const favoriteService = {

    async fetchProducts(page: number = 1, search: string): Promise<ProductList> {
        const response = await (await apiServerRequest())
            .endpoint('favorites')
            .queryParameters({
                page: page,
                search: search,
            })
            .requiresAuth()
            .get();
        return response as ProductList;
    },

    async favorite(productId: string): Promise<void> {
        await (await apiServerRequest())
            .endpoint(`favorite/${productId}`)
            .requiresAuth()
            .put();
    },

    async unfavorite(productId: string): Promise<void> {
        await (await apiServerRequest())
            .endpoint(`unfavorite/${productId}`)
            .requiresAuth()
            .put();
    },

    async fetchUserFavoriteProducts(customerId: number, page: number = 1): Promise<ProductList> {
        const response = await (await apiServerRequest())
            .endpoint(`customer/${customerId}/favorites`)
            .queryParameters({
                page: page,
            })
            .requiresAuth()
            .get();
        return response as ProductList;
    },
};
