import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds';
import 'ace-builds/webpack-resolver';

interface Props {
  output: string
  outputLang: "json5" | "yaml";
}
export default function ResultVeiwer(props: Props) {
  return (
    <AceEditor
      theme="tomorrow"
      value={props.output}
      mode={props.outputLang}
      readOnly
      height="100%"
      width="100%"
      placeholder="View the result of your query here..."
      highlightActiveLine={false}
      setOptions={{ highlightGutterLine: false }}
      showPrintMargin={false}
      // showGutter={false}
      fontSize={16}
    />
  );
}
