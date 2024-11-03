import React, { useState, useEffect, useRef } from "react";
import { Button, Progress, Box, Text, Select, useToast } from "@chakra-ui/react";

const TextToVoice = ({ text }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [progress, setProgress] = useState(0);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    const utteranceRef = useRef(null);
    const synth = window.speechSynthesis;

    // Load voices and filter for Arabic voices
    const loadVoices = () => {
        const allVoices = synth.getVoices();
        const arabicVoices = allVoices.filter(voice => voice.lang.startsWith('ar'));
        setVoices(arabicVoices);
        if (arabicVoices.length > 0) {
            setSelectedVoice(arabicVoices[0]); // Set default to first Arabic voice if available
        }
    };

    useEffect(() => {
        // Load voices initially
        loadVoices();

        // Add event listener for voice changes
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
    }, []);

    // Initialize the utterance with selected text and voice
    useEffect(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        if (selectedVoice) utterance.voice = selectedVoice; // Set chosen voice
        utteranceRef.current = utterance;

        utterance.onboundary = (event) => {
            const percentage = calculateProgress(event.charIndex, utterance.text.length);
            setProgress(percentage);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setProgress(100);
        };
    }, [text, selectedVoice]);

    // Calculate progress percentage
    const calculateProgress = (charIndex, textLength) => {
        return Math.min((charIndex / textLength) * 100, 100);
    };

    // Handle button click for speech
    const handleButtonClick = () => {
        if (isSpeaking) {
            stopSpeech();
        } else {
            startSpeech();
        }
        setIsSpeaking(!isSpeaking);
    };

    // Start speech
    const startSpeech = () => {
        if (!synth.speaking && utteranceRef.current) {
            setProgress(0);
            synth.speak(utteranceRef.current);
        }
    };

    // Stop speech
    const stopSpeech = () => {
        if (synth.speaking) {
            synth.cancel();
            setProgress(0);
        }
    };

    return (
        <Box p={5} borderWidth="1px" borderRadius="lg" textAlign="center" alignSelf={'center'}>
            <Select
                placeholder="Select Arabic Voice"
                onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
                mb={3}
            >
                {voices.length > 0 ? (
                    voices.map((voice, index) => (
                        <option key={index} value={voice.name}>{voice.name}</option>
                    ))
                ) : (
                    <option disabled>No Arabic voices available</option>
                )}
            </Select>

            <Button colorScheme="blue" onClick={handleButtonClick} mb={3}>
                {isSpeaking ? "Stop Speech" : "Start Speech"}
            </Button>

            <Box width="300px">
                <Progress value={progress} size="lg" colorScheme="green" borderRadius="md" />
            </Box>

            <Text fontSize="lg" fontWeight="bold">
                {progress.toFixed(0)}% Complete
            </Text>
        </Box>
    );
};

export default TextToVoice;
