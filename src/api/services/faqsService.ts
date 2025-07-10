import {apiServerRequest} from "@/src/api/core/apiRequest";
import {FaqCategory} from "@/src/types/faqs";

export const faqsService = {

    async fetchFaqs(): Promise<FaqCategory[]> {
        const response = await (await apiServerRequest())
            .endpoint('faqs')
            .get();
        return response as FaqCategory[];
    },

};
