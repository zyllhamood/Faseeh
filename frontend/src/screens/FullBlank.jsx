import React, { useState, useEffect } from 'react'
import { Flex, Text, Box, Button, Image } from '@chakra-ui/react';
import AvatarName from '../components/AvatarName';
import Sidebar from '../components/Sidebar';
import { font1 } from '../localVars';
import people from '../assets/images/full-the-blank.png'
import MenuNav from '../components/MenuNav';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
export default function FullBlank() {
    const [page, setPage] = useState('view');
    const [resp, setResp] = useState(null);
    useEffect(() => {
        const fetchData = () => {
            fetch('http://192.168.8.168:8000/full-blank/')
                .then((response) => response.json())
                .then((data) => {
                    if (data.resp !== null) {
                        setResp(data.resp);
                    } else {
                        setTimeout(fetchData, 1000);
                    }
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    setTimeout(fetchData, 1000);
                });
        }
        if (resp === null) {
            fetchData();
        }
    }, [resp])
    return (
        <Flex direction={{ base: 'column', md: "row-reverse" }} minH="100vh" width={'100%'} color={'#fff'}>
            <Sidebar page={'Home'} />
            {page === 'view' ? <View setPage={setPage} resp={resp} /> : <Challange page={page} setPage={setPage} resp={resp} />}

        </Flex>
    )
}

const View = ({ setPage, resp }) => {
    return (
        <Flex flex="1" width={{ base: '100%', md: '84%' }} flexDir={'column'} alignItems={'start'} color={'black'} pb={10} mr="16%" overflowY="auto">
            <Flex
                width={'90%'}
                alignSelf={'center'}
                mt={6}
                justifyContent={'space-between'}
                color={'black'}
            >
                <AvatarName />
                <Box display={{ base: 'block', md: 'none' }} mt={1}>
                    <MenuNav />
                </Box>
            </Flex>


            <Image
                src={people}
                width={'160px'}
                alignSelf={'center'}
                mt={12}
            />
            <Text
                fontFamily={font1}
                fontSize={24}
                alignSelf={'center'}
                color={'#2B1875'}
                mt={10}

            >تمرين أكمل الفراغ </Text>

            <Text
                fontFamily={font1}
                fontSize={24}
                textAlign={'center'}
                alignSelf={'end'}
                width={'56%'}
                mt={10}
                dir='rtl'

            >إرشادات التمرين:</Text>


            <Flex
                dir='rtl'

                alignSelf={'center'}
                mt={10}
                mr={{ base: 2, md: -8 }}
                alignItems={{ base: 'start', md: 'center' }}
                width={{ base: ' 86%', md: '66%' }}
            >
                <Box height={'6px'} width={'6px'} bgColor={'black'} ml={4} mt={{ base: 4, md: 2 }}></Box>
                <Text
                    alignSelf={'center'}
                    textAlign={{ base: 'center', md: 'start' }}
                    fontFamily={font1}
                    width={'100%'}
                    fontSize={24}
                >تأكد من فهم معنى كامل نوع الكلمة المطلوبة (فعل، اسم، أو غيرها).</Text>
            </Flex>

            <Flex
                dir='rtl'
                alignSelf={'center'}
                mt={2}
                alignItems={'center'}
                width={{ base: ' 86%', md: '66%' }}
            >
                <Box height={'6px'} width={'6px'} bgColor={'black'} ml={4} mt={{ base: -8, md: 2 }}></Box>
                <Text
                    alignSelf={'center'}
                    width={'100%'}
                    textAlign={{ base: 'center', md: 'start' }}
                    fontFamily={font1}
                    fontSize={24}
                >استخدم الخيارات المتاحة لإكمال الجملة</Text>
            </Flex>
            <Flex
                dir='rtl'
                alignSelf={'center'}
                mt={2}
                alignItems={'center'}
                width={{ base: ' 86%', md: '66%' }}
            >
                <Box height={'6px'} width={'6px'} bgColor={'black'} ml={4} mt={{ base: -8, md: 2 }}></Box>
                <Text
                    alignSelf={'center'}
                    width={'100%'}
                    textAlign={{ base: 'center', md: 'start' }}
                    fontFamily={font1}
                    fontSize={24}
                >بعد انتهاء التمرين، سيوضح لك النظام الإجابة الصحيحة</Text>
            </Flex>



            <Button
                bgColor={'#1B0378'}
                alignSelf={'center'}
                mt={10}
                color={'#fff'}
                fontFamily={font1}
                fontSize={24}
                width={'220px'}
                height={'54px'}
                borderRadius={20}
                _hover={{ opacity: 0.7 }}
                onClick={() => setPage('challange')}
                isLoading={resp === null ? true : false}
            >
                البدء
            </Button>
        </Flex>
    )
}

const Challange = ({ page, setPage, resp }) => {
    const [wrongAnswers, setWrongAnswers] = useState([]);
    return (
        <Flex flex="1" width={{ base: '100%', md: '84%' }} flexDir={'column'} alignItems={'start'} color={'black'} pb={10} mr="16%" overflowY="auto">
            <Flex
                width={'90%'}
                alignSelf={'center'}
                mt={6}
                justifyContent={'space-between'}
                color={'black'}
            >
                <AvatarName />
                <Box display={{ base: 'block', md: 'none' }} mt={1}>
                    <MenuNav />
                </Box>
            </Flex>

            <Text
                fontFamily={font1}
                fontSize={24}
                alignSelf={'center'}
                mt={'80px'}
            >تمرين إملأ الفراغ</Text>
            {page === 'challange' ? <Question setPage={setPage} resp={resp} wrongAnswers={wrongAnswers} /> : <Results wrongAnswers={wrongAnswers} />}

        </Flex>
    )
}

const Question = ({ setPage, resp, wrongAnswers }) => {
    const [num, setNum] = useState(0)



    const handleClick = (choose, item) => {
        if (choose !== item.correct) {
            wrongAnswers.push({ question: item.question, choose: choose, correct_answer: item.correct })
        }
        if (num === 3) {
            setPage('results')
        }
        else {
            setNum(num + 1)
        }
    }
    return (
        resp !== null && (
            <>
                <Flex
                    boxShadow="0px 3.51px 20.21px 0px #1B0378"
                    width={{ base: '340px', md: '660px' }}
                    height={'180px'}
                    borderRadius={12}
                    alignSelf={'center'}
                    mt={12}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Text
                        fontFamily={font1}
                        fontSize={20}
                    >
                        {resp[num].question}
                    </Text>
                </Flex>

                <Flex
                    alignSelf={'center'}
                    width={{ base: '80%', md: '70%' }}
                    justifyContent={'space-between'}
                    mt={20}

                >
                    <Answer txt={resp[num].answers[0]} onClick={() => handleClick(resp[num].answers[0], resp[num])} />
                    <Answer txt={resp[num].answers[1]} onClick={() => handleClick(resp[num].answers[1], resp[num])} />
                </Flex>
                <Flex
                    alignSelf={'center'}
                    width={{ base: '80%', md: '70%' }}
                    justifyContent={'space-between'}
                    mt={10}

                >
                    <Answer txt={resp[num].answers[2]} onClick={() => handleClick(resp[num].answers[2], resp[num])} />
                    <Answer txt={resp[num].answers[3]} onClick={() => handleClick(resp[num].answers[3], resp[num])} />
                </Flex>
            </>
        )

    )
}
const Answer = ({ txt, onClick }) => {
    return (
        <Flex
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            width={{ base: '140px', md: '380px' }}
            height={'110px'}
            borderRadius={12}
            justifyContent={'center'}
            alignItems={'center'}
            onClick={onClick}
            cursor={'pointer'}
        >
            <Text fontFamily={font1} fontSize={20}>{txt}</Text>
        </Flex>
    )
}

const Results = ({ wrongAnswers }) => {
    const [resp, setResp] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = () => {
            fetch('http://192.168.8.168:8000/full-blank-solve/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("access_token")}`
                },
                body: JSON.stringify(wrongAnswers),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.resp !== null) {
                        setResp(data.resp);
                    } else {
                        setTimeout(fetchData, 1000);
                    }
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    setTimeout(fetchData, 1000);
                });
        }

        if (resp === null) {
            fetchData();
        }
    }, [resp])
    return (
        // <Flex flexDir={'column'} dir='rtl' alignItems={'center'} width={'100%'}>
        //     <Text fontFamily={font1} fontSize={22} width={'70%'} mt={10}>الإجابات الخاطئة التصحيح:</Text>
        //     <Flex
        //         boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
        //         width={'70%'}
        //         height={'200px'}
        //         mt={4}
        //         borderRadius={12}
        //         flexDir={'column'}
        //         p={5}
        //     >
        //         {wrongAnswers.map((item) => (
        //             <Text
        //                 fontFamily={font1}
        //                 dir='rtl'

        //                 mt={1}
        //             >{item.question}  <Box mr={2} as='spin' color={'red'}>{item.choose}</Box></Text>
        //         ))}
        //     </Flex>

        //     <Text fontFamily={font1} fontSize={22} width={'70%'} mt={6}>التوضيح:</Text>
        //     <Flex
        //         boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
        //         width={'70%'}
        //         height={'200px'}
        //         mt={4}
        //         borderRadius={12}
        //         flexDir={'column'}
        //         p={5}
        //         overflowY={'scroll'}
        //     >
        //         {resp !== null && resp.map((item) => (
        //             <Text fontFamily={font1} dir='rtl' mt={1}>
        //                 {item.question} <Box as='spin' color={'green'}>{item.answer}</Box> : {item.why}
        //             </Text>
        //         ))}
        //     </Flex>
        // </Flex>
        <Flex alignSelf={'center'} mt={40}>
            {resp === null ? <Icon icon="svg-spinners:tadpole" width={'100px'} /> : navigate('/summary')}
        </Flex>
    )
}