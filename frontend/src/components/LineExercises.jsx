import React from 'react'
import { Flex, Box, Text, Image } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import check_png from '../assets/images/check.png'
export default function LineExercises({ numLine }) {
    const bk_done = '#23116B';
    const bk_undone = '#D9D9D9';

    const hLineBrowser = '10px';
    const hLineMobile = '10px';

    const wLineMobile = '50px';
    const wLineBrowser = '180px';



    const BoxBrowser = '40px';
    const BoxMobile = '26px';
    console.log('numLine')
    console.log(numLine)
    return (
        <Flex alignItems={'center'} dir='rtl' mt={12} alignSelf={'end'} mr={{ base: 8, md: 10 }} >
            <Box bgColor={bk_done} h={{ base: BoxMobile, md: BoxBrowser }} w={{ base: BoxMobile, md: BoxBrowser }} borderRadius={8}></Box>
            <Box bgColor={bk_done} h={{ base: hLineMobile, md: hLineBrowser }} w={{ base: wLineMobile, md: wLineBrowser }}></Box>

            <Box bgColor={numLine > 1 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser }} w={{ base: BoxMobile, md: BoxBrowser }} borderRadius={8}></Box>
            <Box bgColor={numLine > 1 ? bk_done : bk_undone} h={{ base: hLineMobile, md: hLineBrowser }} w={{ base: wLineMobile, md: wLineBrowser }}></Box>

            <Box bgColor={numLine > 2 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser }} w={{ base: BoxMobile, md: BoxBrowser }} borderRadius={8}></Box>
            <Box bgColor={numLine > 2 ? bk_done : bk_undone} h={{ base: hLineMobile, md: hLineBrowser }} w={{ base: wLineMobile, md: wLineBrowser }}></Box>

            <Box bgColor={numLine > 3 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser }} w={{ base: BoxMobile, md: BoxBrowser }} borderRadius={8}></Box>
            <Box bgColor={numLine > 3 ? bk_done : bk_undone} h={{ base: hLineMobile, md: hLineBrowser }} w={{ base: wLineMobile, md: wLineBrowser }}></Box>
            <Flex bgColor={numLine > 3 ? bk_done : bk_undone} h={{ base: BoxMobile, md: BoxBrowser }} w={{ base: BoxMobile, md: BoxBrowser }} borderRadius={8} justifyContent={'center'} alignItems={'center'}>
                {numLine > 3 ? <Image src={check_png} width={'30px'} /> : ''}
            </Flex>
        </Flex>
    )
}
