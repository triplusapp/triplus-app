import {UserAvatar} from "@/src/types/media";

export interface PublicUser {
    id: number;
    name: string;
    location: string|null;
    image: string;
    level: number;
    points: number;
    next_level_starting_points: number;
    next_level_percentage: number;
    avatar: UserAvatar | null;
}
