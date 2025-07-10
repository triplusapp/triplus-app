import {ApiSettings} from "@/src/api/core/types";

const DefaultApiSettings: ApiSettings = {
    headers: new Headers({
        'Accept': 'application/json'
    }),
    baseURL: process.env.EXPO_PUBLIC_API_URL,
};

export default DefaultApiSettings;
