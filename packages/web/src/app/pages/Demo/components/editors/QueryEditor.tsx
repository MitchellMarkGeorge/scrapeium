import React, { useContext } from 'react';
import { DemoContext, DemoContextValues } from '../../DemoContext';
import { Box } from '@chakra-ui/react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { darkTheme } from './theme';
import { scrapeium } from '@scrapeium/codemirror';

export default function QueryEditor() {
  const { query, setQuery } = useContext(DemoContext) as DemoContextValues;

  // should the editor be controlled??Kj
  const onChange = (value: string) => {
    setQuery(value);
  };

  return (
    <Box height="100%" width="100%" flex={1}>
      <ReactCodeMirror
        height="100%"
        width="100%"
        onChange={onChange}
        value={query}
        theme={darkTheme}
        // for some reason using this extension causes issues...
        extensions={[scrapeium()]}
        basicSetup={{
          highlightActiveLine: false,
          highlightActiveLineGutter: false
        }}
      />
      {/* <AceEditor
      theme="tomorrow"
      fontSize={16}
      height="100%"
      width="100%"
      value={query}
      onChange={onChange}
      focus={true}
      placeholder="Write the query to want to run here..."
      showPrintMargin={false}
    /> */}
    </Box>
  );
}
