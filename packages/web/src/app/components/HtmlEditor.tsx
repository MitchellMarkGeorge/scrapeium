import React, { useContext } from 'react';
import AceEditor from 'react-ace';
import { DemoContext, DemoContextValues } from './DemoContext';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
export default function HtmlEditor() {
  const { html, setHtml } = useContext(DemoContext) as DemoContextValues;

  const onChange = (value: string) => {
    setHtml(value);
  };
  return (
    <AceEditor
      theme="tomorrow"
      mode="html"
      height="100%"
      width="100%"
      value={html}
      onChange={onChange}
      placeholder="Write the HTML you want to scrape here..."
      fontSize={16}
      showPrintMargin={false}
    />
  );
}
