import React, { useState, useEffect } from 'react'
import { Flex, Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar';
import AvatarName from '../components/AvatarName';
import MenuNav from '../components/MenuNav';
import { font1 } from '../localVars';
import { Cards } from '../components/CardsResults';
import TrainingResults from '../components/TrainingResults';
import ChoosesResults from '../components/ChoosesResults';
import RapidResults from '../components/RapidResults';
import FullResults from '../components/FullResults';
export default function Results() {
    const { t, id } = useParams();
    const [resp, setResp] = useState(null);
    useEffect(() => {
        if (resp === null) {
            fetch(`http://172.20.10.5:8000/summary/${id}`)
                .then((response) => response.json())
                .then((data) => setResp(data))
        }
    }, [resp])
    return (
        <Flex
            direction={{ base: 'column', md: "row-reverse" }}
            minH="100vh"
            width="100%"

        >

            <Sidebar page={'Summary'} />
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
                    {/* <Back page={page} setPage={setPage} /> */}
                </Flex>

                {t === 'cards' && <Cards resp={resp} />}
                {t === 'chooses' && <ChoosesResults resp={resp} />}
                {t === 'rapid' && <RapidResults resp={resp} />}
                {t === 'full' && <FullResults resp={resp} />}
            </Flex>
        </Flex>
    )
}

