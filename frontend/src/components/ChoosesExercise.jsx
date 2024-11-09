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

export default function ChoosesExercise({ resp, id, page, setPage, setNumLine, results, setResults }) {

    return (
        <Flex alignSelf={'end'} flexDir={'column'} dir='rtl' width={'100%'}>

            {page === 'chooses_challange' ? <Challange page={page} setPage={setPage} resp={resp} results={results} setResults={setResults} setNumLine={setNumLine} /> : ''}

        </Flex>
    )
}



const Challange = ({ page, setPage, resp, results, setResults, setNumLine }) => {

    const [correctChooses, setCorrectChooses] = useState([]);
    const [wrongChooses, setWrongChooses] = useState([]);

    const handleNext = () => {
        const query = { "wrongChooses": wrongChooses, "correctChooses": correctChooses }
        setResults({ ...results, chooses: query })
        setNumLine(5)
        setPage('parsing_view');
    }
    return (
        <Flex
            flex="1"
            width={'100%'}
            alignSelf={{ base: 'center' }}
            flexDir={'column'}
            alignItems={{ base: 'center', md: 'start' }}
            color={'black'}
            pb={10}
            overflowY="auto"
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
                        results={results} setResults={setResults}
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
                onClick={handleNext}
            >إنتقل للتمرين التالي</Button>

        </Flex>
    )
}


const Question = ({ question, options, index, correct_answer, correctChooses, wrongChooses, results, setResults }) => {

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
                        all_options={options}
                        results={results} setResults={setResults}
                    />
                ))}
            </Flex>
        </Flex>
    )
}

const Option = ({ txt, number, correct_answer, question, isClicked, setIsCLicked, correctChooses, wrongChooses, all_options, results, setResults }) => {
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
                correctChooses.push({ "question": question, "answer": txt, options: all_options })
            }
            else {
                setBg(wrongColor);
                wrongChooses.push({ "question": question, "choose_answer": txt, "correct_answer": correct_answer, options: all_options })
            }
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