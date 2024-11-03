import React from 'react'
import { Flex, Text, Box, Image } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { font1, fr1 } from '../localVars';
export default function Training({ txt, img, onClick }) {
    return (
        <Flex
            alignItems={'center'}
            justifyContent={'center'}
            color={'black'}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            rounded={'md'}
            borderRadius={10}
            borderWidth={'1px'}
            height={{ base: '180px', md: '140px' }}
            width={{ base: '320px', md: '240px' }}
            mt={{ base: 4, md: 0 }}
            cursor={'pointer'}
            onClick={onClick}
        >
            <Text
                fontSize={16}
                width={'50%'}
                textAlign={'center'}
                fontFamily={font1}
                color={fr1}
            >{txt}</Text>
            {/* <Icon icon={icon} width={70} /> */}
            <Image
                src={img}
                width={'70px'}
                height={'70px'}
            />

        </Flex>
    )
}
