import {createContext} from "react";
import {MenuContextType} from "@/src/menu/interfaces/MenuContextType";

const MenuContext = createContext<MenuContextType>({
    showUserMenu: false,
    showEllipsisMenu: false,
    setShowUserMenu: () => {
    },
    setShowEllipsisMenu: () => {
    },
    toggleUserMenu: () => {
    },
    toggleEllipsisMenu: () => {
    },
});


export default MenuContext;
