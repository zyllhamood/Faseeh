import React from 'react'
import { Button, Flex, Text, Box } from '@chakra-ui/react';
import { bk2, font1, font2, fr1, fr2 } from '../localVars';
import { useNavigate } from 'react-router-dom';
export default function Home() {
    const navigate = useNavigate();
    return (
        <Flex
            width={'100%'}
            flexDir={'column'}
            alignItems={'center'}
        >
            <Flex
                justifyContent={'space-between'}
                width={'90%'}
                alignItems={'center'}
            >
                <Flex >
                    <Button

                        fontSize={18}
                        width={'160px'}
                        padding={6}
                        fontFamily={font1}
                        bgColor={bk2}
                        color={'white'}
                        fontWeight={'bold'}
                        _hover={{ opacity: 0.7 }}
                        onClick={() => navigate('/login')}
                    >تسجيل الدخول</Button>
                </Flex>
                <Flex display={{ base: 'none', md: 'flex' }} width={'600px'} justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontFamily={font1} fontSize={26} fontWeight={'bold'} fontStyle={'normal'}>الدعم</Text>
                    <Text fontFamily={font1} fontSize={26} fontWeight={'bold'}>المسار التعليمي</Text>

                    <Flex flexDir={'column'} alignItems={'center'}>
                        <Text fontFamily={font1} fontSize={26} fontWeight={'bold'}>تعرف علينا</Text>
                        <Box height={'4px'} borderRadius={12} bgColor={'#1F0F5D'} w={'120px'}></Box>
                    </Flex>
                    <Text fontFamily={font1} fontSize={26} fontWeight={'bold'}>الرئيسية</Text>




                </Flex>
                <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Text fontFamily={font2} fontSize={40} color={fr1} mt={8} fontWeight={'bold'}>فصيح</Text>
                    <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_9_2)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M39.9995 39.9995V52.4995C39.9995 53.88 41.1188 54.9995 42.4995 54.9995H54.9995C56.38 54.9995 57.4995 53.88 57.4995 52.4995V39.9995C57.4995 38.6188 56.38 37.4995 54.9995 37.4995H42.4995C41.1188 37.4995 39.9995 38.6188 39.9995 39.9995ZM3.12451 49.9995V62.4995C3.12451 63.88 4.2438 64.9995 5.62451 64.9995H18.1245C19.5052 64.9995 20.6245 63.88 20.6245 62.4995V49.9995C20.6245 48.6188 19.5052 47.4995 18.1245 47.4995H5.62451C4.2438 47.4995 3.12451 48.6188 3.12451 49.9995Z" fill="white" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M51.875 1.87485C48.7684 1.87485 46.25 4.39325 46.25 7.49985V19.9998C46.25 23.0903 48.7423 25.5986 51.8265 25.6246L49.1342 34.3748H42.5C41.5737 34.3748 40.6997 34.5987 39.9291 34.9954L33.125 29.4283V17.4998C33.125 14.3932 30.6066 11.8748 27.5 11.8748H15C11.8934 11.8748 9.375 14.3932 9.375 17.4998V29.9998C9.375 32.8826 11.5436 35.2589 14.3384 35.5863L11.6342 44.3748H5.625C2.5184 44.3748 0 46.8932 0 49.9998V62.4998C0 65.6063 2.5184 68.1248 5.625 68.1248H18.125C21.2316 68.1248 23.75 65.6063 23.75 62.4998V49.9998C23.75 46.9093 21.2577 44.401 18.1733 44.375L20.8657 35.6248H27.5C28.4261 35.6248 29.3 35.401 30.0704 35.0045L36.875 40.5719V52.4998C36.875 55.6063 39.3934 58.1248 42.5 58.1248H55C58.1065 58.1248 60.625 55.6063 60.625 52.4998V39.9998C60.625 37.117 58.4565 34.7407 55.6615 34.4133L58.3655 25.6248H64.375C67.4815 25.6248 70 23.1064 70 19.9998V7.49985C70 4.39325 67.4815 1.87485 64.375 1.87485H51.875ZM51.3715 40.6248C51.4195 40.6259 51.4675 40.6259 51.515 40.6248H54.375V51.8748H43.125V40.6248H51.3715ZM13.8716 50.6248C13.9195 50.6258 13.9674 50.6258 14.015 50.6248H17.5V61.8748H6.25V50.6248H13.8716Z" fill="#150E33" />
                        </g>
                        <defs>
                            <clipPath id="clip0_9_2">
                                <rect width="70" height="70" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </Flex>



            </Flex>
            <Flex flexDir={'column'} dir='rtl' width={'90%'}>
                <Text
                    fontWeight={'bold'}
                    fontFamily={'Cairo'}
                    fontSize={34}
                    mt={{ base: '40px', md: '100px' }}
                    textAlign={'center'}
                >
                    تعلم الإعراب <span style={{ color: fr1 }}>بسهولة</span>
                </Text>
                <Text
                    fontWeight={'bold'}
                    fontFamily={'Cairo'}
                    fontSize={34}
                    textAlign={'center'}
                >
                    وبأسلوب يناسب <span style={{ color: fr1 }}>الجميع!</span>
                </Text>
            </Flex>

            <Text
                width={{ base: '78%', md: '60%' }}
                alignSelf={'center'}
                fontFamily={font2}
                fontSize={28}
                textAlign={'center'}
                color={fr2}
                mt={10}
                fontWeight={'bold'}
                dir='rtl'
            >
                منصتنا التفاعلية تعرضك لمواقف واقعية وتوفر لك تصحيحًا فوريًا، لتتعلم الإعراب بسرعة وببساطة. <Box as='spin' color={'#1A0F91'}>انضم الآن</Box> واكتشف كيف يمكن للإعراب أن يكون ممتعًا وفعالًا!"
            </Text>

            <Button
                mt={10}
                fontSize={22}
                width={'300px'}
                padding={6}
                fontFamily={font1}
                bgColor={bk2}
                color={'white'}
                _hover={{ opacity: 0.7 }}
                fontWeight={'bold'}
                mb={10}
                onClick={() => navigate('/register')}
            >إبدا الأن</Button>

        </Flex >
    )
}
