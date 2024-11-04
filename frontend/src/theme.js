import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    // fonts: {
    //     heading: "'Inter-Variable', sans-serif",  // For headings
    //     body: "'Inter-Variable', sans-serif",     // For body text
    // },
    breakpoints: {
        sm: "30em",
        md: "48em",
        lg: "62em",
        xl: "80em",
        "2xl": "96em",
        "3xl": "120em",
    },
});

export default theme;