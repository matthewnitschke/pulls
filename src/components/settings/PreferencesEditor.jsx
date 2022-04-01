const path = require('path');

import React, { useState } from 'react';

import preferencesSchema from './preferences-schema.json';

import Editor from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";

function ensureFirstBackSlash(str) {
    return str.length > 0 && str.charAt(0) !== "/"
        ? "/" + str
        : str;
}

function uriFromPath(_path) {
    const pathName = path.resolve(_path).replace(/\\/g, "/");
    return encodeURI("file://" + ensureFirstBackSlash(pathName));
}

loader.config({
  paths: {
    vs: uriFromPath(
      path.join(__dirname, "../node_modules/monaco-editor/min/vs")
    )
  }
});

loader.init().then(monaco => {
    // configure the JSON language support with schemas and schema associations
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [{
            uri: 'preferences-schema.json',
            fileMatch: ['*'],
			schema: preferencesSchema
        }]
    });
});


const PreferencesEditor = React.forwardRef((props, ref) => {
    return <Editor
        ref={ref}
        height="100vh"
        defaultLanguage="json"
        options={{
            minimap: { enabled: false }
        }}
        defaultValue={props.defaultValue}
        theme='vs-dark'
        onChange={props.onChange}


    />   
})

export default PreferencesEditor;
