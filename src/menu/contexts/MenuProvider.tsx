import {MenuProviderProps} from "@/src/menu/interfaces/MenuProviderProps";
import React, {useState} from "react";
import MenuContext from "@/src/menu/contexts/MenuContext";

export const MenuProvider = ({children}: MenuProviderProps) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showEllipsisMenu, setShowEllipsisMenu] = useState(false);

    const toggleUserMenu = () => {
        setShowEllipsisMenu(false);
        setShowUserMenu(!showUserMenu);
    };

    const toggleEllipsisMenu = () => {
        setShowUserMenu(false);
        setShowEllipsisMenu(!showEllipsisMenu);
    };

    return (
        <MenuContext.Provider value={{ showUserMenu, showEllipsisMenu, setShowUserMenu, setShowEllipsisMenu, toggleUserMenu, toggleEllipsisMenu }}>
            {children}
        </MenuContext.Provider>
    );
};
