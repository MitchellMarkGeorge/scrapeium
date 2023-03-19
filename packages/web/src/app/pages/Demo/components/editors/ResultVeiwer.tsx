import React from 'react';
import { Box } from '@chakra-ui/react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { darkTheme } from './theme';
// import 'ace-builds/webpack-resolver';

interface Props {
  output: string
}
export default function ResultVeiwer(props: Props) {
  return (
    <Box  height="100%" width="1005">

      <ReactCodeMirror
        height="100%"
        width="100%"
        value={props.output}
        theme={darkTheme}
        extensions={[json()]}
        readOnly
        placeholder="View the result of your query here..."
        basicSetup={{
          highlightActiveLine: false,
          highlightActiveLineGutter: false
        }}
      />

    {/* <AceEditor
      theme="tomorrow"
      value={props.output}
      mode="json5"
      readOnly
      height="100%"
      width="100%"
      highlightActiveLine={false}
      setOptions={{ highlightGutterLine: false }}
      showPrintMargin={false}
      // showGutter={false}
      fontSize={16}
    /> */}
    </Box>
  );
}
