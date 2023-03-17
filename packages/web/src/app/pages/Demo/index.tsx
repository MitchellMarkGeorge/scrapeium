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
import { DemoContext } from './DemoContext';
import QueryEditor from './components/editors/QueryEditor';
import HtmlEditor from './components/editors/HtmlEditor';
import YAML from 'yaml';
import ResultVeiwer from './components/editors/ResultVeiwer';
import { goToDocs } from '../../utils';
import TopBar from './components/TopBar';
import SplitPane from './components/SplitPane';

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
    <DemoContext.Provider
      value={{
        query,
        setQuery,
        html,
        setHtml,
        runQuery,
      }}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <TopBar />
        <Box flex={1} backgroundColor="gray.900">
          <SplitPane direction="vertical">
            <SplitPane direction="horizontal">
              <QueryEditor />
              <HtmlEditor />
            </SplitPane>
              <ResultVeiwer output={output} />
          </SplitPane>
        </Box>
        {/* <Box flex={1}  backgroundColor="gray.900" padding="1rem">
          <Grid
            height="100%"
            width="100%"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(2, 1fr)"
            // paddingLeft="1rem"
            // paddingRight="1rem"
            // paddingBottom="1rem"
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
        </Box> */}
      </Box>
    </DemoContext.Provider>
  );
}
