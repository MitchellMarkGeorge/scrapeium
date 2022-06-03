import React, { useContext } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import { DemoContext, DemoContextValues } from './DemoContext';

export default function QueryEditor() {
  const { query, setQuery } = useContext(DemoContext) as DemoContextValues;

  const onChange = (value: string) => {
    setQuery(value);
  };

  return (
    <AceEditor
      theme="tomorrow"
      fontSize={16}
      height="100%"
      width="100%"
      value={query}
      onChange={onChange}
      focus={true}
      placeholder="Write the query to want to run here..."
      showPrintMargin={false}
    />
  );
}
