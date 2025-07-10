import {UserAvatar} from "@/src/types/media";

export interface User {
  id: number;
  name: string;
  location: string|null;
  email: string;
  level: number;
  points: number
  next_level_starting_points: number;
  next_level_percentage: number;
  locale: string;
  notifications_allowed: boolean;
  unread_notifications_count: number;
  avatar: UserAvatar | null;
}
