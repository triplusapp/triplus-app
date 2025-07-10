import {apiServerRequest} from "@/src/api/core/apiRequest";
import {Company} from "@/src/types/company";
import {ProductList} from "@/src/types/product";

export const companyService = {

    async fetch(companyId: string): Promise<Company> {
        const response = await (await apiServerRequest())
            .endpoint(`companies/${companyId}`)
            .get();

        return response as Company;
    },

    async fetchProducts(userAuthenticated: boolean, companyId: string, page: number = 1): Promise<ProductList> {
        let apiRequest = (await apiServerRequest())
            .queryParameters({
                page: page
            });

        if (userAuthenticated) {
            apiRequest = apiRequest
                .endpoint(`companies/${companyId}/products`)
                .requiresAuth();
        } else {
            apiRequest = apiRequest.endpoint(`guest/companies/${companyId}/products`);
        }

        const response = await apiRequest.get();

        return response as ProductList;
    },
};
