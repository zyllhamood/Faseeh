
import { ChakraProvider, Flex, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { MenuProvider } from './components/MenuContext'
import { Routes, Route } from 'react-router-dom';
import { font1 } from './localVars';
import theme from "./theme";
import 'normalize.css';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Lessons from './screens/Lessons';
import Reports from './screens/Reports';
import Lesson from './screens/Lesson';
import Login from './screens/Login';
import Exercises from './screens/Exercises';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { get_info } from './store/authSlice';
import Register from './screens/Register';
import RapidParsingChallenge from './screens/RapidParsingChallange';
import FullBlank from './screens/FullBlank';
import DailyConversation from './screens/DailyConversation';
function App() {
  const dispatch = useDispatch();
  const access_token = Cookies.get('access_token');
  const { isLogged, isAdmin } = useSelector((state) => state.auth);
  useEffect(() => {
    if (access_token !== undefined) {
      dispatch(get_info(access_token));
    }
  }, [access_token])
  return (
    <ChakraProvider theme={theme}>
      <MenuProvider>
        <Flex
          flex={1}
          minH={'100vh'}
          width={'100%'}
          flexDir={'column'}
          alignItems={'center'}


        >
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/lesson/:id/:type" element={<Lesson />} />
            <Route path="/login" element={<Login />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rapid-parsing-challange" element={<RapidParsingChallenge />} />
            <Route path="/full-blank" element={<FullBlank />} />
            <Route path="/daily-conversation" element={<DailyConversation />} />
          </Routes>
        </Flex>
      </MenuProvider>

    </ChakraProvider>
  );
}

export default App;
