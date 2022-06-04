import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Spacer,
  HStack,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Evaluator, Parser, ResultType } from '@scrapeium/lang';

import { IoPlanet } from 'react-icons/io5';
import { DemoContext } from '../components/DemoContext';
import QueryEditor from '../components/QueryEditor';
import HtmlEditor from '../components/HtmlEditor';
import YAML from 'yaml';
import ResultVeiwer from '../components/ResultVeiwer';
import { goToDocs } from '../utils';

export default function Demo() {
  const [outputLang, setOutputLang] = useState<'json5' | 'yaml'>('json5');
  const [output, setOutput] = useState('');
  const [query, setQuery] = useState('"#age" > read :inner_text');
  const [html, setHtml] = useState('<div id="age">10</div>');

  const reset = () => {
    setQuery('');
    setHtml('');
    setOutput('');
  };

  const runQuery = () => {
    console.log('running query');
    try {
      // TODO: figure out best way to do this so object are only made once
      const parser = new Parser(query);
      const ast = parser.parseQuery();
      // parser the html and get its document element
      const htmlDocument = new DOMParser().parseFromString(html, 'text/html');
      const evaluator = new Evaluator(ast);
      const result = evaluator.eval(htmlDocument);
      setOutput(translateResult(result, outputLang));
      // use table
    } catch (error: any) {
      const errorOutput = JSON.stringify({ error: error.message }, null, 2);
      // make sure it is json so it can be viewed correctly
      setOutputLang('json5');
      setOutput(errorOutput);
    }
  };

  const translateResult = (result: ResultType, lang: 'json5' | 'yaml') => {
    switch (lang) {
      case 'json5':
        return JSON.stringify(result, null, 2);
      case 'yaml': {
        const document = new YAML.Document(result);
        return document.toString({ indent: 2 });
      }
    }
  };

  const selectOnChange = (event: any) => {
    setOutputLang(event.target.value as 'json5' | 'yaml');
  };
  // for some reason sometimes the editors can be slow... try monaco?
  return (
    <DemoContext.Provider value={{ query, setQuery, html, setHtml }}>
      <Box height="100%" display="flex" flexDirection="column">
        <Flex
          minWidth="max-content"
          padding="1rem"
          alignItems="center"
          gap="2"
          backgroundColor="#ff914d"
        >
          <HStack>
            <Icon as={IoPlanet} boxSize={10} color="white" />
            <Heading color="white">Scrapeium Demo</Heading>
          </HStack>
          <Spacer />
          <HStack>
            <Select
              value={outputLang}
              bg="whiteAlpha"
              onChange={selectOnChange}
            >
              <option value="json5">JSON</option>
              {/* <option value="xml">XML</option> */}
              <option value="yaml">YAML</option>
            </Select>
            <Button onClick={goToDocs}>Docs</Button>
            <Button onClick={reset}>Reset</Button>
            <Button onClick={runQuery}>Run</Button>
          </HStack>
        </Flex>
        <Box flex={1} backgroundColor="#ff914d">
          <Grid
            height="100%"
            width="100%"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(2, 1fr)"
            paddingLeft="1rem"
            paddingRight="1rem"
            paddingBottom="1rem"
            gap={4}
          >
            <GridItem rowSpan={1} colSpan={1}>
              <QueryEditor />
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <HtmlEditor />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
              <ResultVeiwer output={output} outputLang={outputLang} />
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </DemoContext.Provider>
  );
}
