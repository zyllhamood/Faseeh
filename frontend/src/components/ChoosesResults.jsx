import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, Image, useDisclosure } from '@chakra-ui/react';
import { font1 } from '../localVars';
import help from '../assets/images/help.png';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import success from '../assets/images/correct_answer.png';
import startup from '../assets/images/startup.png';
export default function ChoosesResults({ resp }) {
    return (
        <Flex flexDir={'column'}>
            {resp !== null && resp.map((item, index) => (
                <Question
                    question={item.question}
                    options={item.options}
                    index={index}
                    choose_answer={item.choose_answer}
                    correct_answer={item.correct_answer}
                    is_correct={item.is_correct}
                    explain={item.explain}
                />
            ))}
        </Flex>
    )
}

const Question = ({ question, options, index, choose_answer, correct_answer, is_correct, explain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const num_question = index === 0 ? 'السؤال الأول' : index === 1 ? 'السؤال الثاني' : index === 2 ? 'السؤال الثالث' : index === 3 ? 'السؤال الرابع' : '';
    return (
        <Flex width={'100%'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
            <Flex justifyContent={'space-between'} alignItems={'center'} dir='rtl' width={'100%'}>
                <Text
                    width={'66%'}
                    dir='rtl'
                    fontFamily={font1}
                    fontSize={{ base: 20, "2xl": 22, "3xl": 24 }}
                    mt={'120px'}
                    pb={4}
                    mr={10}
                >{num_question}</Text>
                <Flex flexDir={'column'} alignItems={'center'} mt={'66px'} ml={4} cursor={'pointer'} onClick={onOpen}>
                    <Image
                        src={help}
                        width={'50px'}
                        height={'50px'}

                    />

                    <Text
                        fontFamily={font1}
                        textAlign={'center'}
                    >لعرض التوضيح اضغط هنا</Text>
                </Flex>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent width={{ base: '360px', md: 'auto' }}>
                        <ModalHeader></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody dir='rtl'>
                            <Flex justifyContent={'space-between'} alignItems={'center'}>
                                <Text
                                    fontFamily={font1}
                                >{is_correct ? 'أحسنت! إجابتك صحيحة' : 'لا تقلق، الأخطاء جزء من التعلم!'}</Text>
                                <Image
                                    src={is_correct ? success : startup}
                                    width={'60px'}

                                />
                            </Flex>

                            <Flex
                                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                                width={{ base: '310px', md: '400px' }}
                                height={'180px'}
                                borderRadius={20}
                                mt={4}
                                mb={4}
                                p={4}
                                flexDir={'column'}
                            >
                                {!is_correct && <Text fontFamily={font1} mb={4}>الإجابة الصحيحة : {correct_answer}</Text>}
                                <Text fontFamily={font1} fontSize={18} textAlign={'center'}>{explain}</Text>
                            </Flex>
                        </ModalBody>


                    </ModalContent>
                </Modal>
            </Flex>
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
                        is_correct={is_correct}
                        correct_answer={correct_answer}
                        choose_answer={choose_answer}
                    />
                ))}
            </Flex>
        </Flex>
    )
}

const Option = ({ txt, number, is_correct, correct_answer, choose_answer }) => {


    const correct_color = '#8cc98f';
    const wrong_color = '#ff5261';
    const bg = () => {
        if (txt === choose_answer) {
            if (correct_answer === choose_answer) {
                return correct_color;
            }
            else {
                return wrong_color;
            }
        }
        else {
            return '#fff'
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
