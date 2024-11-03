import React, { useState, useEffect, useRef } from 'react'
import { Flex, Button, Input, Text, useToast } from '@chakra-ui/react';
import { bk2, font1 } from '../localVars';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { Icon } from '@iconify/react';
export default function Login() {
    const toast = useToast();
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const dispatch = useDispatch();
    const { isLogged, wrongLogin, isLoading } = useSelector((state) => state.auth);


    const handleLogin = () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        if (username === '' || password === '') {
            toast({
                title: 'Please fill all fields',
                status: 'error',
                duration: 1500,
                isClosable: true,
                position: 'top',
            })
            return;
        }
        const data = {
            username: username.toLowerCase(),
            password
        }
        dispatch(login(data));
    }
    useEffect(() => {
        if (wrongLogin === true) {
            toast({
                title: 'Wrong username or password',
                status: 'error',
                duration: 1500,
                isClosable: true,
                position: 'top',
            })
        }
        else if (isLogged) {
            toast({
                title: 'Logged in successfully',
                status: 'success',
                duration: 1500,
                isClosable: true,
                position: 'top',
            })
            const timer = setTimeout(() => {
                window.location.href = '/profile';
            }, 1000);
            return () => clearTimeout(timer);
        }

    }, [isLogged, wrongLogin])
    useEffect(() => {
        if (isLogged) {
            //window.location.href = '/profile';
        }
    }, [isLogged])
    const handleKeyDownPassword = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };
    const handleKeyDownUsername = (e) => {
        if (e.key === 'Enter') {
            passwordRef.current.focus();
        }
    }
    return (
        <Flex
            borderRadius={16}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            width={{ base: '340px', md: '400px' }}
            height={'300px'}
            mt={'200px'}
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
            >تسجيل الدخول</Text>

            <Input
                width={'80%'}
                mt={10}
                placeholder='اسم المستخدم'
                fontFamily={font1}
                ref={usernameRef}
                fontWeight={'bold'}
                onKeyDown={handleKeyDownUsername}
            />

            <Input
                width={'80%'}
                mt={6}
                placeholder='كلمه المرور'
                fontFamily={font1}
                fontWeight={'bold'}
                ref={passwordRef}
                onKeyDown={handleKeyDownPassword}
                type='password'

            />

            <Button
                fontSize={18}
                width={'160px'}
                padding={6}
                fontFamily={font1}
                bgColor={bk2}
                color={'white'}
                fontWeight={'bold'}
                _hover={{ opacity: 0.7 }}
                mt={6}
                onClick={handleLogin}
            >{isLoading ? <Icon icon={'eos-icons:bubble-loading'} width={30} height={30} /> : 'تسجيل الدخول'}</Button>
        </Flex>
    )
}
