import React, { useState, useEffect, useRef } from 'react'
import { Flex, Button, Input, Text, useToast } from '@chakra-ui/react';
import { bk2, font1 } from '../localVars';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { Icon } from '@iconify/react';
import axios from 'axios';
export default function Register() {
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const rePasswordRef = useRef('');
    const fullNameRef = useRef('');
    const avatarRef = useRef('');


    const dispatch = useDispatch();
    const { respRegister, isLoading, isLogged } = useSelector((state) => state.auth)
    const toast = useToast();



    const handleRegister = () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const rePassword = rePasswordRef.current.value;
        const full_name = fullNameRef.current.value;

        if (username === '' || full_name === '' || password === '' || rePassword === '') {
            toast({
                title: 'Error',
                description: 'Please fill out all fields',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }
        if (password !== rePassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }
        if (password.length < 8) {
            toast({
                title: 'Error',
                description: 'Password must be at least 8 characters long',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
        }
        const data = { username, password, full_name, avatar: '' }
        dispatch(register(data));
    }
    useEffect(() => {
        if (respRegister !== null) {
            try {
                if (respRegister.message === 'User registered successfully') {
                    window.location.href = '/login';
                }
                else {
                    toast({
                        title: respRegister,
                        status: 'error',
                        duration: 1500,
                        isClosable: true,
                        position: 'top',
                    })
                }
            } catch (error) {
                toast({
                    title: respRegister,
                    status: 'error',
                    duration: 1500,
                    isClosable: true,
                    position: 'top',
                })
            }



        }

    }, [respRegister, dispatch])
    useEffect(() => {
        if (isLogged) {
            window.location.href = '/profile';
        }
    }, [isLogged])



    return (
        <Flex
            borderRadius={16}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            width={{ base: '340px', md: '400px' }}
            height={'410px'}
            mt={{ base: '100px', md: '200px' }}
            dir='rtl'
            flexDir={'column'}
            alignItems={'center'}
        >
            <Text
                fontFamily={font1}
                fontSize={20}
                alignSelf={'center'}
                width={'80%'}
                mt={6}
            >إنشاء حساب جديد</Text>
            <Input
                width={'80%'}
                mt={6}
                placeholder='الأسم واللقب'
                fontFamily={font1}
                ref={fullNameRef}
                fontWeight={'bold'}

            />

            <Input
                width={'80%'}
                mt={6}
                placeholder='اسم المستخدم'
                fontWeight={'bold'}
                fontFamily={font1}
                ref={usernameRef}
            />

            <Input
                width={'80%'}
                mt={6}
                placeholder='كلمه المرور'
                fontWeight={'bold'}
                fontFamily={font1}
                ref={passwordRef}
                type='password'

            />
            <Input
                width={'80%'}
                mt={6}
                placeholder='تأكيد كلمة المرور'
                fontWeight={'bold'}
                fontFamily={font1}
                ref={rePasswordRef}
                type='password'

            />
            <Button
                fontSize={18}
                fontWeight={'bold'}
                padding={6}
                fontFamily={font1}
                bgColor={bk2}
                color={'white'}
                _hover={{ opacity: 0.7 }}
                mt={6}
                onClick={handleRegister}
            >{isLoading ? <Icon icon={'eos-icons:bubble-loading'} width={30} height={30} /> : 'إنشاء حساب جديد'}</Button>
        </Flex>
    )
}
