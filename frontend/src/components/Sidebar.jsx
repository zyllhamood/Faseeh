import React, { useState, useEffect } from 'react'
import { Flex, Text, Box, Button, useDisclosure } from '@chakra-ui/react';
import Item from './Item';
import { bk2, font2 } from '../localVars';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { useMenu } from './MenuContext';
export default function Sidebar({ page }) {
    const { isOpen, onOpen, onClose, btnRef } = useMenu();
    const navigate = useNavigate();
    const handleNavigate = (page) => {
        navigate(page)
    }

    const handleLogout = () => {
        Cookies.remove('access_token');
        window.location.href = '/'
    }
    return (

        <>
            <Flex width={'16%'} bg={bk2} flexDir={'column'} position={'fixed'} height={'100vh'} zIndex={1000} display={{ base: 'none', md: 'flex' }} color={'#fff'}>
                <NavContent page={page} handleNavigate={handleNavigate} handleLogout={handleLogout} />
            </Flex>


            {/* <Flex display={{ base: 'block', md: 'none' }} mt={14} mr={6} cursor={'pointer'} bgColor={'red'} >
                <Icon
                    icon={'eva:menu-2-outline'}
                    width={'36px'}
                    color={'#000'}
                    onClick={onOpen}
                    ref={btnRef}
                />
            </Flex> */}
            {/* <MenuNav onOpen={onOpen} btnRef={btnRef} /> */}
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton color={'#fff'} />


                    <DrawerBody bgColor={bk2}>
                        <Flex width={'100%'} color={'#fff'} bg={bk2} flexDir={'column'}   >
                            <NavContent page={page} handleNavigate={handleNavigate} handleLogout={handleLogout} />
                        </Flex>
                    </DrawerBody>


                </DrawerContent>
            </Drawer>
        </>
    )
}



const NavContent = ({ page, handleNavigate, handleLogout }) => {
    return (
        <>
            <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'} >
                <Text
                    fontFamily={'Rubik, sans-serif'}
                    fontSize={44}
                    mt={'80px'}
                    mb={4}
                    fontWeight={700}
                    onClick={() => handleNavigate('/')}
                    cursor={'pointer'}
                >فصيح</Text>
                <svg width="60" height="60" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1_111)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M39.9993 39.9995V52.4995C39.9993 53.88 41.1186 54.9995 42.4993 54.9995H54.9993C56.3798 54.9995 57.4993 53.88 57.4993 52.4995V39.9995C57.4993 38.6188 56.3798 37.4995 54.9993 37.4995H42.4993C41.1186 37.4995 39.9993 38.6188 39.9993 39.9995ZM3.12427 49.9995V62.4995C3.12427 63.88 4.24356 64.9995 5.62427 64.9995H18.1243C19.505 64.9995 20.6243 63.88 20.6243 62.4995V49.9995C20.6243 48.6188 19.505 47.4995 18.1243 47.4995H5.62427C4.24356 47.4995 3.12427 48.6188 3.12427 49.9995Z" fill="#084F4E" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M51.875 1.87485C48.7684 1.87485 46.25 4.39325 46.25 7.49985V19.9998C46.25 23.0903 48.7423 25.5986 51.8265 25.6246L49.1342 34.3748H42.5C41.5737 34.3748 40.6997 34.5987 39.9291 34.9954L33.125 29.4283V17.4998C33.125 14.3932 30.6066 11.8748 27.5 11.8748H15C11.8934 11.8748 9.375 14.3932 9.375 17.4998V29.9998C9.375 32.8826 11.5436 35.2589 14.3384 35.5863L11.6342 44.3748H5.625C2.5184 44.3748 0 46.8932 0 49.9998V62.4998C0 65.6063 2.5184 68.1248 5.625 68.1248H18.125C21.2316 68.1248 23.75 65.6063 23.75 62.4998V49.9998C23.75 46.9093 21.2577 44.401 18.1733 44.375L20.8657 35.6248H27.5C28.4261 35.6248 29.3 35.401 30.0704 35.0045L36.875 40.5719V52.4998C36.875 55.6063 39.3934 58.1248 42.5 58.1248H55C58.1065 58.1248 60.625 55.6063 60.625 52.4998V39.9998C60.625 37.117 58.4565 34.7407 55.6615 34.4133L58.3655 25.6248H64.375C67.4815 25.6248 70 23.1064 70 19.9998V7.49985C70 4.39325 67.4815 1.87485 64.375 1.87485H51.875ZM51.3715 40.6248C51.4195 40.6259 51.4675 40.6259 51.515 40.6248H54.375V51.8748H43.125V40.6248H51.3715ZM13.8716 50.6248C13.9195 50.6258 13.9674 50.6258 14.015 50.6248H17.5V61.8748H6.25V50.6248H13.8716Z" fill="#F8F8F8" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1_111">
                            <rect width="70" height="70" fill="white" />
                        </clipPath>
                    </defs>
                </svg>


            </Flex>
            <Flex width={'100%'} flexDir={'column'} mt={10}>
                <Item txt={'الصفحة الرئيسية'} icon={'fa:home'} active={page === 'Home' ? true : false} onClick={() => handleNavigate('/profile')} />
                <Item txt={'الدروس'} icon={'streamline:class-lesson'} active={page === 'Lessons' ? true : false} onClick={() => handleNavigate('/lessons')} />
                <Item txt={'التدريبات'} icon={'teenyicons:ab-testing-solid'} active={page === 'Exercises'} onClick={() => handleNavigate('/exercises')} />
                {/* <Item txt={'المهام الحالية'} icon={'fluent:tasks-app-24-regular'} active={false} onClick={() => handleNavigate('/tasks')} /> */}
                <Item txt={'التقارير والتحليل'} icon={'hugeicons:analysis-text-link'} active={page === 'Reports' ? true : false} onClick={() => handleNavigate('/reports')} />
            </Flex>
            <Box
                mt={'170px'}
                height={'3px'}
                bgColor={'white'}
                borderRadius={16}
                width={'80%'}
                alignSelf={'center'}
            >

            </Box>


            <Button
                width={'86%'}
                alignSelf={'center'}
                mt={4}
                fontFamily={font2}
                fontSize={18}
                justifyContent="space-between"
                rightIcon={<Icon icon={'ic:outline-settings'} width={20} />}
            >
                <Box flex="1" textAlign="center" >الإعدادات</Box>
            </Button>
            <Button
                width={'86%'}
                alignSelf={'center'}
                mt={4}
                fontFamily={font2}
                fontSize={18}
                justifyContent="space-between"
                rightIcon={<Icon icon={'ic:outline-logout'} width={20} />}
                onClick={handleLogout}
            >
                <Box flex="1" textAlign="center" >تسجيل الخروج</Box>
            </Button>
        </>
    )
}