import React from 'react'
import { Flex, Text } from '@chakra-ui/react';
import { font1 } from '../localVars';
export default function BtnLesson({ txt, bk }) {
    return (
        <Text
            bgColor={bk}
            fontFamily={font1}
            pr={3} pl={3}
            borderRadius={20}
            pt={1} pb={1}
            ml={2}
            height={'36px'}

        >{txt}</Text>
    )
}
