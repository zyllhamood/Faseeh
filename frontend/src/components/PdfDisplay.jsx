import React from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import jsPDF from "jspdf";

const PdfDisplay = ({ textContent }) => {


    const generatePdf = () => {
        const doc = new jsPDF();
        doc.text(textContent, 10, 10, { align: "right" });
        doc.save("lesson-summary.pdf");
    };

    return (
        <VStack spacing={4} align="stretch" mt={10}>
            <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
                bg="gray.50"
                textAlign="right"
            >
                <Text whiteSpace="pre-wrap" fontSize="md">
                    {textContent}
                </Text>
            </Box>
            <Button colorScheme="blue" onClick={generatePdf}>
                Download as PDF
            </Button>
        </VStack>
    );
};

export default PdfDisplay;
