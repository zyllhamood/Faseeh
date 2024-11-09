import React, { useState, useEffect, useRef } from 'react'
import { AspectRatio, Avatar, Box, Flex, Text, Image, Input, Button, useDisclosure, Skeleton, Progress, useToast, CircularProgress } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import { bk2, font1 } from '../localVars';
import arrow_up from '../assets/images/arrow-up.png';
import { useParams, useNavigate } from 'react-router-dom'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import AvatarName from '../components/AvatarName';
import MenuNav from '../components/MenuNav';
import TextToVoice from '../components/TextToVoice';
import LessonExercises from './LessonExercises';
import RunVoice from '../components/RunVoice';
export default function Lesson() {
    const navigate = useNavigate();
    const { type, id } = useParams();
    const [voice, setVoice] = useState(null);

    const [respVideo, setRespVideo] = useState(null);
    const [showExercises, setShowExercises] = useState(false);
    const [showLesson, setShowLesson] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoaded, setIsLoaded] = useState(false);
    const [resp, setResp] = useState(null);
    useEffect(() => {
        const fetchData = () => {
            fetch(`http://172.20.10.5:8000/lesson/${id}/`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.resp !== null) {
                        setResp(data.resp);
                    } else {
                        setTimeout(fetchData, 1000); // Retry after 1 second if resp is null
                    }
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    setTimeout(fetchData, 1000); // Retry in case of an error
                });
        };

        if (resp === null) {
            fetchData(); // Initial fetch call if resp is null
        }
    }, [resp, id])


    useEffect(() => {
        if (voice === null && resp !== null) {
            fetch(`http://172.20.10.5:8000/voice/${id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: resp.text_content })
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then((blob) => {
                    // Create a URL for the blob and store it in state
                    const audioUrl = URL.createObjectURL(blob);
                    setVoice(audioUrl);
                })
                .catch((error) => {
                    console.error('Error fetching audio file:', error);
                });
        }
    }, [voice, resp])

    useState(() => {
        if (respVideo === null) {
            fetch(`http://172.20.10.5:8000/video/${id}/`)
                .then((response) => response.json())
                .then((data) => {
                    setRespVideo(data);
                })
        }
    }, [respVideo])

    const handleRefresh = (value) => {
        navigate(`/lesson/${id}/${value}`)
    }


    const handleNext = () => {
        setShowExercises(true);
        setShowLesson(false);
    }
    return (
        <Flex direction={{ base: 'column', md: "row-reverse" }} width={'100%'} color={'#fff'} >
            <Sidebar page={'Lessons'} />

            <Flex
                flex="1"
                width={{ base: '90%', md: '84%' }}

                alignSelf={{ base: 'center' }}
                flexDir={'column'}
                alignItems={{ base: 'center', md: 'start' }}

                color={'black'}
                pb={10}
                mr={{ base: 0, md: "16%" }}
                overflowY="auto"
            >
                <Flex
                    width={'94%'}
                    alignSelf={'center'}
                    mt={6}
                    justifyContent={'space-between'}
                    color={'black'}
                >
                    <AvatarName />
                    <MenuNav />
                </Flex>

                <Text
                    fontFamily={font1}
                    dir='rtl'
                    mt={20}
                    width={'86%'}
                    fontSize={{ base: 20, "2xl": 22, "3xl": 24 }}
                    display={showLesson ? 'block' : 'none'}
                    pb={10}

                >قم بمشاهدة المقطع ثم أجب على الأسئلة:</Text>
                {/* /////////////////////// */}

                {/* <Flex
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                    width={'240px'}
                    height={'300px'}
                    mb={10}
                    borderRadius={12}
                    alignSelf={'center'}
                    flexDir={'column'}
                    alignItems={'center'}
                >
                    <Text fontFamily={font1} mt={6} fontSize={20}>عناصر الدرس</Text>
                </Flex> */}

                {/* /////////////////////// */}

                <Flex
                    justifyContent={'center'}
                    alignSelf={'center'}
                    mb={5}
                    dir='rtl'
                    display={showLesson ? 'flex' : 'none'}

                >
                    <OptionLesson
                        txt={'مقطع فيديو'}
                        active={type === 'video' ? true : false}
                        onClick={() => handleRefresh('video')}
                        pointerEvents={respVideo !== null && respVideo !== null ? 'auto' : 'none'}
                        opacity={respVideo !== null && respVideo !== null ? 1 : 0.5}
                    />
                    <OptionLesson
                        txt={'محتوى نصي'}
                        active={type === 'text' ? true : false}
                        onClick={() => handleRefresh('text')}
                        pointerEvents={resp === null ? 'none' : 'auto'}
                        opacity={resp === null ? 0.5 : 1}
                    />
                    <OptionLesson
                        txt={'مقطع صوتي'}
                        active={type === 'voice' ? true : false}
                        onClick={() => handleRefresh('voice')}
                        pointerEvents={resp !== null && voice !== null ? 'auto' : 'none'}
                        opacity={resp !== null && voice !== null ? 1 : 0.5}

                    />
                </Flex>

                {/* /////////////////////// */}
                {/* /////////////////////// */}
                {type === 'video' && respVideo !== null ? (
                    <AspectRatio

                        ratio={1}
                        alignSelf='center'
                        mt={{ base: 0, md: 16 }}
                        width={{ base: '340px', md: '540px', "2xl": "580px", "3xl": "620px" }}
                        height={{ base: '220px', md: '320px', "2xl": "360px", "3xl": "400px" }}
                        borderWidth={'10px'}
                        borderColor={'black'}
                        borderRadius={8}
                        display={showLesson ? 'block' : 'none'}

                    >
                        <iframe
                            title='naruto'
                            src={respVideo !== null && `https://www.youtube.com/embed/${respVideo.code_youtube}`}
                            allowFullScreen
                        />
                    </AspectRatio>
                ) : type === 'video' && (
                    <Flex alignSelf={'center'}>
                        <Icon icon={'svg-spinners:bars-scale-fade'} width={'200px'} />
                    </Flex>

                )}
                {type === 'text' && resp !== null ? (
                    <Flex
                        borderWidth={'6px'}
                        borderColor={'black'}
                        borderRadius={8}
                        width={{ base: '340px', md: '540px', "2xl": "580px", "3xl": "620px" }}
                        height={{ base: '220px', md: '320px', "2xl": "360px", "3xl": "400px" }}

                        mt={{ base: 0, md: 16 }}
                        overflowY={'scroll'}
                        alignSelf={'center'}
                        display={showLesson ? 'block' : 'none'}
                        p={4}
                        dir='rtl'

                    >

                        <Text fontSize={{ base: 18, "2xl": 20, "3xl": 22 }} lineHeight={{ base: 8, "2xl": 9, "3xl": 10 }} fontFamily={font1}>{resp !== null && resp.text_content}</Text>
                    </Flex>
                ) : type === 'text' && (
                    <Flex alignSelf={'center'}>
                        <Icon icon={'svg-spinners:bars-scale-fade'} width={'200px'} />
                    </Flex>
                )}

                {type === 'voice' && (
                    <Flex
                        alignSelf={'center'}
                        height={{ base: '220px', md: '320px', "2xl": "360px", "3xl": "400px" }}
                        width={'100%'}
                        justifyContent={'center'}
                        mb={{ base: 0, md: 16 }}
                        display={showLesson ? 'flex' : 'none'}
                    >
                        <RunVoice src={voice} />
                    </Flex>
                    // <TestVoice />
                )}

                <Flex
                    width={{ base: '340px', md: '420px', "2xl": "440px", "3xl": "460px" }}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    alignSelf={'center'}
                    dir='rtl'
                    flexDir={{ base: 'column', md: 'row' }}
                >
                    <Button
                        fontFamily={font1}
                        bgColor={'#22078A'}
                        color={'#fff'}
                        mt={6}
                        width={{ base: '100%', md: '180px', "2xl": "200px", "3xl": "220px" }}
                        height={{ base: '50px', "2xl": "52px", "3xl": "54px" }}
                        fontSize={{ base: 14, "2xl": 16, "3xl": 18 }}
                        fontWeight={'bold'}
                        borderRadius={8}
                        _hover={{ opacity: 7 }}
                        onClick={onOpen}
                        display={showLesson ? 'block' : 'none'}

                    >عرض ملخص الدرس</Button>
                    <Button
                        fontFamily={font1}
                        bgColor={'#22078A'}
                        fontWeight={'bold'}
                        color={'#fff'}
                        mt={6}
                        width={{ base: '100%', md: '180px', "2xl": "200px", "3xl": "220px" }}
                        height={{ base: '50px', "2xl": "52px", "3xl": "54px" }}
                        fontSize={{ base: 14, "2xl": 16, "3xl": 18 }}
                        borderRadius={8}
                        _hover={{ opacity: 7 }}
                        onClick={handleNext}
                        display={showLesson ? 'flex' : 'none'}
                        as="a" href="#exercises"
                    >إنتقل للتمارين التفاعلية</Button>
                </Flex>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalContent
                        mt={{ base: '200px', "2xl": "120px", "3xl": "200px" }}
                        mr={{ base: 0, md: '120px', "2xl": "140px", "3xl": "300px" }}
                        maxW={{ base: '300px', md: '600px' }}
                        pt={4}
                        pb={{ base: '20px', md: '120px' }}
                        dir='rtl'
                    >
                        <ModalCloseButton />
                        <ModalHeader fontFamily={font1} mt={10} fontWeight={'bold'}>{respVideo !== null && respVideo.name}</ModalHeader>
                        <ModalBody>
                            <Text fontFamily={font1} fontSize={{ base: 18, "3xl": 20 }} lineHeight={{ base: 8, "3xl": 9 }} >{resp !== null && resp.summary}</Text>
                        </ModalBody>


                    </ModalContent>
                </Modal>

                <LessonExercises resp={resp} showExercises={showExercises} setShowExercises={setShowExercises} />

            </Flex>
        </Flex>
    )
}

const OptionLesson = ({ txt, active, onClick, pointerEvents, opacity }) => {

    return (
        <Flex
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            p={2}
            ml={1}
            mr={1}
            borderRadius={6}
            bgColor={active ? '#1f067c' : '#ffffff'}
            color={active ? '#fff' : '#000'}
            onClick={onClick}
            cursor={'pointer'}
            pointerEvents={pointerEvents}
            opacity={opacity}
            alignItems={'center'}

        >

            <Text
                fontFamily={font1}
                ml={pointerEvents === 'none' ? 2 : 0}
                fontSize={{ base: 16, "2xl": 18, "3xl": 20 }}
            >{txt}</Text>
            {pointerEvents === 'none' && <Icon icon={'svg-spinners:wind-toy'} width={20} />}
        </Flex >
    )
}