import React from 'react';
import {
  Box,
  Heading,
  Icon,
  VStack,
  Text,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { IoPlanet, IoLogoGithub, IoDocumentText } from 'react-icons/io5';
import { SiStarship } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { goToDocs, goToGithub } from '../../utils';

export default function Home() {
  const navigate = useNavigate();

  const goToDemo = () => {
    navigate('/demo');
  };

  const HomePageIcon = () => (
    <VStack spacing={1}>
        <Icon as={IoPlanet} boxSize={48} color="white" />
        <Heading color="white" size="3xl">
          Scrapeium
        </Heading>
    </VStack>
  )

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      backgroundColor="gray.900"
      // backgroundColor="#ff914d"
    >
      <VStack spacing={6}>
        <HomePageIcon/>
        <Text color="white" fontSize="lg">
          A powerful query language for scraping the web
        </Text>
        <ButtonGroup colorScheme="orange" spacing={6}>
          <Button onClick={goToDemo} leftIcon={<SiStarship />}>
            Demo
          </Button>
          <Button onClick={goToDocs} leftIcon={<IoDocumentText />}>
            Docs
          </Button>
          <Button leftIcon={<IoLogoGithub />} onClick={goToGithub}>
            GitHub
          </Button>
        </ButtonGroup>
      </VStack>
    </Box>
  );
}
