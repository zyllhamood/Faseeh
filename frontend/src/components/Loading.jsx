import React from 'react'
import { Box, CircularProgress } from '@chakra-ui/react';
export default function Loading() {
    return (
        <Box
            position="relative"
            display="inline-block"
            width="70px"
            height="70px"
        >
            {/* Spinner with custom gradient */}
            <CircularProgress
                isIndeterminate
                size="56px"
                thickness="8px"
                trackColor="gray.200" // Track color of the spinner
                css={{
                    '& circle': {
                        stroke: 'url(#customGradient)', // Reference the custom gradient here
                    },
                }}
            />

            {/* Define the custom gradient */}
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="customGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#16025c" />
                        <stop offset="12.5%" stopColor="#032c7a" />
                        <stop offset="25%" stopColor="#004e90" />
                        <stop offset="37.5%" stopColor="#2770a0" />
                        <stop offset="50%" stopColor="#5291ae" />
                        <stop offset="62.5%" stopColor="#81b0bd" />
                        <stop offset="75%" stopColor="#b3cfd0" />
                        <stop offset="100%" stopColor="#e7edec" />
                    </linearGradient>
                </defs>
            </svg>
        </Box>
    )
}
