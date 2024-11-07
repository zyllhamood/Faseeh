import React, { useState, useEffect } from 'react'
import { Flex, Image, Text, Button, Box, Grid, Spinner } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { font1 } from '../localVars';
import next_png from '../assets/images/next.png'
import success_png from '../assets/images/success.png'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Loading from './Loading';
import Cookies from 'js-cookie'
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
export default function CradsExercise({ page, setPage, setNumLine }) {

    const [resp, setResp] = useState(null);
    const [options, setOptions] = useState(null);
    const [answers, setAnswers] = useState(null);
    const [finished, setFinished] = useState(false);
    const [chooses, setChooses] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            fetch('http://192.168.8.168:8000/cards/')
                .then((response) => response.json())
                .then((data) => {
                    if (data.resp !== null) {
                        setResp(data.resp);
                        if (data.resp !== null) {
                            const all_options = shuffleArray([...data.resp.options.map(item => item.option)]);
                            const all_answers = shuffleArray([...data.resp.options.map(item => item.parsing)]);
                            setOptions(all_options);
                            setAnswers(all_answers);
                        }
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

    }, [resp]);
    const handleNext = () => {
        if (finished) {
            setPage('cards_finished')
        }
        else {
            setPage('cards_challange')
        }
    }

    useEffect(() => {
        if (page === 'cards_finished') {
            setNumLine(2)
        }
    }, [page, setPage])
    return (
        <>
            <Flex
                alignSelf={'end'}
                mt={16}
                flexDir={'column'}
                dir='rtl'
                width={'80%'}
                mr={10}
                display={page === 'cards_view' ? 'flex' : 'none'}
                alignItems={'center'}
            >
                <Text fontFamily={font1} fontSize={{ base: 22, "2xl": 24, "3xl": 26 }} color={'#000'}>التمرين الأول </Text>

                <Flex flexDir={'column'} mt={16}>
                    <Text fontFamily={font1} fontSize={{ base: 22, "2xl": 24, "3xl": 26 }} pb={4}>إرشادات التمرين:</Text>
                    <TextBox txt={'ستظهر لك مجموعة بطاقات تحتوي على كلمات  اسحب البطاقة لمكانها المناسب'} />
                    <TextBox txt={'ركز على الكلمات وحاول سحب اعراب كل كلمة لمكانها الصحيح'} />
                </Flex>

                <Flex mt={20} alignItems={'center'}  >
                    <Text fontFamily={font1} fontSize={{ base: 24, "2xl": 26, "3xl": 28 }} ml={8}>إنتقل للأسئلة</Text>
                    {resp !== null ? (
                        <Image cursor={'pointer'} onClick={handleNext} src={next_png} width={'60px'} transform="rotate(180deg)" />
                    ) : (
                        <Loading />
                    )}
                </Flex>
            </Flex>

            <Flex
                alignSelf={'end'}
                mt={16}
                flexDir={'column'}
                dir='rtl'
                width={'80%'}
                mr={10}
                display={page === 'cards_challange' ? 'flex' : 'none'}
                alignItems={'center'}
            >
                <Text fontFamily={font1} fontSize={24} textAlign={'center'}>الجملة : {resp !== null && resp.sentence}</Text>

                <Cards page={page} setPage={setPage} data={resp} finished={finished} setFinished={setFinished} chooses={chooses} />
            </Flex>


            {page === 'cards_finished' && <Results page={page} setPage={setPage} resp={resp} chooses={chooses} />}
        </>
    )
}

const Results = ({ page, setPage, resp, chooses }) => {

    const [respSolve, setRespSolve] = useState(null);

    useEffect(() => {
        const fetchData = () => {
            const query = { sentence: resp.sentence, chooses: chooses };

            fetch('http://192.168.8.168:8000/cards-solve/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("access_token")}`
                },
                body: JSON.stringify(query),
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
        if (respSolve === null && page === 'cards_finished') {

            fetchData();
        }
    }, [respSolve])

    return (
        <Flex
            alignSelf={'end'}
            mt={16}
            flexDir={'column'}
            dir='rtl'
            width={'80%'}
            mr={10}

            alignItems={'center'}
        >
            <Image
                src={success_png}
                width={'180px'}
            />
            <Text fontFamily={font1} fontSize={{ base: 24, "2xl": 26, "3xl": 28 }} mt={12}>أحسنت</Text>

            <Text fontFamily={font1} fontSize={{ base: 24, "2xl": 26, "3xl": 28 }} mt={12}> والأن انتقل إلى التمرين الثاني </Text>
            <Image
                src={next_png}
                transform="rotate(180deg)"
                w={'60px'}
                alignSelf={'end'}
                ml={{ base: 0, md: 10 }}
                mt={{ base: 5, md: 0 }}

                cursor={'pointer'}
                onClick={() => setPage('gmail')}
            />
        </Flex>
    )
}

const TextBox = ({ txt }) => {
    return (
        <Flex
            alignItems={{ base: 'start', md: 'center' }}
            mr={{ base: 2, md: -8 }}
            mt={2}
        >
            <Box height={'6px'} width={'6px'} bgColor={'black'} mt={{ base: 3.5, md: 2 }} ml={3}></Box>
            <Text width={'100%'} fontFamily={font1} fontSize={{ base: 22, "2xl": 24, "3xl": 26 }}>{txt}</Text>
        </Flex>
    )
}



// const initialCards = [
//     { id: 1, content: 'مبتدأ' },
//     { id: 2, content: 'فعل' },
//     { id: 3, content: 'مفعول به' },
//     { id: 4, content: 'جار ومجرور' },
// ];

// const initialSentence = {
//     subject: null,
//     verb: null,
//     object: null,
//     preposition: null,
// };

function Cards({ page, setPage, data, finished, setFinished, chooses }) {
    const [cards, setCards] = useState([]);
    const [sentence, setSentence] = useState({});



    useEffect(() => {
        // Fetch data from backend

        if (data) {
            const initialCards = data.options.map((option, index) => ({
                id: index + 1,
                content: option.option,
                droppableId: option.droppableId,
                parsing: option.parsing,
            }));

            // Set initial state for cards
            setCards(initialCards);

            // Create an initial sentence object based on the droppableId values from the data
            const initialSentence = {};
            data.options.forEach(option => {
                initialSentence[option.droppableId] = null;
            });
            setSentence(initialSentence);
        }

    }, [data]);



    const onDragEnd = (result) => {
        const { source, destination } = result;

        // If dropped outside any droppable area, do nothing
        if (!destination) return;

        // Find the dragged card by ID
        const draggedCard = cards.find(card => card.id === parseInt(result.draggableId, 10));

        // Log the content of the dragged card and the destination label directly from droppableId
        chooses.push({ "word": destination.droppableId, "parsing": draggedCard.parsing })

        // Update the sentence structure based on the droppableId
        const updatedSentence = { ...sentence };
        updatedSentence[destination.droppableId] = draggedCard;

        // Remove the card from the available cards list
        const updatedCards = cards.filter(card => card.id !== draggedCard.id);

        setSentence(updatedSentence);
        setCards(updatedCards); // Update the cards to reflect the removed one
        if (updatedCards.length === 0) {
            setPage('cards_finished');
            setFinished(true);
        }
    };

    return (
        <Flex p={5} width={'100%'} flexDir={'column'} alignItems={{ base: 'start', md: 'center' }}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Flex mb={5} flexDir={'column'} width={{ base: '100%', md: '70%' }}>
                    {/* Drop areas */}
                    {data !== null && (
                        <>

                            <Flex justifyContent={'space-between'} >
                                <DropArea id={data['options'][0]['option']} label={data['options'][0]['option']} card={sentence[data['options'][0]['option']]} />
                                <DropArea id={data['options'][1]['option']} label={data['options'][1]['option']} card={sentence[data['options'][1]['option']]} />
                            </Flex>

                            <Flex justify="space-between" mt={8}>
                                <DropArea id={data['options'][2]['option']} label={data['options'][2]['option']} card={sentence[data['options'][2]['option']]} />
                                <DropArea id={data['options'][3]['option']} label={data['options'][3]['option']} card={sentence[data['options'][3]['option']]} />
                            </Flex>
                        </>
                    )}
                </Flex>
                <Text
                    fontFamily={font1}
                    fontSize={{ base: 26, "2xl": 28, "3xl": 30 }}
                    alignSelf={'center'}
                    w={{ base: '100%', md: '80%' }}
                    pb={10}
                    textAlign={{ base: 'center', md: 'start' }}
                >
                    اسحب كل بطاقة لمكانها الصحيح
                </Text>
                <Droppable droppableId="cards">
                    {(provided) => (
                        <Grid
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
                            gap={4}
                            justifyItems="center"
                            width={{ base: '100%', md: 'auto' }}
                            mr={{ base: 0, md: 20 }}
                        >
                            {cards.map((card, index) => (
                                <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                                    {(provided) => (
                                        <Flex
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            bg="#3D249D"
                                            color="white"
                                            m={2}
                                            width={'90px'}
                                            height={'120px'}
                                            rounded="md"
                                            cursor="pointer"
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            padding={1}
                                        >
                                            <Text fontFamily={font1} fontSize={20} textAlign="center">{card.parsing}</Text>
                                        </Flex>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>
        </Flex>
    );
}

function DropArea({ id, label, card }) {
    return (
        <Droppable droppableId={id}>
            {(provided) => (
                <Flex
                    alignItems={'center'}
                    flexDir={{ base: 'column', md: 'row' }}

                >
                    <Text
                        fontFamily={font1}
                        fontSize={{ base: 22, "2xl": 24, "3xl": 26 }}
                        pr={{ base: 0, md: 0 }}
                        width={{ base: '100px', md: '120px' }}
                        textAlign={'center'}
                    >{label}</Text>

                    <Flex
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        w={'90px'}
                        h="120px"
                        borderWidth={'3px'}
                        borderRadius={8}
                        borderColor="#000"
                        bgColor={card ? '#3D249D' : '#fff'}
                        color={'#fff'}
                        m={2}
                        p={1}
                        alignItems="center"
                        justifyContent={'center'}
                    >
                        <Text fontFamily={font1} fontSize={20} textAlign={'center'}>{card ? card.parsing : ''}</Text>
                        {provided.placeholder}
                    </Flex>
                </Flex>
            )}
        </Droppable>
    );
}
