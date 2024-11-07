import React, { useState, useEffect } from 'react'
import { Flex, Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar';
import AvatarName from '../components/AvatarName';
import MenuNav from '../components/MenuNav';
import { font1 } from '../localVars';
export const Cards = ({ resp }) => {
    function parseAnswers(wrongChooses, correctAnswers) {
        // Map correct answers for easy lookup
        const correctWords = new Map();
        correctAnswers.forEach(answer => {
            correctWords.set(answer.word, answer.parsing);
        });

        // Process wrong choices
        const results = wrongChooses.map(item => {
            return {
                word: item.word,
                parsing: item.parsing,
                is_correct: correctWords.has(item.word) ? true : false
            };
        });

        // Process correct answers not in wrong choices
        correctAnswers.forEach(answer => {
            if (!results.some(item => item.word === answer.word)) {
                results.push({
                    word: answer.word,
                    parsing: answer.parsing,
                    is_correct: true
                });
            }
        });

        return results;
    }

    // Example usage:

    const [chooses, setChooses] = useState(null);
    useEffect(() => {
        if (resp !== null && chooses === null) {
            const arr = parseAnswers(resp.wrong_chooses, resp.correct_answers);
            setChooses(arr);
        }
    })

    return (
        <Flex
            width={'100%'}
            flexDir={'column'}
            alignItems={'center'}
            mt={10}
        >
            <Text
                fontFamily={font1}
                fontSize={{ base: 20, "3xl": 22 }}

            >{resp !== null && resp.sentence}</Text>

            <Text
                dir='rtl'
                fontFamily={font1}
                fontSize={{ base: 18, "3xl": 20 }}
                alignSelf={'end'}
                mr={{ base: 10, md: 28 }}
                mt={10}
            >إجابتك مع توضيح موضع الخطأ: </Text>

            {chooses !== null && (
                <>
                    <Flex justifyContent={'space-between'} width={{ base: '70%', md: '40%' }} mt={10}>
                        <Card txt={chooses[0].parsing} word={chooses[0].word} color={chooses[0].is_correct ? '#3D249D' : '#C80303'} />
                        <Card txt={chooses[1].parsing} word={chooses[1].word} color={chooses[1].is_correct ? '#3D249D' : '#C80303'} />
                    </Flex>
                    <Flex justifyContent={'space-between'} width={{ base: '70%', md: '40%' }} mt={6}>
                        <Card txt={chooses[2].parsing} word={chooses[2].word} color={chooses[2].is_correct ? '#3D249D' : '#C80303'} />
                        <Card txt={chooses[3].parsing} word={chooses[3].word} color={chooses[3].is_correct ? '#3D249D' : '#C80303'} />
                    </Flex>
                </>
            )}

            <Text
                dir='rtl'
                fontFamily={font1}
                fontSize={{ base: 18, "3xl": 20 }}
                alignSelf={'end'}
                mr={{ base: 10, md: 28 }}
                mt={10}
            >الصحيح</Text>

            {resp !== null && resp.wrong_chooses.map((item) => (
                <Correct word={item.word} parsing={item.correct_parsing} why={item.why} />
            ))}

        </Flex>
    )
}

const Card = ({ txt, word, color = '#3D249D' }) => {
    return (
        <Flex
            flexDir={{ base: 'column', md: 'row' }}
            dir='rtl'
            alignItems={'center'}
        >
            <Text width={'100px'} fontFamily={font1} fontSize={20} textAlign="center" ml={{ base: 0, md: 4 }}>{word}</Text>
            <Flex

                bg={color}
                color="white"
                m={2}
                width={'90px'}
                height={'120px'}
                rounded="md"
                justifyContent={'center'}
                alignItems={'center'}
                padding={1}
            >
                <Text fontFamily={font1} fontSize={20} textAlign="center">{txt}</Text>
            </Flex>
        </Flex>
    )
}

const Correct = ({ word, parsing, why }) => {
    return (
        <Flex
            dir='rtl'
            justifyContent={'space-between'}
            alignItems={'center'}
            flexDir={{ base: 'row', md: 'row' }}
            width={{ base: '90%', md: '60%' }}
            alignSelf={'center'}
            mt={10}
            mb={10}
        >
            <Flex alignItems={'center'} flexDir={{ base: 'column', md: 'row' }} >
                <Text
                    width={'100px'}
                    fontFamily={font1}
                    fontSize={20}
                    textAlign="center"
                    mt={{ base: -4, md: 0 }}
                    mb={{ base: 2, md: 0 }}
                >{word}</Text>
                <Flex

                    bg={'#3D249D'}
                    color="white"

                    width={'90px'}
                    height={'120px'}
                    rounded="md"
                    justifyContent={'center'}
                    alignItems={'center'}
                    padding={1}
                    mr={{ base: 0, md: 10 }}
                >
                    <Text fontFamily={font1} fontSize={20} textAlign="center">{parsing}</Text>
                </Flex>
            </Flex>

            <Flex
                borderRadius={20}
                height={'140px'}
                width={{ base: '240px', md: '400px' }}
                borderColor={'black'}
                borderWidth={'1.5px'}
                p={4}

            >
                <Text
                    fontFamily={font1}

                >
                    {why}
                </Text>
            </Flex>
        </Flex>
    )
}
