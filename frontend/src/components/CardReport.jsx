import React from 'react'
import { Flex, Text, Image, useDisclosure } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { font1 } from '../localVars';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import eye_png from '../assets/images/eye.png'
export default function CardReport({ title, txt, img, bk, mistakes = null }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Flex
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            rounded={'md'}
            width={{ base: '300px', md: '240px' }}
            height={{ base: '200px', md: '160px' }}
            mb={{ base: 6, md: 0 }}
            borderRadius={8}
            flexDir={'column'}
            justifyContent={'space-evenly'}
        >
            <Flex
                width={'90%'}
                alignSelf={'center'}
                justifyContent={'space-evenly'}
                alignItems={'end'}
            >
                {mistakes !== null && (
                    <Image
                        src={eye_png}
                        width={'30px'}
                        alignSelf={'start'}
                        onClick={onOpen}
                        cursor={'pointer'}
                    />
                )}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent mt={{ base: '100px', md: '200px' }} ml={{ base: 2, md: 0 }} mr={{ base: 2, md: '120px' }} maxW={'600px'} pt={4} pb={10} dir='rtl'>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex mt={10} flexDir={'column'}>
                                {mistakes !== null && mistakes.map((item, index) => (
                                    <Flex mt={6} alignItems={'center'}>
                                        <Flex
                                            borderRadius={'full'}
                                            bgColor={'#916205'}
                                            width={'34px'}
                                            height={'34px'}
                                            justifyContent={'center'}
                                            alignItems={'cenetr'}

                                        >
                                            <Text
                                                alignSelf={'center'}
                                                fontFamily={font1}
                                                color={'#fff'}
                                            >{index + 1}</Text>
                                        </Flex>
                                        <Text
                                            fontFamily={font1}
                                            fontSize={18}
                                            mr={2}
                                        >{item}</Text>
                                    </Flex>
                                ))}
                            </Flex>

                        </ModalBody>


                    </ModalContent>
                </Modal>
                <Text
                    width={'50%'}
                    ml={mistakes === null && 10}
                    fontFamily={font1}
                    fontSize={22}
                    mt={4}
                    dir='rtl'
                    textAlign={'center'}
                >{title}</Text>
                <Flex
                    borderRadius={10}
                    p={2}
                    justifyContent={'center'}
                    alignItems={'center'}
                    bgColor={bk}
                    mb={2}




                >
                    {/* <Icon icon={icon} color='#fff' width={34} /> */}
                    <Image src={img} width={'34px'} height={'34px'} />
                </Flex>

            </Flex>
            <Text alignSelf={'center'} fontFamily={font1} fontSize={14} >{txt}</Text>

        </Flex>
    )
}
