import React, { useState } from 'react'
import { Flex, Text, Button, Box } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import Sidebar from '../components/Sidebar';
import AvatarName from '../components/AvatarName';
import { font1 } from '../localVars';
import GmailExercise from '../components/GmailExercise';
import CradsExercise from '../components/CradsExercise';
import LineExercises from '../components/LineExercises';
import MenuNav from '../components/MenuNav';
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
export default function Exercises() {
    const navigate = useNavigate()
    const [page, setPage] = useState('');
    const [numLine, setNumLine] = useState(1);
    useEffect(() => {
        if (page === '') {
            setPage('cards_view')

        }
    }, [page])
    console.log(page)
    return (
        <Flex
            direction={{ base: 'column', md: "row-reverse" }}
            minH="100vh"
            width="100%"

        >
            <Sidebar page={'Exercises'} />

            <Flex
                flex="1"
                width={{ base: '100%', md: '84%' }}
                flexDir="column"
                alignItems="center"
                mr="16%"
                overflowY="auto"
                pb={10}
            >
                <Flex
                    width={'90%'}
                    alignSelf={'center'}
                    mt={6}
                    justifyContent={'space-between'}
                    color={'black'}
                >
                    <AvatarName />
                    <MenuNav />
                    <Back page={page} setPage={setPage} />
                </Flex>

                <Text
                    fontFamily={font1}
                    fontSize={{ base: 22, "2xl": 24, "3xl": 26 }}
                    color={'#000'}
                    mt={20}
                >المسار التدريبي</Text>

                <LineExercises numLine={numLine} />

                {page.includes('cards') && <CradsExercise page={page} setPage={setPage} setNumLine={setNumLine} />}
                {page === 'gmail' && <GmailExercise page={page} setPage={setPage} setNumLine={setNumLine} />}

            </Flex>
        </Flex>
    )
}

const Back = ({ page, setPage }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (page === 'cards_view') {
            navigate('/profile');
        }
        else if (page === 'cards_challange') {
            setPage('cards_view')
        }
        else if (page === 'cards_finished') {
            setPage('cards_view')
        }
        else if (page === 'gmail') {
            setPage('cards_view')
        }

    }
    return (
        <Box display={{ base: 'none', md: 'block' }} cursor={'pointer'} onClick={handleClick}>
            <Icon icon={'mdi:arrow-right'} width={40} />
        </Box>
    )
}