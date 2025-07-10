import React from "react";
import { Text, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import ThemedModal from "@/components/forms/ThemedModal";
import PrimaryButton from "@/components/forms/PrimaryButton";
import i18n from "@/src/i18n";
import BellIcon from "@/components/svgs/bellIcon";

export default function NotificationPermissionInfoModal({ visible, onDeny, onAccept }: {
    visible: boolean;
    onDeny: () => void;
    onAccept: () => void;
}) {
    return (
        <ThemedModal visible={visible} onRequestClose={onDeny}>
            <BellIcon width={24} height={24}/>
            <Text className="text-xl font-bold">{i18n.t("push_notification_permission_info_modal.title")}</Text>
            <Text className="text-center">{i18n.t("push_notification_permission_info_modal.message")}</Text>

            <PrimaryButton handleSubmit={onAccept} text={i18n.t("push_notification_permission_info_modal.allow")} />

            <Pressable className="px-4 py-2" onPress={onDeny}>
                <Text className="text-brand-green font-bold">{i18n.t("push_notification_permission_info_modal.deny")}</Text>
            </Pressable>
        </ThemedModal>
    );
}
