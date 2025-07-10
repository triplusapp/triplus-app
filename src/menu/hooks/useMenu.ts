import {useContext} from 'react';
import MenuContext from "@/src/menu/contexts/MenuContext";

const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within MenuProvider');
    }
    return context;
};

export {useMenu};
