export interface RequestOptions {
    endpoint: string;
    bodyData: FormData | Record<string, unknown> | null;
    queryParameters: { [key: string]: any } | null,
    requiresAuth: boolean;
}

export interface ApiSettings {
    headers: Headers;
    baseURL: string | undefined;
}
