import React, { useState } from 'react'
import { Flex, Text, Button, Box, Image } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import Sidebar from '../components/Sidebar';
import AvatarName from '../components/AvatarName';
import { font1 } from '../localVars';
import GmailExercise from '../components/GmailExercise';
import CradsExercise from '../components/CradsExercise';
import LineExercises from '../components/LineExercises';
import MenuNav from '../components/MenuNav';
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react';
import RapidExercise from '../components/RapidExercise';
import DailyExercise from '../components/DailyExercise';
import ChoosesExercise from '../components/ChoosesExercise';
import ParsingExercise from '../components/ParsingExercise';
import FullExercise from '../components/FullExercise';
import Cookies from 'js-cookie'
import PdfDisplay from '../components/PdfDisplay';
import LessonView from '../components/LessonView';
import t from '../assets/images/t.png';
export default function LessonNew() {
    const [resp, setResp] = useState(null);
    const [respLesson, setRespLesson] = useState(null);
    const [respSolve, setRespSolve] = useState(null)
    const navigate = useNavigate()
    const { id } = useParams();
    const [page, setPage] = useState('');
    const [numLine, setNumLine] = useState(1);
    const [results, setResults] = useState({});
    useEffect(() => {
        if (page === '') {
            setPage('lesson_view')

        }
    }, [page])

    useEffect(() => {
        function fetchData() {
            fetch(`http://172.20.10.5:8000/lesson-last/${id}/`)
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




    useEffect(() => {
        function fetchData() {
            console.log('results');
            console.log(results)
            fetch(`http://172.20.10.5:8000/solve/${id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("access_token")}`
                },
                body: JSON.stringify(results)
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
        if (respSolve === null && page === 'results') {
            fetchData();
        }
    }, [respSolve, page])

    useEffect(() => {
        function fetchData() {
            fetch(`http://172.20.10.5:8000/lesson-view/${id}/`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.resp !== null) {
                        setRespLesson(data.resp);
                    } else {
                        setTimeout(fetchData, 1000);
                    }
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    setTimeout(fetchData, 1000);
                });
        }
        if (respLesson === null && page === 'lesson_view') {
            fetchData();
        }
    }, [respLesson, page])


    return (
        <Flex
            direction={{ base: 'column', md: "row-reverse" }}
            minH="100vh"
            width="100%"

        >
            <Sidebar page={'Exercises'} />

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
                    <Back page={page} setPage={setPage} />
                </Flex>

                <Flex dir='rtl' justifyContent={'space-between'} alignItems={'center'} width={'70%'} >
                    <Text
                        fontFamily={font1}
                        fontSize={{ base: 22, "2xl": 24, "3xl": 26 }}
                        color={'#000'}
                        mt={20}
                    >المسار التدريبي</Text>

                    <Flex alignItems={'center'} mt={10} onClick={() => window.open(`http://localhost:3000/lesson/${id}/video`)} cursor={'pointer'}>
                        <Text
                            color={'#23116B'}
                            fontFamily={font1}
                            fontSize={20}
                            ml={4}

                        >شاهد الدرس التوضيحي</Text>
                        <Image src={t} width={'100px'} />
                    </Flex>

                </Flex>

                {/* <Text>{respSolve}</Text> */}
                {/* {page !== 'rapid_challange' && <LineExercises numLine={numLine} />} */}

                {page !== 'rapid_challange' && page !== 'lesson_view' ? <LineExercises numLine={numLine} /> : ''}

                {page === 'lesson_view' && <LessonView respLesson={respLesson !== null && respLesson} resp={resp} page={page} setPage={setPage} />}
                {resp !== null && (
                    <>

                        {page.includes('cards') && <CradsExercise resp={resp} page={page} setPage={setPage} setNumLine={setNumLine} results={results} setResults={setResults} />}

                        {page.includes('gmail') && <GmailExercise resp={resp.gmail_msg} page={page} setPage={setPage} setNumLine={setNumLine} results={results} setResults={setResults} />}
                        {page.includes('rapid') && <RapidExercise resp={resp.rapid} page={page} setPage={setPage} setNumLine={setNumLine} results={results} setResults={setResults} />}
                        {page.includes('daily') && <DailyExercise resp={resp.daily_conversation} page={page} setPage={setPage} setNumLine={setNumLine} results={results} setResults={setResults} />}
                        {page.includes('chooses') && <ChoosesExercise resp={resp} page={page} setPage={setPage} setNumLine={setNumLine} results={results} setResults={setResults} />}
                        {page.includes('parsing') && <ParsingExercise resp={resp.sentence_for_parsing} page={page} setPage={setPage} setNumLine={setNumLine} results={results} setResults={setResults} />}
                        {page.includes('full') && <FullExercise resp={resp.full_blank} page={page} setPage={setPage} setNumLine={setNumLine} results={results} setResults={setResults} />}
                        {page === 'results' && <PdfDisplay textContent={respSolve !== null && respSolve} />}
                    </>
                )}
            </Flex>
        </Flex>
    )
}

const Back = ({ page, setPage }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        console.log('clicked')
        if (page === 'cards_view') {
            navigate('/profile');
        }
        else if (page.includes('cards')) {
            setPage('cards_view');
        }
        else if (page.includes('gmail')) {
            setPage('cards_view');
        }
        else if (page.includes('rapid')) {
            setPage('gmail_view');
        }
        else if (page.includes('daily')) {
            setPage('rapid_view');
        }
        else if (page.includes('chooses')) {
            setPage('daily_view');
        }
        else if (page.includes('parsing')) {
            setPage('chooses_view');
        }
        else if (page.includes('full')) {
            setPage('parsing_view');
        }


    }
    return (
        <Box display={{ base: 'none', md: 'block' }} cursor={'pointer'} onClick={handleClick}>
            <Icon icon={'mdi:arrow-right'} width={40} />
        </Box>
    )
}

