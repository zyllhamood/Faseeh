import React from 'react'
import { Flex, Box, Text, Button } from '@chakra-ui/react';
import { font1 } from '../localVars';

export default function LessonView({ respLesson, resp, page, setPage }) {
    return (
        <Flex alignSelf={'end'} flexDir={'column'} dir='rtl' width={'100%'}>
            <Flex
                flexDir={'column'}
                width={'80%'}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                maxH={'400px'}
                alignSelf={'center'}
                borderRadius={12}
                mt={10}
                pb={10}
            >
                <Text
                    color={'#1B0378'}
                    fontFamily={font1}
                    alignSelf={'center'}
                    mt={8}
                    fontSize={28}
                >درس {respLesson.title}</Text>

                <Text
                    color={'#000'}
                    fontFamily={font1}
                    width={'90%'}
                    alignSelf={'center'}
                    mt={8}
                    fontSize={20}
                >{respLesson.definition}</Text>

                <Text
                    color={'#000'}
                    fontFamily={font1}
                    width={'90%'}
                    alignSelf={'center'}
                    mt={12}
                    fontSize={16}
                >القاعدة</Text>


                <Text
                    color={'#000'}
                    fontFamily={font1}
                    width={'90%'}
                    alignSelf={'center'}
                    mt={2}
                    fontSize={20}
                >{respLesson.grammar}</Text>


            </Flex>
            <Button
                bgColor={'#1B0378'}
                alignSelf={'center'}
                mt={10}
                color={'#fff'}
                fontFamily={font1}
                fontSize={24}
                width={'240px'}
                height={'54px'}
                borderRadius={12}
                _hover={{ opacity: 0.7 }}
                onClick={() => setPage('cards_view')}
                isLoading={resp === null ? true : false}
                fontWeight={'bold'}
            >تدرب على القاعدة </Button>
        </Flex>
    )
}
