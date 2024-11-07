import React from 'react'
import { Flex, Text, Image, useDisclosure, Button, Grid, GridItem, Box } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { font1 } from '../localVars';
import touch from '../assets/images/touch.png';
import Cookies from 'js-cookie'
import video_png from '../assets/images/video.png'
import text_png from '../assets/images/text.png'
import voice_png from '../assets/images/voice.png'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
export default function Lesson2({ id, color, title, minutes, info }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleClick = (id, type) => {
        fetch('http://192.168.8.168:8000/join-lesson/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
            body: JSON.stringify({
                lesson: id
            }),
        })
            .then((response) => {
                if (response.status === 201 || response.status === 200) {
                    return response.json(); // return the promise
                } else {
                    console.error('Failed to join lesson. Status code:', response.status);
                }
            })
            .then((data) => {
                if (data) {
                    const lesson_id = data.id;

                    window.location.href = `http://192.168.8.168:3000/lesson/${lesson_id}/${type}/`
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    return (
        <Flex
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            borderRadius={8}
            justifyContent={'space-between'}
            mt={5}
            width={{ base: '100%', md: '90%' }}
        >
            <Flex width={'50px'} bgColor={color} height={{ base: '260px', md: '200px' }} borderTopRightRadius={8} borderBottomRightRadius={8}></Flex>
            <Flex width={'70%'} flexDir={'column'}>
                <Text fontSize={{ base: 18, "2xl": 20, "3xl": 22 }} fontFamily={font1} mt={10} mr={8}>{title}</Text>
                <Text
                    fontFamily={font1}
                    mt={{ base: 10, md: 8 }}
                    mr={{ base: 14, md: 8 }}
                    width={{ base: '200px', md: '100%' }}
                    alignSelf={'center'}
                    textAlign={'center'}
                    fontSize={{ base: 16, "2xl": 18, "3xl": 20 }}
                >{info}</Text>
            </Flex>
            {/* <Flex width={'5%'} bgColor={'silver'} >

            </Flex> */}
            <Flex
                width={'20%'}
                flexDir={'column'}
                alignItems={'center'}

            >
                <Flex
                    mt={{ base: 8, md: 10 }}
                    borderRadius={8}
                    ml={{ base: 4, md: 0 }}
                    bgColor={color}
                    height={{ base: '45px', md: '90px' }}
                    width={{ base: '45px', md: '90px' }}
                    justifyContent={'center'}
                    alignItems={'center'}
                    color={'white'}
                >
                    <Text fontSize={{ base: 18, "2xl": 20, "3xl": 22 }} fontFamily={font1}>{minutes}</Text>

                </Flex>
                <Text ml={{ base: 4, md: 0 }} fontFamily={font1} fontSize={14} mt={1}>دقيقة</Text>

                <Flex
                    height={'30px'}
                    width={{ base: '100px', "2xl": "120px", "3xl": "140px" }}
                    ml={{ base: 12, md: '180px' }}

                    cursor={'pointer'}
                    onClick={onOpen}
                    mt={{ base: '100px', md: 0 }}
                >
                    <Text fontFamily={font1} fontSize={{ base: 16, "2xl": 18, "3xl": 20 }}>إبدأ الأن</Text>
                    <Image
                        width={'26px'}
                        height={'26px'}
                        src={touch}
                        mr={2}
                    />
                </Flex>

                <Modal isOpen={isOpen} onClose={onClose} >
                    <ModalOverlay />
                    <ModalContent mt={{ base: '20px', md: '200px' }} mr={{ base: '0px', md: '120px' }} maxW={{ base: '360px', md: '680px', "2xl": "740px", "3xl": "800px" }} pt={8} pb={{ base: 6, md: 16 }}>
                        <ModalHeader textAlign={'center'} fontFamily={font1} fontWeight={'bold'}>اختر طريقة عرض الدرس</ModalHeader>
                        <ModalBody>
                            <Grid
                                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
                                gap={4}
                                justifyContent={{ base: 'center', md: 'space-between' }}
                                justifyItems={{ base: 'center', md: 'start' }}
                                alignItems={'center'}
                                width={'100%'}
                                alignSelf={'center'}
                                dir='rtl'

                                pr={6}
                                pl={2}
                            >
                                <Grid
                                    templateColumns={{ base: '1fr 1fr', md: 'repeat(3, 1fr)' }}
                                    gap={4}
                                    width="100%"
                                    alignSelf="center"
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    dir="rtl"
                                    mt={8}
                                    pr={2}
                                    pl={2}
                                >
                                    <GridItem display="flex" justifyContent="center">
                                        <Choose txt="مقطع فيديو" img={video_png} onClick={() => handleClick(id, 'video')} />
                                    </GridItem>

                                    <GridItem display="flex" justifyContent="center">
                                        <Choose txt="محتوى كتابي (نصي)" img={text_png} onClick={() => handleClick(id, 'text')} />
                                    </GridItem>

                                    <GridItem display="flex" justifyContent="center" colSpan={{ base: 2, md: 1 }}>
                                        <Choose txt="محتوى سماعي (صوتي)" img={voice_png} onClick={() => handleClick(id, 'voice')} />
                                    </GridItem>
                                </Grid>
                            </Grid>


                        </ModalBody>


                    </ModalContent>
                </Modal>
            </Flex>


        </Flex>
    )
}

const Choose = ({ txt, img, onClick }) => {
    return (
        <Flex
            flexDir={'column'}
            width={{ base: '160px', md: '180px', "2xl": "200px", "3xl": "220px" }}
            height={'200px'}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            borderRadius={16}
            alignItems={'center'}




        >
            <Text fontFamily={font1} mt={6} fontSize={{ base: 14, "2xl": 16, "3xl": 18 }}>{txt}</Text>
            <Image
                src={img}
                width={'50px'}
                height={'50px'}
                mt={4}
            />

            <Button
                fontFamily={font1}
                bgColor={'#22078A'}
                color={'#fff'}
                mt={6}
                width={{ base: '120px', "2xl": "140px", "3xl": "160px" }}
                height={{ base: '30px', "2xl": "34px", "3xl": "38px" }}
                borderRadius={8}
                _hover={{ opacity: 7 }}
                fontWeight={'bold'}
                onClick={onClick}
                fontSize={{ base: 16, "2xl": 18, "3xl": 20 }}
            >إبدا الدرس</Button>
        </Flex>
    )
}