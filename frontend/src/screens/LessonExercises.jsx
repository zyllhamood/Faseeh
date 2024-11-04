import React, { useState, useEffect, useRef } from 'react'
import { Flex, Text, Input, Box, Image, Button, Textarea } from '@chakra-ui/react';
import { font1 } from '../localVars';
import arrow_up from '../assets/images/arrow-up.png';
import Cookies from 'js-cookie';
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
};
export default function LessonExercises({ resp, showExercises, setShowExercises }) {
    const [showExercise2, setShowExercise2] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [correctChooses, setCorrectChooses] = useState([]);
    const [wrongChooses, setWrongChooses] = useState([]);
    const answerRef = useRef('');
    const [parsing, setParsing] = useState('');
    const handleClick = () => {
        const parsing_answer = answerRef.current.value.split('\n').join(' ');
        setParsing(parsing_answer)
        setShowExercises(false);
        setShowExercise2(false);
        setShowResults(true);
    }
    return (
        <>
            <Flex
                flex="1"
                width={'100%'}
                alignSelf={{ base: 'center' }}
                flexDir={'column'}
                alignItems={{ base: 'center', md: 'start' }}
                color={'black'}
                pb={10}
                overflowY="auto"
                display={showExercises && !showExercise2 ? 'flex' : 'none'}
            >
                <Flex
                    id="exercises"
                    width={'86%'}
                    flexDir={'column'}
                    alignItems={'center'}
                    alignSelf={'center'}
                    mt={4}

                    justifyContent={'center'}
                >
                    {resp !== null && resp.questions.map((item, index) =>
                        <Question
                            question={item.question}
                            options={shuffleArray(item.answers)}
                            index={index}
                            correct_answer={item.correct_answer}
                            correctChooses={correctChooses}
                            wrongChooses={wrongChooses}
                        />)}

                </Flex>

                <Button
                    fontFamily={font1}
                    bgColor={'#22078A'}
                    fontWeight={'bold'}
                    color={'#fff'}
                    alignSelf={'center'}
                    mt={6}
                    width={{ base: '100%', md: '180px', "2xl": "200px", "3xl": "220px" }}
                    height={{ base: '50px', "2xl": "52px", "3xl": "54px" }}
                    fontSize={{ base: 14, "2xl": 16, "3xl": 18 }}
                    borderRadius={8}
                    _hover={{ opacity: 7 }}
                    onClick={() => setShowExercise2(true)}
                >إنتقل للتمرين الثاني</Button>

            </Flex>

            <Flex
                flex="1"
                width={'100%'}
                alignSelf={{ base: 'center' }}
                flexDir={'column'}
                alignItems={{ base: 'center', md: 'start' }}
                color={'black'}
                pb={10}
                overflowY="auto"
                display={showExercise2 ? 'flex' : 'none'}
            >
                <Text
                    width={'86%'}
                    dir='rtl'
                    fontFamily={font1}
                    fontSize={{ base: 20, "2xl": 22, "3xl": 24 }}
                    mt={'120px'}
                    pb={4}

                >
                    التمرين الثاني
                </Text>
                <Flex
                    width={{ base: '90%', md: '70%' }}
                    mt={4}
                    flexDir={'column'}
                    borderRadius={16}
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                    height={{ base: '320px', md: '400px' }}
                    alignSelf={'center'}
                    alignItems={'center'}


                >
                    <Text
                        p={{ base: 3, md: 0 }}
                        textAlign={{ base: 'center', md: 'start' }}
                        mt={{ base: 10, md: 20 }}
                        fontFamily={font1}
                        fontSize={{ base: 22, "2xl": 24, "3xl": 26 }}
                    >قم بإعراب هذه الجملة</Text>
                    <Text
                        p={{ base: 3, md: 0 }}
                        textAlign={{ base: 'center', md: 'start' }}
                        fontFamily={font1}
                        fontSize={{ base: 20, "2xl": 22, "3xl": 24 }}
                        dir='rtl'
                        mt={{ base: 5, md: 10 }}
                    >
                        (("<Box dir={'rtl'} as='spin' color={'#2908aa'}>{resp !== null && resp.sentence_for_parsing}</Box>"))
                    </Text>
                </Flex>

                <Flex
                    width={{ base: '90%', md: '70%' }}
                    alignSelf="center"
                    mt={{ base: 5, md: 10 }}


                >
                    <Flex
                        ml={{ base: 5, md: 10 }}
                        bgColor={'black'}
                        width={'60px'}
                        height={'60px'}
                        borderRadius={120}
                        justifyContent={'center'}
                        alignItems={'center'}
                        position={'absolute'}
                        cursor={'pointer'}
                        zIndex={2}

                        mt={3}
                        onClick={handleClick}
                    >
                        <Image src={arrow_up} width="26px" height="26px" />
                    </Flex>

                    <Textarea
                        fontFamily={font1}
                        fontSize={{ base: 20, "3xl": 22 }}
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

            {showResults && <Results resp={resp} parsing={parsing} correctChooses={correctChooses} wrongChooses={wrongChooses} />}
        </>


    )
}


const Question = ({ question, options, index, correct_answer, correctChooses, wrongChooses }) => {

    const [isClicked, setIsCLicked] = useState(false);

    const num_question = index === 0 ? 'السؤال الأول' : index === 1 ? 'السؤال الثاني' : index === 2 ? 'السؤال الثالث' : index === 3 ? 'السؤال الرابع' : '';
    return (
        <Flex width={'100%'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
            <Text
                width={'86%'}
                dir='rtl'
                fontFamily={font1}
                fontSize={{ base: 20, "2xl": 22, "3xl": 24 }}
                mt={'120px'}
                pb={4}
                mr={10}
            >{num_question}</Text>
            <Flex

                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                borderRadius={16}
                p={5}
                width={{ base: '340px', md: '700px' }}
                pb={16}
                flexDir={'column'}
                mt={4}
                pt={10}
                dir='rtl'
            >
                <Text
                    fontFamily={font1}
                    fontSize={{ base: 18, md: 20, "3xl": 22 }}
                    alignSelf={'center'}
                    textAlign={{ base: 'center', md: 'start' }}
                    bgColor={'#3d0c6e'}
                    color={'#fff'}
                    pt={6}
                    pb={6}
                    pr={4}
                    pl={4}
                    borderRadius={16}
                >{question}</Text>
                {options.map((item, index) => (
                    <Option
                        txt={item}
                        number={index === 0 ? 'أ' : index === 1 ? 'ب' : index === 2 ? 'ج' : index === 3 ? 'د' : ''}
                        correct_answer={correct_answer}
                        question={question}
                        isClicked={isClicked}
                        setIsCLicked={setIsCLicked}
                        correctChooses={correctChooses}
                        wrongChooses={wrongChooses}
                    />
                ))}
            </Flex>
        </Flex>
    )
}

const Option = ({ txt, number, correct_answer, question, isClicked, setIsCLicked, correctChooses, wrongChooses }) => {
    const statisColor = '#fff';
    const [bg, setBg] = useState(statisColor);
    const isCorrect = correct_answer === txt;


    const handleClick = () => {
        if (!isClicked) {
            setIsCLicked(true);


            const correctColor = '#8cc98f';
            const wrongColor = '#ff5261';

            if (isCorrect) {
                setBg(correctColor);
                correctChooses.push({ "question": question, "answer": txt })
            }
            else {
                setBg(wrongColor);
                wrongChooses.push({ "question": question, "choose_answer": txt, "correct_answer": correct_answer })
            }
            console.log(wrongChooses)
        }

    }
    return (
        <Flex
            width={{ base: '100%', md: '90%' }}
            mt={number === 'أ' ? 10 : 6}

            alignSelf={'center'}
            dir='rtl'
            alignItems={'center'}
            justifyContent={'space-between'}
            cursor={'pointer'}
        >
            <Flex
                bgColor={'#3d0c6e'}
                borderRadius={8}
                height={{ base: '90px', md: '60px' }}
                width={'50px'}
                justifyContent={'center'}
                alignItems={'center'}
                mr={{ base: 0, md: 2 }}

            >
                <Text fontSize={{ base: 20, "3xl": 22 }} fontFamily={font1} color={'white'}>{number}</Text>
            </Flex>
            <Flex
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                borderRadius={8}
                width={{ base: '80%', md: '89%' }}
                height={{ base: '90px', md: '60px' }}
                alignItems={'center'}
                bgColor={bg}
                onClick={handleClick}

            >
                <Text
                    fontFamily={font1}
                    fontSize={{ base: 18, "3xl": 20 }}
                    mr={{ base: 0, md: 6 }}
                    textAlign={{ base: 'center', md: 'start' }}
                    p={{ base: 2, md: 0 }}
                >{txt}</Text>
            </Flex>
        </Flex>
    )
}

const Results = ({ resp, parsing, correctChooses, wrongChooses }) => {
    const [respSolve, setRespSolve] = useState(null);
    useEffect(() => {
        const fetchData = () => {
            const query = { parsing, correctChooses, wrongChooses, sentence: resp.sentence_for_parsing };
            console.log(query)
            fetch('https://i.zyll.shop/lesson-solve/', {
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
        <Flex flexDir={'column'} dir='rtl' alignItems={'center'} width={{ base: '100%', "2xl": "90%", "3xl": "80%" }} alignSelf={'center'} mr={100} color={'black'}>
            <Text fontFamily={font1} fontSize={{ base: 22, "2xl": 24, "3xl": 26 }} width={'70%'} mt={6}>الخيارات</Text>
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
                {wrongChooses.length > 0 && (
                    wrongChooses.map((item) => (
                        <Text fontFamily={font1} dir='rtl' mt={1} color={'black'}>

                            <Box as='spin' color={'black'}> {item.question}</Box>
                            <Box as='spin' color={'darkred'} mr={2}>{item.choose_answer}</Box>
                            <Box as='spin' color={'green'} mr={2}>{item.correct_answer}</Box>
                        </Text>
                    ))
                )}
                {/* {respSolve !== null && respSolve.wrong_questions.map((item) => (
                    <Text fontFamily={font1} dir='rtl' mt={1} color={'black'}>
                        {item.question} ?
                        <Box as='spin' color={'green'}> {item.correct_answer}</Box>
                        <Box as='spin' color={'silver'} mr={2}>{item.why}</Box>
                    </Text>
                ))} */}
            </Flex>

            <Text fontFamily={font1} fontSize={{ base: 22, "2xl": 24, "3xl": 26 }} width={'70%'} mt={6}>
                {respSolve !== null && respSolve.is_correct ? 'احسنت في اعراب الجملة' : 'الاعراب خاطئا '}

            </Text>
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
                {respSolve !== null && resp.is_correct !== true && (
                    <Text fontFamily={font1} dir='rtl' mt={1} color={'black'} fontSize={{ base: 16, "2xl": 18, "3xl": 20 }} lineHeight={{ base: 7, "2xl": 8, "3xl": 9 }}>

                        <Box as='spin' color={'green'}> {respSolve.correct_answer}</Box>
                        <Box as='spin' color={'black'} mr={2}>{respSolve.why}</Box>
                    </Text>
                )}
                {/* {respSolve !== null && respSolve.wrong_questions.map((item) => (
                    <Text fontFamily={font1} dir='rtl' mt={1} color={'black'}>
                        {item.question} ?
                        <Box as='spin' color={'green'}> {item.correct_answer}</Box>
                        <Box as='spin' color={'silver'} mr={2}>{item.why}</Box>
                    </Text>
                ))} */}
            </Flex>
        </Flex>
    )
}