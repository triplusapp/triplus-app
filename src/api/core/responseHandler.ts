import {ApiResponseError} from "@/src/api/core/apiResponseError";

const responseHandler = async function (response: Response): Promise<any> {
    return response.text().then(async (text: string) => {
        const data = text && JSON.parse(text);
        if (response.ok) {
            return JSON.parse(text);
        }

        const errorMessage: string = (data && data.message) || response.statusText;
        const errors: any[] = (data && data.errors) || [];

        const responseError: ApiResponseError = new ApiResponseError(
            response.status,
            errorMessage,
            errors
        );

        return Promise.reject(responseError);
    });
}

export default responseHandler;
