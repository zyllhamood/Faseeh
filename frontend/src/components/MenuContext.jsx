// src/context/MenuContext.js
import React, { createContext, useContext, useRef } from 'react';
import { useDisclosure } from '@chakra-ui/react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure(); // Manage disclosure state
    const btnRef = useRef(); // Reference for the button

    return (
        <MenuContext.Provider value={{ isOpen, onOpen, onClose, btnRef }}>
            {children}
        </MenuContext.Provider>
    );
};

// Hook to use the MenuContext easily in other components
export const useMenu = () => useContext(MenuContext);
