import {
  Flex,
  HStack,
  Icon,
  Heading,
  Spacer,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { IoDocumentText, IoPlanet, IoPlay } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { goToDocs } from '../../../utils';
import { DemoContext, DemoContextValues } from '../DemoContext';
// import { BsPlay } from 'react-icons/bs';

export default function TopBar() {
  const { runQuery } = useContext(DemoContext) as DemoContextValues;
  const navigate = useNavigate();

  const goHome = () => navigate("/");

  //   const selectOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //     setOutputLang(event.target.value as 'json5' | 'yaml');
  //   };

  return (
    <Flex
      padding="1rem"
      alignItems="center"
      gap="2"
      //   backgroundColor="#ff914d"
      backgroundColor="gray.900"
    >
      <HStack onClick={goHome} cursor="pointer">
        <Icon as={IoPlanet} boxSize={10} color="white" />
        <Heading color="white" size="md">
          Scrapeium Demo
        </Heading>
      </HStack>
      <Spacer />
      <HStack>
        {/* <Select size="sm" value={outputLang} bg="whiteAlpha" onChange={selectOnChange} colorScheme="orange">
          <option value="json5">JSON</option>
          <option value="yaml">YAML</option>
        </Select> */}
        <ButtonGroup size="sm" colorScheme="orange">
          <Button leftIcon={<IoPlay />} onClick={runQuery}>
            Run Query
          </Button>
          <Button onClick={goToDocs} leftIcon={<IoDocumentText />}>
            Go to Docs
          </Button>
          {/* <Button size="sm" onClick={reset} leftIcon={<ResetIcon/>}>Reset</Button> */}
        </ButtonGroup>
      </HStack>
    </Flex>
  );
}
