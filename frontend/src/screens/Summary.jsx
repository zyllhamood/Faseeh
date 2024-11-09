import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, Image } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import AvatarName from '../components/AvatarName';
import MenuNav from '../components/MenuNav';
import Sidebar from '../components/Sidebar';
import { font1 } from '../localVars';
import eye_file from '../assets/images/eye_file.png'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
export default function Summary() {
    const navigate = useNavigate();
    const [resp, setResp] = useState(null);
    useEffect(() => {
        if (resp === null) {
            fetch('http://172.20.10.5:8000/summary/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get('access_token')
                }
            })
                .then((response) => response.json())
                .then((data) => setResp(data))
        }
    }, [resp])
    const handleNext = (title, id) => {
        const t = title === 'سحب البطاقات' ? 'cards' : title === 'اختر الإجابة الصحيحة' ? 'chooses' : title === 'تحدي الإعراب السريع' ? 'rapid' : title === 'أكمل الفراغ' ? 'full' : 'no'
        navigate(`/summary/${t}/${id}`)
    }
    return (
        <Flex
            direction={{ base: 'column', md: "row-reverse" }}
            minH="100vh"
            width="100%"

        >
            <Sidebar page={'Summary'} />
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
                    mt={6}
                    justifyContent={'space-between'}
                    color={'black'}
                >
                    <AvatarName />
                    <MenuNav />
                    {/* <Back page={page} setPage={setPage} /> */}
                </Flex>

                <Text
                    fontFamily={font1}
                    fontSize={{ base: 22, "2xl": 24, "3xl": 26 }}
                    color={'#000'}
                    mt={20}
                >ملخص التمارين</Text>

                <Flex flexDir={'column'} mt={10} width={'100%'} alignItems={'center'}>

                    {resp !== null && resp.map((item) => (
                        <BoxSummary title={item.title} result={item.result} onClick={() => handleNext(item.title, item.id)} />
                    ))}
                </Flex>
            </Flex>
        </Flex>
    )
}

const BoxSummary = ({ title, result, onClick }) => {
    return (
        <Flex
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            width={{ base: '90%', md: '70%' }}
            height={'140px'}
            borderRadius={12}
            alignItems={'center'}
            justifyContent={'space-between'}
            dir='rtl'
            mb={6}

        >
            <Flex
                height={'100%'}
                mt={12}
                width={'33%'}
                dir='rtl'
                flexDir={'column'}
                alignItems={'center'}
                alignContent={'center'}
            >
                <Text fontSize={{ base: 16, md: 18 }} fontFamily={font1} >اسم التمرين</Text>
                <Text fontSize={{ base: 16, md: 18 }} fontFamily={font1} textAlign={'center'} mt={8}>{title}</Text>
            </Flex>

            <Flex
                width={'33%'}
                height={'100%'}
                mt={12}
                dir='rtl'
                flexDir={'column'}
                alignItems={'center'}
            >
                <Text fontSize={{ base: 16, md: 18 }} fontFamily={font1} >النتيجة</Text>
                <Text fontSize={{ base: 16, md: 18 }} fontFamily={font1} mt={8}>{result}</Text>
            </Flex>

            <Flex
                width={'33%'}
                height={'100%'}
                mt={12}
                dir='rtl'
                flexDir={'column'}
                alignItems={'center'}
            >
                <Text fontSize={{ base: 16, md: 18 }} fontFamily={font1} >عرض الإجابات</Text>
                <Image
                    src={eye_file}
                    w={'50px'}
                    h={'50px'}
                    mt={4}
                    cursor={'pointer'}
                    onClick={onClick}
                />
            </Flex>

        </Flex>
    )
}