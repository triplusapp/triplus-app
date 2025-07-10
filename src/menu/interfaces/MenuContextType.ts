import {Dispatch, SetStateAction} from "react";

export interface MenuContextType {
  showUserMenu: boolean;
  showEllipsisMenu: boolean;
  setShowUserMenu: Dispatch<SetStateAction<boolean>>;
  setShowEllipsisMenu: Dispatch<SetStateAction<boolean>>;
  toggleUserMenu: () => void;
  toggleEllipsisMenu: () => void;
}
