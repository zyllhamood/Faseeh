import React, { useState, useEffect, useRef } from 'react'
import { Flex, Text, Input, Box, Image, Button, Textarea } from '@chakra-ui/react';
import { font1 } from '../localVars';
import arrow_up from '../assets/images/arrow-up.png';
import Cookies from 'js-cookie';
export default function ParsingExercise({ resp, id, page, setPage, setNumLine, results, setResults }) {
    const answerRef = useRef('');
    const answer = answerRef.current.value;
    const handleNext = () => {
        const query = { "text": resp, "parsing": answer }
        setResults({ ...results, parsing: query })
        setNumLine(6)
        setPage('full_view')

    }
    return (
        <Flex
            flex="1"
            width={'100%'}
            alignSelf={{ base: 'center' }}
            flexDir={'column'}
            alignItems={{ base: 'center', md: 'start' }}
            color={'black'}
            pb={10}
            overflowY="auto"
        >
            <Text
                width={'86%'}
                dir='rtl'
                fontFamily={font1}
                fontSize={{ base: 20, "2xl": 22, "3xl": 24 }}
                mt={'120px'}
                pb={4}

            >
                التمرين الثاني
            </Text>
            <Flex
                width={{ base: '90%', md: '70%' }}
                mt={4}
                flexDir={'column'}
                borderRadius={16}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                height={{ base: '220px', md: '300px' }}
                alignSelf={'center'}
                alignItems={'center'}


            >
                <Text
                    p={{ base: 3, md: 0 }}
                    textAlign={{ base: 'center', md: 'start' }}
                    mt={{ base: 10, md: 20 }}
                    fontFamily={font1}
                    fontSize={{ base: 22, "2xl": 24, "3xl": 26 }}
                >قم بإعراب هذه الجملة</Text>
                <Text
                    p={{ base: 3, md: 0 }}
                    textAlign={{ base: 'center', md: 'start' }}
                    fontFamily={font1}
                    fontSize={{ base: 20, "2xl": 22, "3xl": 24 }}
                    dir='rtl'
                    mt={{ base: 5, md: 10 }}
                >
                    (("<Box dir={'rtl'} as='spin' color={'#2908aa'}>{resp}</Box>"))
                </Text>
            </Flex>

            <Flex
                width={{ base: '90%', md: '70%' }}
                alignSelf="center"
                mt={{ base: 5, md: 10 }}


            >
                <Flex
                    ml={{ base: 5, md: 10 }}
                    bgColor={'black'}
                    width={'60px'}
                    height={'60px'}
                    borderRadius={120}
                    justifyContent={'center'}
                    alignItems={'center'}
                    position={'absolute'}
                    cursor={'pointer'}
                    zIndex={2}

                    mt={3}
                    onClick={handleNext}
                >
                    <Image src={arrow_up} width="26px" height="26px" />
                </Flex>

                <Textarea
                    fontFamily={font1}
                    fontSize={{ base: 20, "3xl": 22 }}
                    color="#666666"
                    borderWidth="0px"
                    width="100%"
                    lineHeight={'34px'}
                    zIndex={1}
                    fontWeight={'bold'}
                    dir="rtl"
                    placeholder="إكتب اجابتك هنا"
                    pt="26px"
                    pb={'13px'}
                    ref={answerRef}

                    pl="110px"
                    borderRadius="120"
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                    alignSelf="center"
                    pr={10}
                    position="relative"
                    resize="none"
                    minHeight="80px"
                    _focus={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                    onInput={(e) => {
                        e.target.style.height = 'auto'; // Reset height to auto for recalculating
                        e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                    }}
                />
            </Flex>
        </Flex>
    )
}
