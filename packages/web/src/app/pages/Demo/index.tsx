import {
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Evaluator, Parser } from '@scrapeium/lang';
import { DemoContext } from './DemoContext';
import QueryEditor from './components/editors/QueryEditor';
import HtmlEditor from './components/editors/HtmlEditor';
import ResultVeiwer from './components/editors/ResultVeiwer';
import TopBar from './components/TopBar';
import SplitPane from './components/SplitPane';
import dedent from 'ts-dedent';

const INITAL_QUERY = dedent`
  // Here is where you write your Scrapeium queries. Oh look, syntax highlighting!
  "#age" > read :inner_text
`;

const SAMPLE_HTML = dedent`
  <div id="age">10</div>
`

export default function Demo() {
  const [output, setOutput] = useState('');
  const [query, setQuery] = useState(INITAL_QUERY);
  const [html, setHtml] = useState(SAMPLE_HTML);

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
      setOutput(JSON.stringify(result, null, 2));
    } catch (error: any) {
      const errorOutput = JSON.stringify({ error: error.message }, null, 2);
      setOutput(errorOutput);
    }
  };

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
            {/* <div></div> */}
              <ResultVeiwer output={output} />
          </SplitPane>
        </Box>
      </Box>
    </DemoContext.Provider>
  );
}
