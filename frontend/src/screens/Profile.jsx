import React, { useEffect, useState, useRef } from 'react'
import { Flex, Text, Box, Button, Avatar, Input, InputGroup, InputRightElement, InputLeftElement, VStack, Skeleton } from '@chakra-ui/react';
import { Menu, MenuItem, MenuList, MenuButton, useDisclosure } from '@chakra-ui/react';
import { bk1, bk2, bk3, bk4, font1, font2, fr1 } from '../localVars';
import { Icon } from '@iconify/react';
import Lesson1 from '../components/Lesson1';
import Training from '../components/Training';
import Item from '../components/Item';
import Sidebar from '../components/Sidebar';
import conversation_training_daily from '../assets/images/conversation-training-daily.png'
import speak_training from '../assets/images/speak-training.png'
import full_the_blank from '../assets/images/full-the-blank.png'
import goal from '../assets/images/goal.png'
import { useSelector } from 'react-redux';
import Lesson3 from '../components/Lesson3';
import Cookies from 'js-cookie'
import AvatarName from '../components/AvatarName';
import { useNavigate } from 'react-router-dom';
import Lesson4 from '../components/Lesson4';
import { useMenu } from '../components/MenuContext';
import MenuNav from '../components/MenuNav';

export default function Profile() {
    const [lessons, setLessons] = useState(null);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const searchRef = useRef(null)
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const buttonRef = useRef(null)

    useEffect(() => {
        if (lessons === null) {
            fetch('http://192.168.8.168:8000/my-lessons/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('access_token')}`
                }
            })
                .then((response) => response.json())
                .then((data) => setLessons(data))
        }
    }, [lessons])



    const handleSearch = (event) => {

        setFilteredResults([]);
        const value = event.target.value;

        setSearchTerm(value);

        if (!value.trim()) {
            setFilteredResults([]);
            setIsOpenSearch(false);
            return;
        }
        const filtered = lessons.filter(lesson =>

            lesson.lesson.title.includes(value)
        );

        setFilteredResults(filtered);

        setIsOpenSearch(true);
        if (buttonRef.current) {
            if (isOpenSearch === false) {
                buttonRef.current.click();
            }
            else {
                setIsOpenSearch(true);
            }
        }
    };
    return (
        <Flex
            direction={{ base: 'column', md: "row-reverse" }}
            minH="100vh"
            width="100%"
            color="#fff"
        >
            {/* Sidebar */}
            <Sidebar page={'Home'} />

            {/* Main Content */}
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
                    mt={5}
                    p={5}
                    width={'94%'}

                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Button
                        rightIcon={<Icon icon={'icon-park-solid:down-c'} />}
                        borderRadius={40}
                        bgColor={bk2}
                        color={bk1}
                        fontSize={18}
                        fontFamily={font1}
                        _hover={{ opacity: 0.8 }}
                        display={{ base: 'none', md: 'block' }}
                    >عربي</Button>
                    <Box display={{ base: 'none', md: 'block' }}>
                        <Icon
                            icon={'hugeicons:notification-01'}
                            color={bk2}
                            width={30}

                        />
                    </Box>

                    <AvatarName />

                    <MenuNav />
                    {/* Search Input with Icon */}


                    <Menu>
                        <InputGroup width={{ md: '700px', "3xl": "1000px" }} display={{ base: 'none', md: 'block' }}>
                            <Input
                                borderRadius={12}
                                fontFamily={font1}
                                fontWeight={'bold'}
                                height={'54px'}
                                bgColor={bk3}
                                color={'black'}
                                dir='rtl'
                                textAlign={'center'}
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <InputRightElement alignSelf={'center'} mt={2}>
                                <Icon icon={'ic:outline-search'} color='black' width={28} />
                            </InputRightElement>
                        </InputGroup>
                        <MenuButton

                            isActive={isOpenSearch}
                            as={Button}
                            borderRadius={0}
                            borderTopRightRadius={8}
                            borderBottomRightRadius={8}
                            bgGradient={bk1}
                            color='#fff'
                            width={'50'}
                            height='fit'
                            ref={buttonRef}
                            _hover={{ opacity: 0.7 }}

                            style={{ display: 'none' }}
                        >
                            <Text><Icon icon="material-symbols:search" width="28" height="28" /></Text>
                        </MenuButton>

                        <MenuList
                            p={2}
                            width={'fit'}
                            ml={{ base: '10', md: '510px' }}
                            mt={{ base: '20', md: '100px' }}
                        >
                            <Flex flexDir={'column'} >
                                {filteredResults.map((lesson, i) => (

                                    <Flex ml={2}>

                                        <Lesson4
                                            index={i}
                                            title={lesson.lesson.title}
                                            color={
                                                i === 0 || i === 4 || i === 8
                                                    ? '#22078a'
                                                    : i === 1 || i === 5 || i === 9
                                                        ? '#084f4d'
                                                        : i === 2 || i === 6
                                                            ? '#7b9e19'
                                                            : i === 3 || i === 7
                                                                ? '#3d0c6e'
                                                                : ''
                                            }
                                            finished={lesson.finished}
                                            value={lesson.value}
                                            onClick={() => navigate('/lesson')}
                                        />

                                    </Flex>


                                ))}
                            </Flex>


                        </MenuList>
                    </Menu>

                </Flex>

                <Flex mt={20} bgColor={bk4} p={{ base: 3, md: 0 }} width={{ base: '90%', md: '68%' }} height={{ base: '220px', md: '140px' }} borderRadius={8} flexDir={'column'}>
                    <Flex justifyContent={'space-between'} width={'94%'} mt={4}>
                        <Flex></Flex>
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.8571 22.8571V30C22.8571 30.7889 23.4967 31.4286 24.2856 31.4286H31.4285C32.2174 31.4286 32.8571 30.7889 32.8571 30V22.8571C32.8571 22.0682 32.2174 21.4286 31.4285 21.4286H24.2856C23.4967 21.4286 22.8571 22.0682 22.8571 22.8571ZM1.78564 28.5714V35.7143C1.78564 36.5031 2.42524 37.1429 3.21422 37.1429H10.3571C11.146 37.1429 11.7856 36.5031 11.7856 35.7143V28.5714C11.7856 27.7825 11.146 27.1429 10.3571 27.1429H3.21422C2.42524 27.1429 1.78564 27.7825 1.78564 28.5714Z" fill="#084F4E" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M29.6429 1.07143C27.8677 1.07143 26.4286 2.51051 26.4286 4.28571V11.4286C26.4286 13.1945 27.8527 14.6279 29.6151 14.6427L28.0767 19.6429H24.2857C23.7564 19.6429 23.257 19.7708 22.8167 19.9975L18.9286 16.8163V10C18.9286 8.2248 17.4895 6.78571 15.7143 6.78571H8.57143C6.79623 6.78571 5.35714 8.2248 5.35714 10V17.1429C5.35714 18.7901 6.59631 20.148 8.19334 20.3351L6.64811 25.3571H3.21429C1.43909 25.3571 0 26.7962 0 28.5714V35.7143C0 37.4894 1.43909 38.9286 3.21429 38.9286H10.3571C12.1323 38.9286 13.5714 37.4894 13.5714 35.7143V28.5714C13.5714 26.8054 12.1472 25.3721 10.3847 25.3573L11.9233 20.3571H15.7143C16.2435 20.3571 16.7429 20.2293 17.1831 20.0027L21.0714 23.184V30C21.0714 31.7751 22.5105 33.2143 24.2857 33.2143H31.4286C33.2037 33.2143 34.6429 31.7751 34.6429 30V22.8571C34.6429 21.2098 33.4037 19.8519 31.8066 19.6649L33.3517 14.6429H36.7857C38.5609 14.6429 40 13.2038 40 11.4286V4.28571C40 2.51051 38.5609 1.07143 36.7857 1.07143H29.6429ZM29.3551 23.2143C29.3826 23.2149 29.41 23.2149 29.4371 23.2143H31.0714V29.6429H24.6429V23.2143H29.3551ZM7.92663 28.9286C7.954 28.9291 7.98134 28.9291 8.00857 28.9286H10V35.3571H3.57143V28.9286H7.92663Z" fill="#090128" />
                        </svg>
                    </Flex>
                    <Text
                        fontSize={{ base: 18, md: 18, "2xl": 20, "3xl": 22 }}
                        fontFamily={font1}
                        alignSelf={'center'}
                        mt={1}
                        textAlign={'center'}

                    >إتقان النحو هو مفتاح الفهم العميق والتعبير الواضح – تعلّم القواعد لتتحدث بثقة وتكتب بتميز</Text>
                    <Flex justifyContent={'space-between'} width={'90%'} mt={4} alignSelf={'center'}>
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.8571 22.8571V30C22.8571 30.7889 23.4967 31.4286 24.2856 31.4286H31.4285C32.2174 31.4286 32.8571 30.7889 32.8571 30V22.8571C32.8571 22.0682 32.2174 21.4286 31.4285 21.4286H24.2856C23.4967 21.4286 22.8571 22.0682 22.8571 22.8571ZM1.78564 28.5714V35.7143C1.78564 36.5031 2.42524 37.1429 3.21422 37.1429H10.3571C11.146 37.1429 11.7856 36.5031 11.7856 35.7143V28.5714C11.7856 27.7825 11.146 27.1429 10.3571 27.1429H3.21422C2.42524 27.1429 1.78564 27.7825 1.78564 28.5714Z" fill="#084F4E" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M29.6429 1.07143C27.8677 1.07143 26.4286 2.51051 26.4286 4.28571V11.4286C26.4286 13.1945 27.8527 14.6279 29.6151 14.6427L28.0767 19.6429H24.2857C23.7564 19.6429 23.257 19.7708 22.8167 19.9975L18.9286 16.8163V10C18.9286 8.2248 17.4895 6.78571 15.7143 6.78571H8.57143C6.79623 6.78571 5.35714 8.2248 5.35714 10V17.1429C5.35714 18.7901 6.59631 20.148 8.19334 20.3351L6.64811 25.3571H3.21429C1.43909 25.3571 0 26.7962 0 28.5714V35.7143C0 37.4894 1.43909 38.9286 3.21429 38.9286H10.3571C12.1323 38.9286 13.5714 37.4894 13.5714 35.7143V28.5714C13.5714 26.8054 12.1472 25.3721 10.3847 25.3573L11.9233 20.3571H15.7143C16.2435 20.3571 16.7429 20.2293 17.1831 20.0027L21.0714 23.184V30C21.0714 31.7751 22.5105 33.2143 24.2857 33.2143H31.4286C33.2037 33.2143 34.6429 31.7751 34.6429 30V22.8571C34.6429 21.2098 33.4037 19.8519 31.8066 19.6649L33.3517 14.6429H36.7857C38.5609 14.6429 40 13.2038 40 11.4286V4.28571C40 2.51051 38.5609 1.07143 36.7857 1.07143H29.6429ZM29.3551 23.2143C29.3826 23.2149 29.41 23.2149 29.4371 23.2143H31.0714V29.6429H24.6429V23.2143H29.3551ZM7.92663 28.9286C7.954 28.9291 7.98134 28.9291 8.00857 28.9286H10V35.3571H3.57143V28.9286H7.92663Z" fill="#090128" />
                        </svg>
                        <Flex></Flex>

                    </Flex>
                </Flex>

                <Flex width={'80%'} alignSelf={'center'} dir='rtl' p={6}>
                    <Text
                        fontFamily={font1}
                        color={'black'}
                        fontSize={{ base: 20, "2xl": 24, "3xl": 26 }}
                        alignSelf={'start'}
                    >الدروس</Text>
                </Flex>
                <Flex
                    dir="rtl"
                    width="84%"
                    overflowX="auto"
                    whiteSpace="nowrap"

                    pt={2}
                    pb={2}
                    pl={2}
                >
                    {lessons !== null ? lessons.map((item, i) => (
                        <Box key={i} flexShrink={0}>
                            <Lesson3
                                index={i}
                                title={item.lesson.title}
                                color={
                                    i === 0 || i === 4 || i === 8
                                        ? '#22078a'
                                        : i === 1 || i === 5 || i === 9
                                            ? '#084f4d'
                                            : i === 2 || i === 6
                                                ? '#7b9e19'
                                                : i === 3 || i === 7
                                                    ? '#3d0c6e'
                                                    : ''
                                }
                                finished={item.finished}
                                value={item.value}
                                onClick={() => navigate(`/lesson/${item.id}/video`)}
                            />
                        </Box>
                    )) : <LoadingLesson />}
                </Flex>

                <Flex width={'80%'} alignSelf={'center'} dir='rtl' p={6} >
                    <Text
                        fontFamily={font1}
                        color={'black'}
                        fontSize={{ base: 20, "2xl": 24, "3xl": 26 }}
                        alignSelf={'start'}
                    >التمارين التفاعلية</Text>
                </Flex>

                <Flex
                    dir='rtl'
                    justifyContent={'space-between'}
                    width={'86%'}
                    alignItems={'center'}
                    flexDir={{ base: 'column', md: 'row' }}
                >
                    <Training txt={'تحدي الإعراب السريع'} img={goal} onClick={() => navigate('/rapid-parsing-challange')} />
                    <Training txt={'تمرين أكمل الفراغ'} img={full_the_blank} onClick={() => navigate('/full-blank')} />
                    <Training txt={'تمرين الإعراب في الواقع'} img={speak_training} />
                    <Training txt={'تمرين المحادثة اليومية'} img={conversation_training_daily} onClick={() => navigate('/daily-conversation')} />

                </Flex>
            </Flex>
        </Flex>
    )
}

const LoadingLesson = () => {
    return (
        <Flex flexShrink={0}>
            <Skeleton
                width={'220px'}
                height={'160px'}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                rounded={'md'}
                ml={12}
            />
            <Skeleton
                width={'220px'}
                height={'160px'}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                rounded={'md'}
                ml={12}
            />
            <Skeleton
                width={'220px'}
                height={'160px'}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                rounded={'md'}
                ml={12}
            />
            <Skeleton
                width={'220px'}
                height={'160px'}
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                rounded={'md'}
                ml={12}
            />
        </Flex>
    )
}