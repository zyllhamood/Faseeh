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
export default function FullExercise({ resp, id, page, setPage, setNumLine, results, setResults }) {

    const [answer, setAnswer] = useState(null);

    return (
        <Flex alignSelf={'end'} flexDir={'column'} dir='rtl' width={'100%'}>

            {page === 'full_view' ? <View setPage={setPage} resp={resp} /> :
                page === 'full_challange' ? <Challange page={page} setPage={setPage} resp={resp} setAnswer={setAnswer} results={results} setResults={setResults} setNumLine={setNumLine} /> : ''
            }

        </Flex>
    )
}

const View = ({ setPage, resp }) => {
    return (
        <Flex alignSelf={'end'} flexDir={'column'} dir='rtl' width={'100%'}>


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
                onClick={() => setPage('full_challange')}
                isLoading={resp === null ? true : false}
            >
                البدء
            </Button>
        </Flex>
    )
}

const Challange = ({ page, setPage, resp, results, setResults, setNumLine }) => {
    const [wrongAnswers, setWrongAnswers] = useState([]);
    return (
        <Flex alignSelf={'end'} flexDir={'column'} dir='rtl' width={'100%'}>


            <Text
                fontFamily={font1}
                fontSize={24}
                alignSelf={'center'}
                mt={'80px'}
            >تمرين إملأ الفراغ</Text>
            <Question setPage={setPage} resp={resp} wrongAnswers={wrongAnswers} results={results} setResults={setResults} setNumLine={setNumLine} />

        </Flex>
    )
}

const Question = ({ setPage, resp, wrongAnswers, results, setResults, setNumLine }) => {
    const [num, setNum] = useState(0)



    const handleClick = (choose, item) => {
        if (choose !== item.correct) {
            wrongAnswers.push({ question: item.question, choose: choose, correct_answer: item.correct })
        }
        if (num === 3) {
            const query = { "wrongAnswers": wrongAnswers }
            setResults({ ...results, full_blank: query })
            setNumLine(7);
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
                    // boxShadow="0px 3.51px 20.21px 0px #1B0378"
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
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

