import React, { act } from 'react'
import { Flex, Text, Image } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { bk2, font1 } from '../localVars';
import { useMenu } from './MenuContext';
import png from '../assets/images/123.png'
export default function Item({ txt, icon, active, onClick }) {
    const { onClose } = useMenu();
    return (
        <Flex
            bgColor={bk2}
            dir='rtl'
            alignItems={'center'}
            width={'100%'}
            mt={{ base: 7, "3xl": 8 }}
            onClick={onClose}
        >
            <Flex display={active ? 'block' : 'none'}><Icon icon={'raphael:arrowleft'} width={20} /></Flex>
            <Flex display={active ? 'none' : 'block'} mr={5}></Flex>

            {txt !== 'التدريبات' ? (
                <Icon
                    style={{ marginRight: 2 }}
                    icon={icon}
                    width={32}
                    height={32}
                />
            ) : <Image src={png} width={'32px'} mt={{ base: -3, md: -2 }} />}
            <Text
                mr={2}
                fontFamily={font1}
                onClick={onClick}
                cursor={'pointer'}
                fontSize={{ base: 16, "2xl": 18, "3xl": 20 }}
            >{txt}</Text>
        </Flex>
    )
}
