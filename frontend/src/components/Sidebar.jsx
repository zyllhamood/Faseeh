import React, { useState, useEffect } from 'react'
import { Flex, Text, Box, Button, useDisclosure, useBreakpointValue } from '@chakra-ui/react';
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
import { current } from '@reduxjs/toolkit';

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
    const currentSize = useBreakpointValue({
        base: "base",
        sm: "sm",
        md: "md",
        lg: "lg",
        xl: "xl",
        "2xl": "2xl",
        "3xl": "3xl",
    });
    useEffect(() => {
        console.log("Current size: " + currentSize);
    }, [currentSize])
    return (
        <>
            <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'} >
                <Text
                    fontFamily={'Rubik, sans-serif'}
                    fontSize={{ base: 44, "2xl": 46, "3xl": 48 }}
                    mt={'80px'}
                    mb={4}
                    fontWeight={700}
                    onClick={() => handleNavigate('/')}
                    cursor={'pointer'}
                >فصيح</Text>
                {/* <Text>{currentSize}</Text> */}



            </Flex>
            <Flex width={'100%'} flexDir={'column'} mt={10}>
                <Item txt={'الصفحة الرئيسية'} icon={'fa:home'} active={page === 'Home' ? true : false} onClick={() => handleNavigate('/profile')} />
                <Item txt={'الدروس'} icon={'streamline:class-lesson'} active={page === 'Lessons' ? true : false} onClick={() => handleNavigate('/lessons')} />
                <Item txt={'التدريبات'} icon={'teenyicons:ab-testing-solid'} active={page === 'Exercises'} onClick={() => handleNavigate('/exercises')} />
                <Item txt={'ملخص التمارين'} icon={'fluent:tasks-app-24-regular'} active={page === 'Summary' ? true : false} onClick={() => handleNavigate('/summary')} />
                <Item txt={'التقارير والتحليل'} icon={'hugeicons:analysis-text-link'} active={page === 'Reports' ? true : false} onClick={() => handleNavigate('/reports')} />
            </Flex>
            <Box
                mt={{ base: '130px', "2xl": "80px", "3xl": "286px" }}
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
                fontSize={{ base: 18, "2xl": 20, "3xl": 22 }}
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
                fontSize={{ base: 18, "2xl": 20, "3xl": 22 }}
                justifyContent="space-between"
                rightIcon={<Icon icon={'ic:outline-logout'} width={20} />}
                onClick={handleLogout}
            >
                <Box flex="1" textAlign="center" >تسجيل الخروج</Box>
            </Button>
        </>
    )
}