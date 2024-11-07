import React from 'react'
import { Flex, Box, Text } from '@chakra-ui/react';
import { font1 } from '../localVars';
export default function FullResults({ resp }) {
    return (
        <Flex
            width={'100%'}
            flexDir={'column'}
            alignItems={'center'}
            mt={10}
        >
            {resp !== null && resp.map((item) => (
                <MyBox
                    question={item.question}
                    choose_answer={item.choose_answer ? item.choose_answer : item.choose}
                    correct_answer={item.correct_answer}
                    why={item.why}

                />
            ))}
        </Flex>
    )
}

const MyBox = ({ question, choose_answer, correct_answer, why }) => {
    return (
        <Flex
            width={{ base: '90%', md: '60%' }}
            alignSelf={'center'}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            height={{ base: '380px', md: '340px' }}
            flexDir={'column'}
            borderRadius={12}
            alignItems={'center'}
            mt={14}
        >
            <Text
                fontFamily={font1}
                dir='rtl'
                mt={8}
                textAlign={'center'}
                pr={4}
                pl={4}
            >السؤال / {question}</Text>
            <Box
                bgColor={'#D9D9D9'}
                height={'2px'}
                width={'100%'}
                mt={8}
            ></Box>

            <Flex
                flexDir={'column'}
                width={'100%'}
                dir='rtl'
                p={{ base: 4, md: 6 }}
            >
                <Text fontFamily={font1}>إجابتك : <Box as='spin' color={'#C80303'}>{choose_answer}</Box></Text>
                <Text fontFamily={font1} mt={4}>الصحيح : {correct_answer}</Text>
                <Text fontFamily={font1} mt={4}>التوضيح : </Text>
                <Text fontFamily={font1} mt={4}>{why}</Text>
            </Flex>
        </Flex>
    )
}