import {apiServerRequest} from "@/src/api/core/apiRequest";
import {
    SuggestedProduct,
    UserProductSuggestionResponse,
    UserProductSuggestionSubmission
} from "@/src/types/suggestedProduct";
import {
    Escandall,
    FactorScore,
    Ingredient,
    MaterialGeneticIndicator,
    ModelRamaderIndicator,
    Product
} from "@/src/types/product";
import {ApiResponseError} from "@/src/api/core/apiResponseError";
import {Platform} from "react-native";


export const productService = {
    async fetchProduct(productId: string, userAuthenticated: boolean): Promise<Product> {
        let apiRequest;

        if (userAuthenticated) {
            apiRequest = (await apiServerRequest())
                .endpoint(`product/${productId}`)
                .requiresAuth();
        } else {
            apiRequest = (await apiServerRequest())
                .endpoint(`guest/product/${productId}`)
        }

        const response = await apiRequest.get();

        return response as Product;
    },

    async suggestProduct(data: UserProductSuggestionSubmission): Promise<UserProductSuggestionResponse> {
        const formData = new FormData();
        formData.append('barcode', data.barcode ?? '');
        formData.append('name', data.name);
        formData.append('format', data.format ?? '');
        formData.append('brand', data.brand ?? '');
        formData.append('company_name', data.company_name);
        formData.append('company_email', data.company_email ?? '');
        formData.append('comments', data.comments ?? '');

        if (data.image) {
            const uri =
                Platform.OS === "android"
                    ? data.image.uri
                    : data.image.uri.replace("file://", "");
            const filename = data.image.uri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename as string);
            const ext = match?.[1];
            const type = match ? `image/${match[1]}` : `image`;

            formData.append("photo", {
                uri,
                name: `image.${ext}`,
                type,
            } as any);
        }

        const response = await (await apiServerRequest())
            .endpoint('product-request')
            .requiresAuth()
            .bodyData(formData)
            .post();

        return response as UserProductSuggestionResponse;
    },

    async attachProductSuggestion(barcode: string): Promise<void> {
        try {
            await (await apiServerRequest())
                .endpoint('product-request/attach')
                .requiresAuth()
                .bodyData({
                    barcode: barcode
                })
                .post();
        } catch (responseError) {
            if (responseError instanceof ApiResponseError) {
                console.log(responseError.statusCode);
                console.error(responseError.message);
                console.log(responseError.errors);
            } else {
                // Si no és del tipus esperat, pots fer alguna cosa com manejar l'error o llençar-ne un altre
                console.error("Error inesperat:", responseError);
            }
        }
    },

    async reportProduct(productId: string, message: string | null): Promise<void> {
        try {
            await (await apiServerRequest())
                .endpoint(`product/${productId}/report`)
                .requiresAuth()
                .bodyData({
                    message: message
                })
                .post();
        } catch (responseError) {
            if (responseError instanceof ApiResponseError) {
                console.log(responseError.statusCode);
                console.error(responseError.message);
                console.log(responseError.errors);
            } else {
                // Si no és del tipus esperat, pots fer alguna cosa com manejar l'error o llençar-ne un altre
                console.error("Error inesperat:", responseError);
            }
        }
    },

    async barcodeSearch(barcode: string, userAuthenticated: boolean): Promise<Product | SuggestedProduct> {
        let apiRequest = (await apiServerRequest());
        if (userAuthenticated) {
            apiRequest = apiRequest
                .endpoint('product-barcode-search')
                .requiresAuth();
        } else {
            apiRequest = apiRequest.endpoint('guest/product-barcode-search');
        }

        const response = await apiRequest
            .queryParameters({
                barcode: barcode,
            })
            .get();

        return response as Product | SuggestedProduct;
    },

    async fetchIngredients(productId: string): Promise<Ingredient[]> {
        const response = await (await apiServerRequest())
            .endpoint(`product/${productId}/ingredients`)
            .get();

        return response as Ingredient[];
    },
    async fetchDetailedScore(productId: string): Promise<FactorScore[]> {
        const response = await (await apiServerRequest())
            .endpoint(`product/${productId}/score-detail`)
            .get();

        return response as FactorScore[];
    },
    async fetchDescriptiveIndicators(productId: string): Promise<{
        escandall: Escandall[] | null;
        model_ramader: ModelRamaderIndicator | null;
        map_image_url: string | null;
        material_genetic: MaterialGeneticIndicator | null;
    }> {
        const response = await (await apiServerRequest())
            .endpoint(`product/${productId}/descriptive-indicators`)
            .get();

        const escandall: Escandall[] | null = (response.escandall === null)
            ? null
            : response.escandall as Escandall[];

        const model_ramader: ModelRamaderIndicator | null = (response.model_ramader === null)
            ? null
            : response.model_ramader as ModelRamaderIndicator;

        const material_genetic: MaterialGeneticIndicator | null = (response.material_genetic === null)
            ? null
            : response.material_genetic as MaterialGeneticIndicator;

        return {
            escandall: escandall,
            model_ramader: model_ramader,
            map_image_url: response.map_image_url,
            material_genetic: response.material_genetic
        };
    },
    async otherSimilarProducts(productId: string): Promise<Product[]> {
        const response = await (await apiServerRequest())
            .endpoint(`product/${productId}/other-similar-products`)
            .get();

        return response as Product[];
    },
    async moreSustainableAlternatives(productId: string): Promise<Product[]> {
        const response = await (await apiServerRequest())
            .endpoint(`product/${productId}/more-sustainable-alternatives`)
            .get();

        return response as Product[];
    },
    async otherBrandProducts(productId: string): Promise<Product[]> {
        const response = await (await apiServerRequest())
            .endpoint(`product/${productId}/other-brand-products`)
            .get();

        return response as Product[];
    },
};
