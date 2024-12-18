import React, { useEffect, useState } from 'react'
import { Flex, Text, Button, Image, Box, Spinner, useToast } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import { font1 } from '../localVars';
import goal from '../assets/images/goal.png'
import { Icon } from '@iconify/react'
import MenuNav from '../components/MenuNav';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
export default function RapidExercise({ resp, id, page, setPage, setNumLine, results, setResults }) {


    return (
        <Flex alignSelf={'end'} flexDir={'column'} dir='rtl' width={'100%'}>

            {page === 'rapid_view' ? <View page={page} setPage={setPage} resp={resp} /> : page === 'rapid_challange' ? <Challange page={page} setPage={setPage} resp={resp} results={results} setResults={setResults} setNumLine={setNumLine} /> : ''}
        </Flex>

    )
}

const View = ({ page, setPage, resp }) => {

    return (
        <>

            <Flex
                mt={20}
                width={'280px'}
                alignSelf={'center'}
                height={'60px'}
                bgColor={'#1B0378'}
                borderRadius={20}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Text fontFamily={font1} fontSize={24} color={'#fff'}>تحدي الإعراب السريع </Text>
            </Flex>
            <Image
                src={goal}
                width={'160px'}
                alignSelf={'center'}
                mt={12}
            />

            <Flex
                dir='rtl'
                alignSelf={'center'}
                mt={10}
                alignItems={{ base: 'start', md: 'center' }}
                mr={{ base: 2, md: -8 }}
            >
                <Box height={'6px'} width={'6px'} bgColor={'black'} ml={{ base: 1, md: 4 }} mt={{ base: 4, md: 2 }}></Box>
                <Text
                    alignSelf={'center'}
                    textAlign={{ base: 'center', md: 'start' }}
                    width={{ base: '96%', md: '100%' }}
                    fontFamily={font1}
                    fontSize={24}
                >ستظهر لك مجموعة  من الأسئلة حاول حل أكبر قدر في أقل وقت ممكن </Text>
            </Flex>

            <Flex dir='rtl' alignSelf={'center'} mt={2} alignItems={'center'} mr={{ base: 2, md: -8 }}>
                <Box height={'6px'} width={'6px'} bgColor={'black'} ml={{ base: 1, md: 4 }} mt={{ base: -8, md: 2 }}></Box>
                <Text
                    alignSelf={'center'}
                    textAlign={'center'}
                    width={{ base: '96%', md: '100%' }}
                    fontFamily={font1}
                    fontSize={24}
                >سيظهر لك مؤقت زمني يقيس سرعتك في الإجابة على الأسئلة </Text>
            </Flex>

            <Text
                alignSelf={'center'}
                textAlign={'center'}
                mt={2}
                width={'96%'}
                fontFamily={font1}
                fontSize={24}
            >في حال كنت جاهزا اضغط على زر البدء</Text>

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
                onClick={() => setPage('rapid_challange')}
                isLoading={resp === null ? true : false}

            >
                البدء
            </Button>
        </>
    )
}

const Challange = ({ page, setPage, resp, results, setResults, setNumLine }) => {

    const [timeLeft, setTimeLeft] = useState(40);
    const [locked, setLocked] = useState(false);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const handleNext = () => {
        setNumLine(3)
        setPage('daily_view')
    }
    useEffect(() => {
        if (timeLeft === 0) {
            setLocked(true);
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);


    return (
        <>
            <Text alignSelf={'center'} mt={10} fontFamily={font1} fontSize={24}>تحدي الإعراب السريع </Text>

            <Text fontFamily={font1} fontSize={26} alignSelf={'center'} mt={10}>00:00:{timeLeft}</Text>


            <Question locked={locked} setLocked={setLocked} timeLeft={timeLeft} page={page} setPage={setPage} resp={resp} wrongAnswers={wrongAnswers} results={results} setResults={setResults} setNumLine={setNumLine} />

            <Flex width={'60%'} alignSelf={'center'} mt={16}>
                <Button
                    bgColor={'#1B0378'}
                    color={'#fff'}
                    width={'200px'}
                    alignSelf={'center'}
                    dir='rtl'
                    mt={4}
                    fontFamily={font1}
                    fontSize={26}
                    height={'48px'}
                    borderRadius={12}
                    justifyContent="space-between"
                    rightIcon={<Icon icon={'ion:arrow-back'} width={28} />}
                    display={locked ? 'flex' : 'none'}
                    _hover={{ opacity: 0.7 }}
                    onClick={handleNext}

                >
                    <Box flex="1" textAlign="center" >التالي</Box>
                </Button>
            </Flex>
        </>
    )
}

const Line = ({ done }) => {

    return (
        <Flex width={'200px'} height={'10px'} borderRadius={20} bgColor={done ? '#1B0378' : '#D9D9D9'}>

        </Flex>
    )
}

const Question = ({ locked, setLocked, timeLeft, page, setPage, resp, wrongAnswers, results, setResults, setNumLine }) => {
    const [num, setNum] = useState(0);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [answers, setAnswers] = useState([]);

    const [finished, setFinished] = useState(false);
    const toast = useToast();
    useEffect(() => {
        if (resp !== null) {
            setQuestion(resp[num].question);
            const new_options = shuffleArray(resp[num].options);
            setOptions(new_options);
        }
    }, [num])

    const handleClick = (question, txt, is_correct) => {
        if (!locked) {
            if (!is_correct) {
                !finished && wrongAnswers.push({ question: question, answer: txt })
            }

            answers.push(txt);
            if (num === 4) {
                setFinished(true);
                setLocked(true);
                const query = { "wrong_answers": wrongAnswers }
                setResults({ ...results, rapid_challange: query })
                setNumLine(3)
                setPage('daily_view')

                toast({
                    position: 'top',
                    title: `تم حل التحدي السريع في ${40 - timeLeft} ثواني`,

                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })

            }
            else {
                setNum(num + 1);
            }
        }



    }
    return (
        <>
            <Flex width={'84%'} alignSelf={'center'} justifyContent={'space-between'} mt={10} dir='rtl'>
                <Line done={true} />
                <Line done={num > 0 ? true : false} />
                <Line done={num > 1 ? true : false} />
                <Line done={num > 2 ? true : false} />
                <Line done={num > 3 ? true : false} />

            </Flex>
            <Text fontFamily={font1} textAlign={'center'} fontSize={24} alignSelf={'center'} mt={10}>{question}</Text>

            {options.length > 0 && options.map((item, index) => (
                <Flex
                    width={{ base: '380px', md: '600px' }}
                    height={{ base: '100px', md: '60px' }}
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                    alignSelf={'center'}
                    mt={index === 0 ? 10 : 4}
                    borderRadius={12}
                    dir='rtl'
                    alignItems={'center'}
                    cursor={'pointer'}
                    onClick={() => handleClick(question, item.option ? item.option : item.options, item.is_correct)}
                >
                    <Text fontFamily={font1} fontSize={24} mr={8}>{item.option ? item.option : item.options}</Text>
                </Flex>
            ))}
        </>
    )
}

const Results = ({ wrongAnswers, setPage }) => {
    const [resp, setResp] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = () => {
            fetch('http://172.20.10.5:8000/rapid-challenge-solve/', {
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
        //             >{item.question}  <Box mr={2} as='spin' color={'red'}>{item.answer}</Box></Text>
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
            {resp === null ? <Icon icon="svg-spinners:tadpole" width={'100px'} /> : setPage('daily_view')}
        </Flex>
    )
}