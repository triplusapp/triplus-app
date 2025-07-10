import DefaultApiSettings from "@/src/api/core/config";
import {RequestOptions} from "@/src/api/core/types";
import responseHandler from "@/src/api/core/responseHandler";
import TokenStorageNative from "@/src/auth/utils/TokenStorage.native";
import {getStorageItem} from "@/src/asyncStorage";
import {APP_LANGUAGE} from "@/src/i18n/LocalizationProvider";

export class ApiRequest {
    private options: RequestOptions;
    private readonly access_token: string | null;
    private readonly locale: string | null;

    constructor(accessToken: string | null, locale: string | null) {
        this.access_token = accessToken;
        this.locale = locale;
        this.options = this.defaultParameters();
    }

    /**
     * Relative endpoint. Ex: 'company'
     * @param endpoint
     */
    endpoint(endpoint: string): this {
        endpoint = endpoint.startsWith('/') ? endpoint : ('/' + endpoint);
        this.options.endpoint = DefaultApiSettings.baseURL + endpoint;
        return this;
    }

    /**
     * Absolute endpoint. Ex: 'https://base.tld/lorem'
     * @param endpoint
     */
    rawEndpoint(endpoint: string): this {
        this.options.endpoint = endpoint;
        return this;
    }

    queryParameters(params: { [key: string]: any }): this {
        this.options.queryParameters = params;
        return this;
    }

    bodyData(data: FormData | Record<string, unknown>): this {
        this.options.bodyData = data;
        return this;
    }


    requiresAuth(): this {
        this.options.requiresAuth = true;
        return this;
    }

    post(): Promise<any> {
        return this.executeRequest('POST');
    }

    put(): Promise<any> {
        return this.executeRequest('PUT');
    }

    patch(): Promise<any> {
        return this.executeRequest('PATCH');
    }

    get(): Promise<any> {
        return this.executeRequest('GET');
    }

    delete(): Promise<any> {
        return this.executeRequest('DELETE');
    }

    resetOptions(): void {
        this.options = this.defaultParameters();
    }

    private async executeRequest(requestMethod: string): Promise<any> {
        let url = this.options.endpoint;
        let queryParameters = this.options.queryParameters ?? {};
        queryParameters.locale = this.locale ?? 'es';
        url += '?' + this.prepareQueryParamString(queryParameters);

        const request: Request = this.createRequest(
            url,
            requestMethod,
            await this.preparedHeaders(this.options.requiresAuth, this.options.bodyData),
            (this.options.bodyData) ? this.preparedBodyData(this.options.bodyData) : null,
        );

        this.resetOptions();

        const response: Response = await fetch(request);
        return await responseHandler(response);
    }


    private defaultParameters(): RequestOptions {
        return {
            endpoint: '',
            bodyData: null,
            queryParameters: null,
            requiresAuth: false,
        };
    }

    private async preparedHeaders(requiresAuth: boolean, bodyData: FormData | Record<string, unknown> | null): Promise<Headers> {
        let headers: Headers = new Headers(DefaultApiSettings.headers);
        if (requiresAuth) {
            if (!this.access_token) {
                throw new Error('Request requires auth');
            }
            headers.append('Authorization', `Bearer ${this.access_token}`);
        }
        if (bodyData instanceof FormData) {
            headers.append('Content-Type', 'multipart/form-data');
        } else if (bodyData && !(bodyData instanceof FormData)) {
            headers.append('Content-Type', 'application/json');
        }
        return headers;
    }

    private preparedBodyData(data: FormData | Record<string, unknown>): FormData | string {
        return data instanceof FormData ? data : JSON.stringify(data);
    }

    private createRequest(url: string, method: string, headers: Headers, body: BodyInit | null): Request {
        let init: RequestInit = {
            method: method,
            headers: headers,
        };
        if (body) {
            init.body = body;
        }
        return new Request(url, init);
    }

    private prepareQueryParamString(params: { [key: string]: any }): string {
        return Object.keys(params)
            .map(key => {
                if (Array.isArray(params[key])) {
                    return params[key].map((value: any) => `${encodeURIComponent(key)}%5B%5D=${encodeURIComponent(value)}`).join('&');
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
            })
            .join('&');
    }
}

export const apiServerRequest = async () => {
    const accessToken = await TokenStorageNative.getToken();
    const locale = await getStorageItem(APP_LANGUAGE);

    return new ApiRequest(accessToken, locale);
}
