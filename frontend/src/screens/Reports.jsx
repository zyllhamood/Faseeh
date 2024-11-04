import React, { useState, useEffect } from 'react'
import { Flex, Text, Button, Avatar, CircularProgress, CircularProgressLabel, Image, Progress, Box, Skeleton } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import { bk2, font1 } from '../localVars';
import { Icon } from '@iconify/react';
import CardReport from '../components/CardReport';
import growth_chart from '../assets/images/growth-chart.png'
import time_management from '../assets/images/time-management.png'
import mistake from '../assets/images/mistake.png'
import studying from '../assets/images/studying.png'
import { useSelector } from 'react-redux';
import MenuNav from '../components/MenuNav';
import AvatarName from '../components/AvatarName';
import { useNavigate } from 'react-router-dom';
// const data = [
//     {
//         'txt': 'الإلمام بالقواعد النحوية',
//         'value': 85
//     },
//     {
//         'txt': 'تقدم المستخدم عبر المستويات',
//         'value': 60
//     },
//     {
//         'txt': 'تطبيق الدروس المتعلمة',
//         'value': 50
//     },
//     {
//         'txt': 'نسبة إتمام الدروس في المنصة',
//         'value': 35
//     },

// ]
// const mistakes = [
//     'الخلط بين المرفوع والمنصوب والمجرور',
//     'استخدام أدوات النفي والشرط بشكل خاطئ',
//     'عدم التمييز بين كان وأخواتها وبين الجملة الفعلية البسيطة',
//     'الخلط في ترتيب الجملة وتركيبها',
//     'الخلط بين المثنى والجمع في الإعراب'
// ]
export default function Reports() {
    const navigate = useNavigate();
    const { avatar, full_name } = useSelector((state) => state.auth)
    const [resp, setResp] = useState(null);
    const [data, setData] = useState(null);
    const [mistakes, setMistakes] = useState(null);
    useEffect(() => {
        if (resp === null) {
            fetch('https://i.zyll.shop/report/')
                .then((response) => response.json())
                .then((data) => {
                    setData(data.response);
                    setMistakes(data.mistakes);
                })
        }
    }, [resp])
    return (
        <Flex
            direction={{ base: 'column', md: "row-reverse" }}
            minH="100vh"
            width="100%"
            color={'#fff'}
        >
            <Sidebar page={'Reports'} />

            <Flex
                flex="1"
                width={{ base: '100%', md: '84%' }}
                flexDir={'column'}
                alignItems={'center'}
                pb={10}
                color={'black'}
                mr="16%"
                overflowY="auto"
            >
                <Flex
                    width={'94%'}
                    alignSelf={'center'}
                    mt={6}
                    justifyContent={{ base: 'center', md: 'space-between' }}
                    color={'black'}
                >
                    <Flex alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
                        <Avatar name='Dan Abrahmov' src={avatar} />
                        <Text
                            fontFamily={font1}
                            color={bk2}
                            fontSize={20}
                            ml={3}
                        >{full_name}</Text>
                        <MenuNav />
                        <Icon
                            icon={'hugeicons:notification-01'}
                            color={bk2}
                            width={30}
                            style={{ marginLeft: 30 }}
                        />
                    </Flex>
                    <Box display={{ base: 'none', md: 'block' }} cursor={'pointer'} onClick={() => navigate('/profile')}>
                        <Icon icon={'mdi:arrow-right'} width={40} />
                    </Box>

                    <Flex display={{ base: 'flex', md: 'none' }} justifyContent={'space-between'} width={'90%'} alignSelf={'center'}>
                        <AvatarName />
                        <MenuNav />
                    </Flex>

                </Flex>
                <Text
                    fontFamily={font1}
                    fontSize={26}
                    mt={10}
                >
                    صفحة التقارير والتحليلات
                </Text>

                <Flex
                    mt={20}
                    width={'80%'}
                    justifyContent={'space-between'}
                    flexDir={{ base: 'column', md: 'row' }}
                    alignItems={'center'}

                >
                    <CardReport title={'10 ساعات'} img={time_management} txt={'وقت التعلم الإجمالي خلال الأسبوع'} bk={'#17771f'} />
                    <CardReport title={'5'} img={mistake} txt={'عدد الأخطاء النحوية المتكررة'} bk={'#057ea3'} mistakes={mistakes} />
                    <CardReport title={'36'} img={studying} txt={'عدد التمارين المكتملة'} bk={'#05429f'} />
                </Flex>

                <Flex width={'90%'} mt={10} justifyContent={'space-between'} flexDir={{ base: 'column', md: 'row' }}>
                    <Flex
                        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                        borderRadius={8}
                        width={{ base: '90%', md: '44%' }}
                        alignSelf={'center'}
                        height={'220px'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        flexDir={'column'}
                    >
                        <CircularProgress value={65} color='#053276' size={130}>
                            <CircularProgressLabel fontFamily={font1} fontSize={18}>%65</CircularProgressLabel>
                        </CircularProgress>

                        <Text fontFamily={font1} fontSize={20} mt={4}>نسبة الإنجاز الكلي</Text>
                    </Flex>
                    <Flex
                        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                        borderRadius={8}
                        width={{ base: '90%', md: '55%' }}
                        mt={{ base: 4, md: 0 }}
                        alignSelf={'center'}
                        height={'220px'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        flexDir={'column'}


                    >
                        <Image
                            src={growth_chart}
                            width={'80px'}
                        />

                        <Flex mt={10} dir='rtl'>
                            <Text
                                fontFamily={font1}
                                fontSize={26}
                            >ارتفاع حصيلة التعلم</Text>

                            <Text
                                fontFamily={font1}
                                fontSize={26}
                                mr={2}
                            >40%</Text>


                        </Flex>
                    </Flex>

                </Flex>

                <Flex
                    borderRadius={16}
                    width={'90%'}
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"

                    mt={6}
                    pt={10}
                    pb={10}

                    alignItems={'center'}
                    flexDir={'column'}
                >
                    {data !== null ? data.map((item) => <Percentage txt={item.txt} value={item.value} />) : <LoadingPrecentage />}
                </Flex>
            </Flex>
        </Flex>
    )
}
const LoadingPrecentage = () => {
    return (
        <Flex
            dir='rtl'
            alignItems={'center'}
            justifyContent={'space-between'}
            width={'90%'}
            pb={3}
            mt={1}

        >
            <Skeleton width={'140px'} height={'20px'} />

            <Skeleton
                width="70%"
                mr={4}
                borderRadius={20}
                height={'18px'}
                ml={4}
            />


            <Skeleton width={'30px'} ml={'58px'} height={'22px'} />
        </Flex>
    )
}
const Percentage = ({ txt, value }) => {
    return (
        <Flex
            dir='rtl'
            alignItems={'center'}
            justifyContent={'space-between'}
            width={'90%'}
            pb={3}

        >
            <Text
                fontFamily={font1}
                fontSize={14}
                width={'20%'}
            >{txt}</Text>

            <Progress
                value={value}
                width="70%"
                mr={4}
                borderRadius={20}
                height={'16px'}
                bgColor={'white'}
                sx={{
                    '& > div': {
                        backgroundColor: '#053276',
                    },
                }}
            />

            <Text
                fontFamily={font1}
                fontSize={20}
                width={'10%'}
            >{value}%</Text>
        </Flex>
    )
}

