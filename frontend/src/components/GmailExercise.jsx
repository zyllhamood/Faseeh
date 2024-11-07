import React, { useState, useEffect, useRef } from 'react'
import { Flex, Text, Box, Image, useDisclosure, Button, Input, Textarea } from '@chakra-ui/react';
import { font1 } from '../localVars';
import gmail_png from '../assets/images/gmail.png'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import next_png from '../assets/images/next.png';
import menu_png from '../assets/images/menu.png'
import menu2_png from '../assets/images/menu2.png'
import gmail2_png from '../assets/images/gmail2.png'
import star from '../assets/images/star.png'
import delete_ong from '../assets/images/delete.png'
import link_png from '../assets/images/link.png'
import play_again from '../assets/images/play-again.png'
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux'
export default function GmailExercise({ page, setPage, setNumLine }) {
    const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
    const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();
    const [resp, setResp] = useState(null);
    const [respSolve, setRespSolve] = useState(null);
    const { full_name } = useSelector((state) => state.auth)
    const [showAnswer, setShowAnswer] = useState(false)
    const messageRef = useRef('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = () => {

            fetch('http://192.168.8.168:8000/gmail/')
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
        const fetchData = () => {


            fetch('http://192.168.8.168:8000/gmail-solve/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                }),
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
        if (respSolve === null && showAnswer) {
            fetchData();
        }
    }, [respSolve, showAnswer])


    const handleOpen2 = () => {
        onClose1();
        onOpen2();
    }
    const handleOpen3 = () => {
        onClose2();
        onOpen3();
    }

    const handleSend = () => {
        setShowAnswer(true)
        const msg = messageRef.current.value;
        setMessage(msg);
        onClose3()
    }
    const handleNext = () => {
        //setPage('cards')
        setNumLine(4)
    }
    return (
        <>
            <Flex alignSelf={'end'} mt={16} flexDir={'column'} dir='rtl' width={'100%'} display={showAnswer ? 'none' : 'flex'}>
                <Text
                    fontFamily={font1}
                    fontSize={{ base: 26, "2xl": 28, "3xl": 30 }}
                    alignSelf={'center'}
                >التدريب الثاني البريد الإكتروني </Text>
                <Flex
                    flexDir={'column'}
                    width={'80%'}
                    alignSelf={'center'}
                    mt={10}
                    dir='rtl'
                >
                    <Text fontFamily={font1} fontSize={{ base: 24, "2xl": 26, "3xl": 28 }}>ستظهر لك رسالة بعد قليل المطلوب منك :</Text>

                    <TextBox txt={'اقرأ الرسالة بعناية: وتأكد من فهم محتواها '} size={22} />
                    <TextBox txt={'حدد الأخطاء النحوية والإعرابية: '} size={22} />
                    <TextBox txt={' صحح الأخطاء وأعد صياغة الرد بشكل صحيح نحويًا.'} size={22} />
                    <TextBox txt={'قم بإعادة  كتابة صيغة الرسالة مع التصحيح: '} size={22} />
                    <TextBox txt={'بعد كتابة التصحيح في  الرد، اضغط على "إرسال" للحصول على التصحيح الفوري.'} size={22} />
                </Flex>
                <Flex
                    alignItems={'center'}
                    mt={8}
                    mr={{ base: 1, md: '-300px' }}
                    justifyContent={'center'}
                >
                    <Text
                        fontFamily={font1}
                        fontSize={{ base: 22, "2xl": 24, "3xl": 26 }}

                        alignSelf={'center'}
                        textAlign={'center'}
                        ml={8}
                    >للبدء اضغط على علامة البريد</Text>
                    <Box position="relative" width="60px" height="60px" mr={2} cursor={'pointer'} onClick={onOpen1}>
                        <Image
                            src={gmail_png}
                            width="60px"
                            height="60px"
                        />
                        <Flex
                            borderRadius={'120px'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            pl={2}
                            pr={2}
                            position="absolute"
                            top="-8px"
                            right="-8px"
                            bg="#ED0202"
                            color="white"
                            fontSize="sm"
                        >
                            <Text
                                fontFamily={font1}
                            >
                                1
                            </Text>
                        </Flex>
                    </Box>

                </Flex>

                <Modal isOpen={isOpen1} onClose={onClose1} >
                    <ModalOverlay />
                    <ModalContent mt={'200px'} ml={{ base: 2, md: 0 }} mr={{ base: 2, md: '120px' }} maxW={'760px'} pt={4} pb={'200px'}>

                        <ModalBody>
                            <Flex
                                flexDir={'column'}
                                width={'100%'}
                                dir='rtl'
                                alignItems={'center'}

                            >
                                <Flex
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    width={'100%'}
                                >
                                    <Flex
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        bgColor={'#325E1D'}
                                        borderRadius={'full'}
                                        width={'48px'}
                                        height={'48px'}
                                    >
                                        <Text fontFamily={font1} color={'#fff'} fontSize={20}>A</Text>
                                    </Flex>
                                    <Flex
                                        alignItems={'center'}

                                    >
                                        <Text
                                            fontSize={20}
                                            ml={4}
                                            fontFamily={font1}>Gmail</Text>
                                        <Image
                                            src={gmail2_png}
                                            w={'30px'}
                                            h={'30px'}
                                            ml={6}
                                        />
                                        <Image
                                            src={menu_png}
                                            w={'20px'}
                                            h={'20px'}
                                        />

                                    </Flex>
                                </Flex>

                                <Flex
                                    alignSelf={'end'}
                                    ml={4}
                                    alignItems={'center'}
                                    mt={4}
                                >
                                    <Image
                                        w={'20px'}
                                        h={'20px'}
                                        src={menu2_png}
                                        ml={2}
                                        mb={2}
                                    />
                                    <Image
                                        w={'20px'}
                                        h={'20px'}
                                        src={play_again}
                                        ml={2}
                                    />
                                    <Icon
                                        icon={'fluent-mdl2:stock-down'}
                                        height={'10px'}
                                        style={{ marginLeft: '8px' }}
                                    />
                                    <Box
                                        borderColor={'black'}
                                        borderWidth={'2px'}
                                        width={'30px'}
                                        height={'30px'}
                                        borderRadius={6}
                                    ></Box>

                                </Flex>

                                <Flex
                                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                                    width={'100%'}
                                    height={'60px'}
                                    borderRadius={12}
                                    mt={4}
                                    justifyContent={'space-between'}
                                    pr={{ base: 2, md: 8 }}
                                    pl={{ base: 2, md: 8 }}
                                    alignItems={'center'}
                                    cursor={'pointer'}
                                    onClick={handleOpen2}
                                    pointerEvents={resp !== null ? 'auto' : 'none'}

                                >
                                    <Text fontFamily={font1} dir='ltr' fontSize={{ base: 14, "3xl": 16 }}>9:18 pm</Text>
                                    <Text fontFamily={font1} fontSize={{ base: 14, "3xl": 16 }}>{resp !== null ? resp.title : <Icon icon={'svg-spinners:3-dots-scale-middle'} width={40} />}</Text>
                                    <Flex justifyContent={'center'} alignItems={'center'}>
                                        <Text fontFamily={font1} fontSize={{ base: 14, "3xl": 16 }}>علام</Text>
                                        <Image
                                            w={'30px'}
                                            h={'30px'}
                                            src={star}
                                            ml={{ base: 0, md: 2 }}
                                            mr={{ base: 2, md: 4 }}
                                            opacity={0.6}
                                        />
                                        <Box
                                            borderColor={'black'}
                                            borderWidth={'2px'}
                                            width={'30px'}
                                            height={'30px'}
                                            borderRadius={6}
                                            mr={{ base: 2, md: 4 }}
                                            opacity={0.6}
                                        ></Box>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </ModalBody>


                    </ModalContent>
                </Modal>

                <Modal isOpen={isOpen2} onClose={onClose2} >
                    <ModalOverlay />
                    <ModalContent ml={{ base: 2, md: 0 }} mr={{ base: 2, md: '120px' }} maxW={{ base: '600px', "2xl": "700px", "3xl": "800px" }} pt={4} pb={{ base: 10, md: '120px' }}>

                        <ModalBody>
                            <Flex
                                flexDir={'column'}
                                dir='rtl'
                                width={'100%'}

                            >
                                <Flex alignSelf={'end'} alignItems={'center'}>
                                    <Text fontFamily={font1} mt={4} ml={4} fontSize={{ base: 15, "3xl": 18 }}>علام</Text>
                                    <Flex
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        bgColor={'#3D1D5E'}
                                        borderRadius={'full'}
                                        width={'48px'}
                                        height={'48px'}
                                        mt={4}
                                        ml={6}
                                    >
                                        <Text fontFamily={font1} color={'#fff'} fontSize={20}>A</Text>
                                    </Flex>
                                </Flex>

                                {/* <Text fontFamily={font1} fontSize={15} mr={4}>السلام عليكم ورحمة الله وبركاته وبعد</Text>
                            <Text fontFamily={font1} fontSize={15} mt={8} mr={2}>السؤال هو فاعل لو دخلت عليه الجملة ثم أصبح مثنى ماذا يكون؟</Text> */}

                                <SimpleText txt={`مرحباً ${full_name} `} />
                                <SimpleText txt={resp !== null && resp.message} />
                                {/* <SimpleText txt={'كما أحتاج منك إضافة بعض التفاصيل عن الميزانية و اداء الفريق، لأننا نحتاج لهذه المعلومات في الاجتماع القادم.'} />
                                <SimpleText txt={'شكرًا لتعاونك.'} />
                                <SimpleText txt={'تحياتي،'} /> */}
                                {/* <SimpleText txt={'------------------------------------'} />
                                <SimpleText txt={resp !== null && resp.correct_errors} /> */}

                                <Button
                                    bgColor={'#19033C'}
                                    width={'220px'}
                                    fontFamily={font1}
                                    color={'#fff'}
                                    borderRadius={12}
                                    pl={'40px'}
                                    alignSelf={'center'}
                                    mt={'54px'}
                                    _hover={{ opacity: 0.7 }}
                                    leftIcon={<Icon style={{ marginLeft: 10 }} icon={'lets-icons:back'} width={'20px'} />}
                                    onClick={handleOpen3}
                                    fontWeight={'bold'}
                                    fontSize={{ base: 16, "3xl": 18 }}
                                >قم بالتصحيح والرد</Button>
                            </Flex>
                        </ModalBody>


                    </ModalContent>
                </Modal>

                <Modal isOpen={isOpen3} onClose={onClose3} >
                    <ModalOverlay />
                    <ModalContent mt={'200px'} ml={{ base: 2, md: 0 }} mr={{ base: 2, md: '120px' }} maxW={{ base: '600px', "2xl": "640px", "3xl": "680px" }} pt={4} pb={4}>

                        <ModalBody p={2}>
                            <Flex
                                flexDir={'column'}
                                dir='rtl'
                                width={'100%'}

                            >
                                <Textarea
                                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                                    height={'220px'}
                                    placeholder='قم بكتابة الأخطاء مع إعادة كتابة الرسالة بشكل صحيح'
                                    fontFamily={font1}
                                    borderRadius={12}
                                    pt={8}
                                    pr={8}
                                    textAlign={'start'}
                                    resize="none"
                                    position="relative"
                                    zIndex={1}
                                    ref={messageRef}
                                    fontSize={{ base: 16, "2xl": 18, "3xl": 20 }}
                                />
                                <Flex
                                    borderRadius={12}
                                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                                    width={'97%'}
                                    height={'70px'}
                                    mt={'150px'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    position={'absolute'}
                                    zIndex={2}
                                >
                                    <Image
                                        src={delete_ong}
                                        width={'18px'}
                                        height={'18px'}
                                        mr={'28px'}
                                        mt={'10px'}
                                    />

                                    <Flex alignItems={'center'} justifyContent={'center'}>
                                        <Image
                                            src={link_png}
                                            width={'18px'}
                                            height={'18px'}
                                            mr={'28px'}
                                            mt={'10px'}
                                        />

                                        <Flex
                                            bgColor={'#071486'}
                                            width={'140px'}
                                            height={'50px'}
                                            borderRadius={16}
                                            ml={4}
                                            mr={7}
                                            cursor={'pointer'}
                                            _hover={{ opacity: 0.7 }}
                                            onClick={handleSend}

                                        >
                                            <Icon
                                                icon={'fluent-mdl2:stock-down'}
                                                height={'18px'}
                                                style={{ marginRight: '12px', color: '#fff', marginTop: '12px' }}
                                            />
                                            <Box mr={2} h={'100%'} bgColor={'black'} width={'2px'}></Box>
                                            <Text
                                                fontFamily={font1}
                                                color={'#fff'}
                                                alignSelf={'center'}
                                                mr={'28px'}
                                                fontSize={{ base: 14, "2xl": 16, "3xl": 18 }}
                                            >إرسال</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </ModalBody>


                    </ModalContent>
                </Modal>
            </Flex >
            <Flex display={showAnswer ? 'flex' : 'none'} alignSelf={'end'} mt={20} flexDir={'column'} dir='rtl' width={'100%'}>
                <Text fontFamily={font1} fontSize={{ base: 22, "2xl": 24, "3xl": 26 }} mr={8}>موضع الخطأ مع التصحيح</Text>
                <Flex
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                    width={'96%'}
                    alignSelf={'center'}
                    height={'500px'}
                    borderRadius={8}
                    mt={10}
                    flexDir={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <TextContext wrong={'أن استفسر'} correct={'أن أستفسر'} why={'لأنها همزة قطع'} num={1} />
                    <TextContext wrong={'من انهائه'} correct={'من إنهائه'} why={'لأنها همزة قطع'} num={2} />
                    <TextContext wrong={'جاهز'} correct={'جاهزًا'} why={'خبر كان منصوب'} num={3} />
                    <TextContext wrong={'و اداء'} correct={'وأداء'} why={'إزالة المسافة بعد الواو'} num={4} />
                    <TextContext wrong={'نحتاج لهذه المعلومات'} correct={'إلى'} why={'الفعل "نحتاج" يتطلب حرف الجر "إلى"'} num={5} />
                </Flex>

                <Text fontFamily={font1} fontSize={{ base: 22, "2xl": 24, "3xl": 26 }} mr={16} mt={20}>التوضيح</Text>
                <Flex
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
                    width={{ base: '96%', md: '70%' }}
                    alignSelf={'center'}
                    height={{ base: '340px', md: '300px' }}
                    borderRadius={16}
                    p={{ base: 2, md: 0 }}
                    mt={10}
                    flexDir={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <TextBox txt={'همزة القطع: هي همزة تكتب في بداية الكلمة، وتؤثر على النطق.'} size={24} />
                    <TextBox txt={'نصب الخبر: عند استخدام "كان"، يجب أن يكون الخبر منصوبًا.'} size={24} />
                    <TextBox txt={'حروف الجر: يجب استخدام حروف الجر الصحيحة لتوضيح المعاني في الجمل.'} size={24} />
                </Flex>

                <Flex
                    justifyContent={'center'}
                    alignItems={'center'}
                    dir='rtl'
                    mt={10}
                    pb={10}
                    cursor={'pointer'}
                    onClick={handleNext}
                >
                    <Text fontFamily={font1} fontSize={{ base: 26, "2xl": 28, "3xl": 30 }} ml={10}>
                        التمرين التالي
                    </Text>
                    <Image src={next_png} width={'60px'} transform="rotate(180deg)" />
                </Flex>
            </Flex>
        </>
    )
}


const TextBox = ({ txt, size }) => {
    return (
        <Flex
            alignItems={{ base: 'start', md: 'center' }}
            mr={{ base: 2, md: -8 }}
            mt={2}


        >
            <Box height={'6px'} width={'6px'} bgColor={'black'} mt={{ base: 3.5, md: 2 }} ml={3}></Box>
            <Text dir='rtl' width={{ base: '100%', md: '100%' }} fontFamily={font1} fontSize={{ base: size, "2xl": size + 2, "3xl": size + 4 }} textAlign={'start'}>{txt}</Text>
        </Flex>
    )
}

const SimpleText = ({ txt }) => {
    return (
        <Text
            fontFamily={font1}
            fontSize={{ base: 15, "3xl": 18 }}
            lineHeight={1.8}

        >
            {txt}
        </Text>
    )
}

const TextContext = ({ wrong, correct, why, num }) => {
    return (
        <Text
            fontFamily={font1}
            fontSize={{ base: 22, "2xl": 24, "3xl": 26 }}
            dir='rtl'
            mt={3}
            textAlign={{ base: 'center', md: 'start' }}
        >
            <Box as='spin' color={'#AE0404'}>{num}. "{wrong}"</Box>:الصحيح "<Box as='spin' color={'#1BC508'}>{correct}</Box>" ({why}).
        </Text>
    )
}

