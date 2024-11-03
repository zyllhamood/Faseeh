import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Flex } from "@chakra-ui/react";
import WaveSurfer from "wavesurfer.js";
import { Icon } from '@iconify/react'
const RunVoice = ({ src }) => {
    const waveformRef = useRef(null);
    const [waveSurfer, setWaveSurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (waveformRef.current) {
                const ws = WaveSurfer.create({
                    container: waveformRef.current,
                    waveColor: "#A0AEC0",
                    progressColor: "#3182CE",
                    height: 140,
                    barWidth: 2,
                    responsive: true,
                    cursorWidth: 0,
                });
                ws.load(src);

                ws.on("ready", () => setWaveSurfer(ws));

                return () => {
                    ws.destroy();
                };
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [src]);



    const togglePlayPause = () => {
        if (waveSurfer) {
            waveSurfer.playPause();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <Flex
            alignItems="center"
            width={{ base: '340px', md: '340px' }}
            alignSelf={'center'}
            justifyContent={'center'}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
            maxH={'100px'}
            borderRadius={40}
            p={4}

        >
            <Flex
                onClick={togglePlayPause}
                p={2}
                borderRadius={'full'}
                bgColor={'#1f067c'}
                color={'#fff'}
            >{isPlaying ? <Icon icon={'material-symbols:pause'} width={'20px'} /> : <Icon icon={'mdi:play'} width={'20px'} />}</Flex>

            <Box mt={0} alignSelf={'center'} ref={waveformRef} width={'100%'} height={'100%'} ml={3} cursor={'pointer'} />
        </Flex>
    );
};

export default RunVoice;
