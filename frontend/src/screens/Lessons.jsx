import React, { useState, useEffect, useRef } from 'react'
import { Flex, Text, Box, Button, Image, Avatar, Input, InputGroup, InputRightElement, Skeleton, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import Sidebar from '../components/Sidebar';
import { bk1, bk2, bk3, font1, fr1 } from '../localVars';
import Lesson2 from '../components/Lesson2';
import AvatarName from '../components/AvatarName';
import Cookies from 'js-cookie'
import MenuNav from '../components/MenuNav';
import { useNavigate } from 'react-router-dom';
import Lesson4 from '../components/Lesson4';

export default function Lessons() {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState(null);
    const [notStartLessons, setNotStartLessons] = useState(null);
    const [allLessons, setAllLessons] = useState(null);
    const access_token = Cookies.get('access_token');
    useEffect(() => {
        if (lessons === null) {
            if (access_token !== null || access_token !== undefined || access_token !== "") {
                fetch('http://172.20.10.5:8000/lessons/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + access_token
                    }
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setNotStartLessons(data);
                        setLessons(data);
                    })
            }


        }

        if (allLessons === null && lessons !== null) {
            fetch('http://172.20.10.5:8000/lessons/')
                .then((response) => response.json())
                .then((data) => {
                    setAllLessons(data);
                    if (lessons.length === 0) {
                        setLessons(data)
                    }
                })
        }

    }, [lessons, allLessons])



    return (
        <Flex
            direction={{ base: 'column', md: "row-reverse" }}
            minH="100vh"
            width={'100%'}

        >
            <Sidebar page={'Lessons'} />

            <Flex
                flex="1"
                width={{ base: '100%', md: '84%' }}
                flexDir="column"
                alignItems="center"
                mr="16%"
                overflowY="auto"
                pb={10}
            >
                <Flex
                    width={'90%'}
                    alignSelf={'center'}
                    alignItems={'center'}
                    mt={6}
                    justifyContent={'space-between'}
                    color={'black'}
                >
                    <AvatarName />
                    <MenuNav />
                    <Box display={{ base: 'none', md: 'block' }} cursor={'pointer'} onClick={() => navigate('/profile')}>
                        <Icon icon={'mdi:arrow-right'} width={40} />
                    </Box>
                </Flex>

                <Flex width={'88%'} alignSelf={'center'} dir='rtl' mt={4}>
                    <Text
                        fontFamily={font1}
                        fontSize={20}

                    >قائمة الدروس</Text>

                </Flex>

                <Flex
                    color={'#fff'}
                    dir='rtl'
                    width={'96%'}
                    mt={10}
                    alignItems={'center'}
                    overflowX="auto"
                    whiteSpace="nowrap"
                    css={{
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        scrollbarWidth: 'none',
                    }}
                >

                    <Flex width={'200px'} justifyContent={'center'} ml={8} >
                        <Flex
                            width={'90px'}
                            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                            borderRadius={32}
                            height={'44px'}
                            dir='ltr'

                        >
                            <Flex
                                bgColor={'#061492'}
                                borderRadius={32}
                                justifyContent={'center'}
                                alignItems={'center'}
                                width={'44px'}
                                height={'44px'}

                            >
                                <Icon icon={'material-symbols-light:menu'} width={22} height={26} />
                            </Flex>
                        </Flex>
                    </Flex>

                    <BtnLesson txt={'جميع الدروس'} bk={'#061492'} onClick={() => setLessons(allLessons)} />
                    <BtnLesson txt={'الدروس المكتملة'} bk={'#7a9d1a'} />
                    <BtnLesson txt={'الدروس المتبقية'} bk={'#084f4d'} onClick={() => setLessons(notStartLessons)} />
                    <BtnLesson txt={'الدروس المفضلة'} bk={'#3c0c6c'} />


                </Flex>

                <Flex
                    flexDir={'column'}
                    width={'88%'}
                    mt={14}
                    dir='rtl'
                >
                    {lessons !== null ? lessons.map((item, i) => (
                        <Lesson2
                            id={item.id}
                            color={i === 0 || i === 4 || i === 8 ? '#22078a' : i === 1 || i === 5 || i === 9 ? '#084f4d' : i === 2 || i === 6 ? '#7b9e19' : i === 3 || i === 7 || i === 10 ? '#3d0c6e' : ''}
                            title={item.title}
                            info={item.description}
                            minutes={item.minutes}
                        />
                    )) : <LoadingLesson />}
                </Flex>
            </Flex>
        </Flex>
    )
}

const LoadingLesson = () => {
    return (
        <Skeleton
            width={{ base: '100%', md: '90%' }}
            height={'200px'}
            mt={5}
            borderRadius={12}
        />
    )
}

const MyBox = ({ name, info, img }) => {
    return (
        <Flex
            width={'100%'}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            rounded={'md'}
            dir='rtl'
            height={'140px'}
            borderRadius={0}
            mt={6}
        >
            <Flex flexDir={'column'} width={'70%'} alignItems={'center'}>
                <Text
                    fontFamily={font1}
                    color={fr1}
                    fontSize={20}
                    mt={6}
                >{name}</Text>
                <Text
                    fontFamily={font1}
                    fontSize={20}
                    mt={6}
                >
                    {info}
                </Text>
            </Flex>
            <Flex width={'26%'} alignItems={'center'} justifyContent={'space-between'}>
                <Text
                    fontFamily={font1}
                    fontSize={20}
                >أكمل الدرس</Text>
                <Image src={img} width={140} height={120} borderRadius={8} />
            </Flex>
        </Flex>
    )
}

const BtnLesson = ({ txt, bk, onClick }) => {

    return (
        <Text
            bgColor={bk}
            fontFamily={font1}
            pr={3} pl={3}
            borderRadius={20}
            pt={1} pb={1}
            ml={2}

            height={'36px'}
            onClick={onClick}
            cursor={'pointer'}
            fontSize={{ base: 16, "2xl": 18, "3xl": 20 }}


        >{txt}</Text>
    )
}