// src/components/MenuIcon.js
import { Flex } from "@chakra-ui/react";
import { Icon } from '@iconify/react';
import { useMenu } from "./MenuContext";

const MenuNav = () => {
    const { onOpen, btnRef } = useMenu();
    return (
        <Flex display={{ base: 'block', md: 'none' }} mt={1} cursor="pointer">
            <Icon
                icon="eva:menu-2-outline"
                width="36px"
                color="#000"
                onClick={onOpen} // Trigger onOpen from context
                ref={btnRef} // Access btnRef from context
            />
        </Flex>
    );
};

export default MenuNav;
