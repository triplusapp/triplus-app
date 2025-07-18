import React, { useEffect, useState } from 'react';
import type { AuthConfig } from '../interfaces/AuthConfig';
import AuthContext from './AuthContext';
import type { AuthProviderProps } from '../interfaces/AuthProviderProps';
import type { User } from '../interfaces/User';
import AuthService from '../services/AuthService';
import TokenStorage from '../utils/TokenStorage';
import {getStorageItem, setStorageItem} from "@/src/asyncStorage";

const AuthProvider: React.FC<AuthProviderProps> = ({ config, children }) => {
  const [currentConfig, setCurrentConfig] = useState<AuthConfig>(config);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean|null>(null);
  const [authService, setAuthService] = useState<AuthService | undefined>();
  const [hasBeenOnboarded, setHasBeenOnboarded] = useState<boolean|null>(null);
  const [notificationPermissionRequested, setNotificationPermissionRequested] = useState<boolean>(false);

  useEffect(() => {
    if (authService) {
      checkIfAuthenticated();
      checkIfOnBoarded();
      checkIfNotificationPermissionHasBeenRequested();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authService]);

  useEffect(() => {
    return setAuthService(new AuthService(currentConfig));
  }, [currentConfig]);

  useEffect(() => {
    setCurrentConfig(config);
  }, [config]);


  const checkIfOnBoarded = async () => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      let hasBeenOnBoarded = await getStorageItem('onboarded');
      if (hasBeenOnBoarded === '1') {
        setUserHasBeenOnboarded(true);
      } else {
        setUserHasBeenOnboarded(false);
      }
    } catch (error) {
      console.error('Error while checking token:', error);
      throw error;
    }
  };

  const checkIfAuthenticated = async () => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    const token = await getToken();
    if (! token) {
      setUserIsAuthenticated(false);
      return
    }
    try {
      await updateUser().then((user) => {
        if (user === null) {
          setUserIsAuthenticated(false);
        } else if (user.id) {
          setUserIsAuthenticated(true);
        }
      });
    } catch (error) {
      console.error('[AuthProvider] Error while checking token:', error);
      throw error;
    }
  };

  const checkIfNotificationPermissionHasBeenRequested = async () => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      let hasBeenRequested = await getStorageItem('notification_permission_requested');
      if (hasBeenRequested === '1') {
        setNotificationPermissionRequested(true);
      } else {
        setNotificationPermissionRequested(false);
      }
    } catch (error) {
      console.error('Error while checking token:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string, deviceName: string) => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      return await authService.login(email, password, deviceName);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const updateUser = async (): Promise<User | null> => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      return await authService.getUser().then((fetchedUser) => {
        setCurrentUser(fetchedUser);
        return fetchedUser;
      });
    } catch (error) {
      console.error('[AuthProvider] Error while fetching user:', error);
      throw error;
    }
  };

  const setUserIsAuthenticated = (userIsAuthenticated: boolean): void => {
    setIsAuthenticated(userIsAuthenticated);
  };

  const setUserHasBeenOnboarded = async (onboarded: boolean): Promise<void> => {
    setHasBeenOnboarded(onboarded);
    await setStorageItem('onboarded', onboarded ? '1': '0');
  };

  const setUserNotificationPermissionRequested = async (requested: boolean): Promise<void> => {
    setNotificationPermissionRequested(requested);
    await setStorageItem('notification_permission_requested', requested ? '1': '0');
  };

  const getToken = async () => {
    return await TokenStorage.getToken()
      .then((apiToken) => {
        return apiToken;
      })
      .catch((error) => {
        console.error('Error while getting token:', error);
        throw error;
      })
      .finally(() => {
        return null;
      });
  };

  const logout = async () => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      return await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const destroy = async () => {
    if (authService === undefined) throw new Error('AuthService is undefined');
    try {
      return await authService.destroy();
    } catch (error) {
      console.error('Error during auth destroy:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        getToken,
        currentUser,
        updateUser,
        isAuthenticated,
        setUserIsAuthenticated,
        login,
        logout,
        destroy,
        hasBeenOnboarded,
        setUserHasBeenOnboarded,
        notificationPermissionRequested,
        setUserNotificationPermissionRequested
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
