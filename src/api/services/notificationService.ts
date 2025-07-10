import {apiServerRequest} from "@/src/api/core/apiRequest";
import {Notification, NotificationList} from "@/src/types/notification";
import moment from "moment";

export const notificationService = {

    async fetch(page: number = 1): Promise<NotificationList> {
        const response = await (await apiServerRequest())
            .endpoint('notifications')
            .requiresAuth()
            .queryParameters({
                page: page
            })
            .get();

        const notificationsWithMomentDates = response.data.map((notification: Notification) => ({
            ...notification,
            date: moment(notification.date)
        }));

        return {
            ...response,
            data: notificationsWithMomentDates
        };
    },

    async markAllAsRead(): Promise<void> {
        await (await apiServerRequest())
            .endpoint('notifications/read-all')
            .requiresAuth()
            .patch();
    },

    async markAsread(notificationId: string): Promise<void> {
        await (await apiServerRequest())
            .endpoint(`notifications/read/${notificationId}`)
            .requiresAuth()
            .patch();
    },
};
