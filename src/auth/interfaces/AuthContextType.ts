import type { User } from './User';

export interface AuthContextType {
  getToken: () => Promise<string | null>;
  currentUser: User | null;
  updateUser: () => Promise<User | null>;
  isAuthenticated: boolean|null;
  setUserIsAuthenticated: (userIsAuthenticated: boolean) => void;
  login: (
    email: string,
    password: string,
    deviceName: string
  ) => Promise<boolean | null>;
  logout: () => Promise<boolean>;
  destroy: () => Promise<boolean>;
  hasBeenOnboarded: boolean|null;
  setUserHasBeenOnboarded: (onboarded: boolean) => void;
  notificationPermissionRequested: boolean;
  setUserNotificationPermissionRequested: (requested: boolean) => void;
}
