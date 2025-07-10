import {apiServerRequest} from "@/src/api/core/apiRequest";
import {UserExperienceHistory, UserExperienceHistoryItem} from "@/src/types/userExperience";
import moment from "moment/moment";
import {User} from "@/src/auth";

export const userService = {

    async register(name: string, locale: string, email: string, password: string): Promise<void> {
        await (await apiServerRequest())
            .endpoint('register')
            .bodyData({
                name: name,
                locale: locale,
                email: email,
                password: password
            })
            .post();
    },

    async forgotPassword(email: string): Promise<{ message: string }> {
        return await (await apiServerRequest())
            .endpoint('forgot-password')
            .bodyData({
                email: email,
            })
            .post();
    },

    async resetPassword(email: string, password: string, token: string): Promise<{ message: string }> {
        return await (await apiServerRequest())
            .endpoint('reset-password')
            .bodyData({
                email: email,
                password: password,
                token: token,
            })
            .post();
    },

    async fetchUser(): Promise<User> {
        return await (await apiServerRequest())
            .endpoint('customer')
            .requiresAuth()
            .get()
    },

    async deleteAccount(): Promise<User> {
        return await (await apiServerRequest())
            .endpoint('customer/delete')
            .requiresAuth()
            .post()
    },

    async updateSettings(locale: string, notifications: boolean): Promise<void> {
        await (await apiServerRequest())
            .endpoint('customer/settings')
            .requiresAuth()
            .bodyData({
                locale: locale,
                notifications: notifications,
            })
            .patch()
    },

    async updateProfile(name: string, location:string|null, avatar:string|null): Promise<void> {
        await (await apiServerRequest())
            .endpoint('customer/profile')
            .requiresAuth()
            .bodyData({
                name: name,
                location: location,
                ...(avatar) && {avatar: avatar},
            })
            .patch()
    },
    async addPushNotificationToken(token: string): Promise<void> {
        await (await apiServerRequest())
            .endpoint('customer/add-token')
            .requiresAuth()
            .bodyData({token: token})
            .patch()
    },
    async fetchExperience(page: number = 1): Promise<UserExperienceHistory> {
        const response = await (await apiServerRequest())
            .endpoint('points-history')
            .queryParameters({
                page: page,
            })
            .requiresAuth()
            .get();

        const itemsWithMomentDates = response.data.map((item: UserExperienceHistoryItem) => ({
            ...item,
            created_at: moment(item.created_at)
        }));

        return {
            ...response,
            data: itemsWithMomentDates
        };
    },
};
