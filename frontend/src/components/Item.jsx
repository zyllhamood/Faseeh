import React, { act } from 'react'
import { Flex, Text } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { bk2, font1 } from '../localVars';
import { useMenu } from './MenuContext';
export default function Item({ txt, icon, active, onClick }) {
    const { onClose } = useMenu();
    return (
        <Flex
            bgColor={bk2}
            dir='rtl'
            alignItems={'center'}
            width={'100%'}
            mt={7}
            onClick={onClose}
        >
            <Flex display={active ? 'block' : 'none'}><Icon icon={'raphael:arrowleft'} width={20} /></Flex>
            <Flex display={active ? 'none' : 'block'} mr={5}></Flex>

            <Icon style={{ marginRight: 2 }} icon={icon} width={32} height={32} />
            <Text
                mr={2}
                fontFamily={font1}
                onClick={onClick}
                cursor={'pointer'}

            >{txt}</Text>
        </Flex>
    )
}
