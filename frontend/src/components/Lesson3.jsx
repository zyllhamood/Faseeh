import React from 'react'
import { Flex, Text, Image, Progress } from '@chakra-ui/react'
import { font1 } from '../localVars'

//https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2
//36e41b
export default function Lesson3({ index, title, color, finished, value, onClick }) {
    return (
        <Flex
            width={'220px'}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            rounded={'md'}
            borderRadius={10}
            mr={index !== 0 && 12}
            borderWidth={'1px'}
            flexDir={'column'}
            alignItems={'center'}
            p={3}
            dir='rtl'
            height={'160px'}
            cursor={'pointer'}
            onClick={onClick}
        >
            {/* <Image borderRadius={10} h={'80px'} w={'200px'} src={img} /> */}
            <Text
                fontFamily={font1}
                color={'#000'}
                alignSelf={'start'}
                mr={4}
                fontSize={14}
                mt={2}
            >{title}</Text>
            <Progress
                value={index === 0 ? 30 : index === 1 ? 70 : index === 2 ? 90 : 10}
                width="94%"
                size="xs"
                borderRadius={20}
                height={'5px'}
                mt={3}
                bgColor={'#a49999'}
                sx={{
                    '& > div': {
                        backgroundColor: color,
                    },
                }}
            />
            <Text
                fontFamily={font1}
                bgColor={color}
                p={0.5}
                fontSize={6}
                borderRadius={20}
                pl={4}
                pr={4}
                mt={3}
                alignSelf={'end'}
                color={'#fff'}
            >{finished ? 'مكتمل' : 'غير مكتمل'}</Text>
            <Text
                color={'black'}
                fontFamily={font1}
                alignSelf={'start'}
                fontSize={14}
                mr={4}

            >{finished ? 'أعادة الدرس' : 'اكمل الدرس'}</Text>
        </Flex>
    )
}
