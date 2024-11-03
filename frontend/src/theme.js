import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    fonts: {
        heading: "'Inter-Variable', sans-serif",  // For headings
        body: "'Inter-Variable', sans-serif",     // For body text
    },
});

export default theme;