import React, { useContext } from 'react';
import { DemoContext, DemoContextValues } from '../../DemoContext';
import { Box } from '@chakra-ui/react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { darkTheme } from './theme';

export default function HtmlEditor() {
  const { html: htmlCode, setHtml } = useContext(DemoContext) as DemoContextValues;

  const onChange = (value: string) => {
    setHtml(value);
  };
  return (
    <Box  height="100%" width="100%">
      <ReactCodeMirror
        height="100%"
        width="100%"
        extensions={[html()]} 
        onChange={onChange}
        value={htmlCode}
        // theme={atomone}
        theme={darkTheme}
        basicSetup={{
          highlightActiveLine: false,
          highlightActiveLineGutter: false
        }}
      />
    {/* <AceEditor
      theme="tomorrow"
      mode="html"
      height="100%"
      width="100%"
      value={html}
      onChange={onChange}
      placeholder="Write the HTML you want to scrape here..."
      fontSize={16}
      showPrintMargin={false}
    /> */}
    </Box>
  );
}
