import { Box, Heading, Icon, VStack, Text, Button, ButtonGroup } from '@chakra-ui/react';
import React from 'react';
import { IoPlanet, IoLogoGithub, IoDocumentText } from 'react-icons/io5';
import { SiStarship } from "react-icons/si"
import { useNavigate } from 'react-router-dom';
import { goToDocs, goToGithub } from '../utils';

export default function Home() {
    const navigate = useNavigate()

    const goToDemo = () => {
        navigate("/demo")
    }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      backgroundColor="#ff914d"
    >
      <VStack spacing={4}>
        <Icon as={IoPlanet} boxSize="170px" color="white" />
        <Heading color="white" size="3xl">Scrapeium</Heading>
        <Text color="white" fontSize="lg">A powerful query language for scraping the web</Text>
        <ButtonGroup>
            <Button onClick={goToDemo} leftIcon={<SiStarship/>}>Demo</Button>
            <Button onClick={goToDocs} leftIcon={<IoDocumentText/>}>Docs</Button>
            <Button leftIcon={<IoLogoGithub/>} onClick={goToGithub}>GitHub</Button>
        </ButtonGroup>
      </VStack>
    </Box>
  );
}
