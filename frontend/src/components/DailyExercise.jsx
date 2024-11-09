import React, { useState, useEffect, useRef } from 'react'
import { Flex, Text, Button, Box, Image, Avatar, Input, Textarea } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';

import { font1 } from '../localVars';
import man from '../assets/images/man.jpeg'
import pizza from '../assets/images/pizza.jpeg'
import metting from '../assets/images/metting.png'
import arrow_up from '../assets/images/arrow-up.png';
import Cookies from 'js-cookie';
export default function DailyExercise({ resp, id, page, setPage, setNumLine, results, setResults }) {

    const [answer, setAnswer] = useState(null);

    return (
        <Flex alignSelf={'end'} flexDir={'column'} dir='rtl' width={'100%'}>

            {page === 'daily_view' ? <View setPage={setPage} resp={resp} /> :
                page === 'daily_challange' ? <Challange page={page} setPage={setPage} resp={resp} setAnswer={setAnswer} results={results} setResults={setResults} setNumLine={setNumLine} /> :
                    page === 'daily_results' ? <Results resp={resp} answer={answer} /> : ''
            }

        </Flex>
    )
}

const View = ({ setPage, resp }) => {
    return (
        <Flex alignSelf={'end'} flexDir={'column'} dir='rtl' width={'100%'}>
            <Image
                src={metting}
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

            >تمرين المحادثة اليومية</Text>

            <Text
                fontFamily={font1}
                fontSize={24}
                textAlign={'center'}

                width={'56%'}
                mt={10}
                dir='rtl'
                mb={8}

            >إرشادات التمرين:</Text>

            <TextBox txt={' اقرأ الحوار بعناية لفهم الهدف من المحادثة'} />
            <TextBox txt={'ركز على الكلمات الرئيسية في الحوار، لأنها ستستخدم لاحقًا في سؤال الإعراب'} />
            <TextBox txt={'ضع في اعتبارك كيف ترتبط الكلمات ببعضها البعض من الناحية النحوية'} />



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
                onClick={() => setPage('daily_challange')}
                isLoading={resp === null ? true : false}
            >
                البدء
            </Button>

        </Flex>
    )
}

const Challange = ({ page, setPage, resp, setAnswer, results, setResults, setNumLine }) => {
    const answerRef = useRef('')
    const handleClick = () => {
        const answer = answerRef.current.value.split('\n').join(' ');
        setAnswer(answer)
        // setPage('daily_results');
        const query = { "questions": resp.questions, "answer": answer }
        setResults({ ...results, daily_conversation: query })
        setNumLine(4)
        setPage('chooses_challange');
    }
    return (
        <Flex alignSelf={'end'} flexDir={'column'} dir='rtl' width={'100%'}>
            <Text
                fontFamily={font1}
                fontSize={24}
                alignSelf={'center'}
                color={'#2B1875'}
                mt={10}
                ml={{ base: 0, md: 20 }}
            >تمرين المحادثة اليومية</Text>

            <Flex
                flexDir={'column'}
                width={{ base: '90%', md: '70%' }}
                ml={{ base: 0, md: 20 }}
                alignSelf={'center'}
                dir='rtl'
            >
                {resp !== null && resp.conversations.map((item) => (
                    <Message from={item.from === 'client' ? 'start' : 'end'} msg={item.text} />
                ))}
                {/* <Message from={'start'} msg={'السلام عليكم، أود حجز طاولة لشخصين مساء اليوم'} />
                <Message from={'end'} msg={'وعليكم السلام، بالتأكيد. في أي وقت تفضل؟'} />
                <Message from={'start'} msg={'في الساعة الثامنة مساءً، إذا كان ذلك ممكناً'} />
                <Message from={'end'} msg={'تمام، تم الحجز. هل لديك أي طلبات خاصة؟'} />
                <Message from={'start'} msg={'نعم، أود طاولة بجانب النافذة، وأرجو أن يكون هناك قائمة طعام نباتية'} />
                <Message from={'end'} msg={' بالتأكيد، سيكون الطلب جاهزًا عند وصولك. شكرًا لتواصلك معنا'} /> */}
            </Flex>

            <Text
                dir='rtl'
                fontFamily={font1}
                mr={{ base: 10, md: '120px' }}
                fontSize={20}
                mt={10}
            >التمرين :</Text>

            <Flex
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"

                width={{ base: '90%', md: '70%' }}
                ml={{ base: 0, md: 20 }}
                alignSelf={'center'}
                mt={8}
                borderRadius={12}
                flexDir={'column'}

                p={10}
                dir='rtl'
            >
                <Text
                    fontFamily={font1}
                    fontSize={18}
                    mb={8}
                > استخرج من المحادثة السابقة إجابة الأسئلة الآتية:</Text>

                {resp !== null && resp.questions.map((item) => (
                    <BoxText txt={item.question} word_parsing={item.word_parsing} />
                ))}

                {/* <BoxText txt={'ما إعراب كلمة "طاولة" في الجملة: "أود حجز طاولة لشخصين مساء اليوم"؟'} />
                <BoxText txt={'ما إعراب "وقت" في الجملة: "في أي وقت تفضل؟'} />
                <BoxText txt={'ما إعراب كلمة "نافذة" في الجملة: "أود طاولة بجانب النافذة"؟'} />
                <BoxText txt={'ما إعراب "قائمة" في الجملة: "أرجو أن يكون هناك قائمة طعام نباتية"؟'} /> */}

            </Flex>

            <Flex
                width={{ base: '90%', md: '70%' }}
                alignSelf="center"
                mt={5}
                ml={{ base: 0, md: 20 }}
                justifyContent={'space-between'}
                dir='ltr'
            >
                <Flex
                    ml={{ base: 5, md: 10 }}
                    bgColor="#2908AA"
                    width="60px"
                    height="60px"
                    borderRadius={120}
                    justifyContent="center"
                    alignItems="center"
                    position="absolute"
                    cursor="pointer"
                    zIndex={2}
                    mt={3}
                    onClick={handleClick}

                >
                    <Image src={arrow_up} width="26px" height="26px" />
                </Flex>

                <Textarea
                    fontFamily={font1}
                    fontSize={20}
                    color="#666666"
                    borderWidth="0px"
                    width="100%"
                    lineHeight={'34px'}
                    zIndex={1}
                    fontWeight={'bold'}
                    dir="rtl"
                    placeholder="إكتب اجابتك هنا"
                    pt="26px"
                    pb={'13px'}
                    ref={answerRef}

                    pl="110px"
                    borderRadius="120"
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                    alignSelf="center"
                    pr={10}
                    position="relative"
                    resize="none"
                    minHeight="80px"
                    _focus={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }}
                    onInput={(e) => {
                        e.target.style.height = 'auto'; // Reset height to auto for recalculating
                        e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                    }}
                />

            </Flex>

        </Flex>
    )
}

const BoxText = ({ txt, word_parsing }) => {
    // Split the text into parts based on the word_parsing
    const parts = txt.split(word_parsing);

    return (
        <Flex alignItems={'start'} mt={1}>
            <Box height={'6px'} width={'6px'} bgColor={'black'} ml={4} mt={{ base: 2, md: 2.5 }}></Box>
            <Text
                alignSelf={'center'}
                width={'100%'}
                textAlign='start'
                fontFamily={font1}
                fontSize={18}
            >
                {/* Render each part, highlighting the word_parsing in red */}
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index < parts.length - 1 && (
                            <Text as="span" color="red" fontWeight="bold">
                                {word_parsing}
                            </Text>
                        )}
                    </React.Fragment>
                ))}
            </Text>
        </Flex>
    );
};


const Message = ({ from, msg }) => {
    return (
        <Flex alignSelf={from} dir={from === 'start' ? 'rtl' : 'ltr'} mt={6}>
            <Avatar src={from === 'start' ? man : pizza} width={'50px'} height={'50px'} mt={-3} />
            <Flex
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                pt={{ base: 8, md: 10 }}
                pb={{ base: 8, md: 10 }}
                width={{ base: '300px', md: '400px' }}
                pl={4}
                pr={4}
                borderRadius={8}
                ml={from === 'start' ? 0 : 2}
                mr={from === 'end' ? 0 : 2}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Text
                    fontFamily={font1}
                    textAlign={'center'}
                >
                    {msg}
                </Text>
            </Flex>
        </Flex>
    )
}

const TextBox = ({ txt }) => {
    return (
        <Flex
            dir='rtl'

            alignSelf={'center'}
            mt={2}
            mr={{ base: 2, md: -8 }}
            alignItems={{ base: 'start', md: 'center' }}
            width={{ base: ' 86%', md: '68%' }}
        >
            <Box height={'6px'} width={'6px'} bgColor={'black'} ml={4} mt={{ base: 4, md: 2 }}></Box>
            <Text
                alignSelf={'center'}
                textAlign={{ base: 'center', md: 'start' }}
                fontFamily={font1}
                width={'100%'}
                fontSize={24}
            >{txt}</Text>
        </Flex>
    )
}

const Results = ({ resp, answer }) => {
    const [respSolve, setRespSolve] = useState(null);
    useEffect(() => {
        const fetchData = () => {
            const query = { questions: resp.questions, answer: answer };

            fetch('http://172.20.10.5:8000/daily-conversation-solve/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("access_token")}`
                },
                body: JSON.stringify(query),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.resp !== null) {
                        setRespSolve(data.resp);
                    } else {
                        setTimeout(fetchData, 1000);
                    }
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    setTimeout(fetchData, 1000);
                });
        }
        if (respSolve === null) {
            fetchData();
        }
    }, [respSolve])
    return (
        <Flex flexDir={'column'} dir='rtl' alignItems={'center'} width={'100%'} alignSelf={'center'} mr={100} color={'black'}>
            <Text fontFamily={font1} fontSize={22} width={'70%'} mt={6}>
                {respSolve !== null && respSolve.is_all_correct ? 'جميع الاجابات صحيحه احسنت' : 'الاخطاء'}

                :</Text>
            <Flex
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                width={'70%'}
                height={'200px'}
                mt={4}
                borderRadius={12}
                flexDir={'column'}
                p={5}
                overflowY={'scroll'}
            >
                {respSolve !== null && respSolve.wrong_questions.map((item) => (
                    <Text fontFamily={font1} dir='rtl' mt={1} color={'black'}>
                        {item.question} ?
                        <Box as='spin' color={'green'}> {item.correct_answer}</Box>
                        <Box as='spin' color={'black'} mr={2}>{item.why}</Box>
                    </Text>
                ))}
            </Flex>
        </Flex>
    )
}