import React from 'react'
import { Flex, Avatar, Text, Skeleton } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { bk2, font1 } from '../localVars';
export default function AvatarName() {
    const { avatar, full_name } = useSelector((state) => state.auth)
    return (
        avatar !== null ? (
            <Flex alignItems={'center'}>
                <Avatar name='Dan Abrahmov' src={avatar} />
                <Text
                    fontFamily={font1}
                    color={bk2}
                    fontSize={{ base: 20, "3xl": 22 }}
                    ml={2}
                >{full_name}</Text>
            </Flex>
        ) : (
            <Flex alignItems={'center'}>
                <Skeleton width={12} height={12} borderRadius={'full'} />
                <Skeleton width={40} height={6} borderRadius={8} ml={2} />
            </Flex>
        )
    )
}
