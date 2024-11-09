import React from 'react'
import { Flex, Box, Text, Image } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import check_png from '../assets/images/check.png'
export default function LineExercises({ numLine }) {
    const bk_done = '#23116B';
    const bk_undone = '#D9D9D9';

    const hLineBrowser = '10px';
    const hLineMobile = '10px';

    const wLineMobile = '20px';
    const wLineBrowser = '110px';

    const hLine2xl = '12px';
    const wLine2xl = '200px';

    const hLine3xl = '14px';
    const wLine3xl = '120px';


    const BoxBrowser = '40px';
    const BoxMobile = '26px';

    const Box2xl = '40px';
    const Box3xl = '44px';


    return (
        <Flex alignItems={'center'} dir='rtl' mt={12} alignSelf={'end'} mr={{ base: 8, md: 10, "2xl": 12, "3xl": 14 }} >
            <Box bgColor={bk_done} h={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} w={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} borderRadius={8}></Box>
            <Box bgColor={bk_done} h={{ base: hLineMobile, md: hLineBrowser, "2xl": hLine2xl, "3xl": hLine3xl }} w={{ base: wLineMobile, md: wLineBrowser, "2xl": wLine2xl, "3xl": wLine3xl }}></Box>

            <Box bgColor={numLine > 1 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} w={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} borderRadius={8}></Box>
            <Box bgColor={numLine > 1 ? bk_done : bk_undone} h={{ base: hLineMobile, md: hLineBrowser, "2xl": hLine2xl, "3xl": hLine3xl }} w={{ base: wLineMobile, md: wLineBrowser, "2xl": wLine2xl, "3xl": wLine3xl }}></Box>

            <Box bgColor={numLine > 2 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} w={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} borderRadius={8}></Box>
            <Box bgColor={numLine > 2 ? bk_done : bk_undone} h={{ base: hLineMobile, md: hLineBrowser, "2xl": hLine2xl, "3xl": hLine3xl }} w={{ base: wLineMobile, md: wLineBrowser, "2xl": wLine2xl, "3xl": wLine3xl }}></Box>

            <Box bgColor={numLine > 3 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} w={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} borderRadius={8}></Box>
            <Box bgColor={numLine > 3 ? bk_done : bk_undone} h={{ base: hLineMobile, md: hLineBrowser, "2xl": hLine2xl, "3xl": hLine3xl }} w={{ base: wLineMobile, md: wLineBrowser, "2xl": wLine2xl, "3xl": wLine3xl }}></Box>

            <Box bgColor={numLine > 4 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} w={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} borderRadius={8}></Box>
            <Box bgColor={numLine > 4 ? bk_done : bk_undone} h={{ base: hLineMobile, md: hLineBrowser, "2xl": hLine2xl, "3xl": hLine3xl }} w={{ base: wLineMobile, md: wLineBrowser, "2xl": wLine2xl, "3xl": wLine3xl }}></Box>

            <Box bgColor={numLine > 5 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} w={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} borderRadius={8}></Box>
            <Box bgColor={numLine > 5 ? bk_done : bk_undone} h={{ base: hLineMobile, md: hLineBrowser, "2xl": hLine2xl, "3xl": hLine3xl }} w={{ base: wLineMobile, md: wLineBrowser, "2xl": wLine2xl, "3xl": wLine3xl }}></Box>

            <Box bgColor={numLine > 6 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} w={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} borderRadius={8}></Box>
            <Box bgColor={numLine > 6 ? bk_done : bk_undone} h={{ base: hLineMobile, md: hLineBrowser, "2xl": hLine2xl, "3xl": hLine3xl }} w={{ base: wLineMobile, md: wLineBrowser, "2xl": wLine2xl, "3xl": wLine3xl }}></Box>



            <Flex bgColor={numLine > 6 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} w={{ base: BoxMobile, md: BoxBrowser, "2xl": Box2xl, "3xl": Box3xl }} borderRadius={8} justifyContent={'center'} alignItems={'center'}>
                {numLine > 6 ? <Image src={check_png} width={'30px'} /> : ''}
            </Flex>
        </Flex>
    )
}
