const { ipcRenderer } = require('electron');
const definedSettings = require('./settings-config.js');
const settings = require('./settings-utils.js');


const path = require('path');

import swal from 'sweetalert';

import React from 'react';
import SettingInput from './SettingInput';
import { useSettings } from '../../hooks/useSettings';

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

function PullsSettingsApp() {
    function _handleSave() {
        ipcRenderer.send('settings-updated')
    }

    function _handleDeleteAll() {
        swal({
            title: "Are you sure?",
            icon: "warning",
            text: 'This will delete ALL settings. If you do not have Github or Build keys saved somewhere else, they will be lost FOREVER',
            buttons: true,
            dangerMode: true,
        }).then((value) => {
            if (value) {
                settings.deleteAll();
                settings.setDefaults();
                ipcRenderer.send('settings-updated')
            }
        })
    }

    return <div className="settings-editor-app">
        <div className="header">
            Pulls preferences
            <i 
                className="far fa-trash-alt clickable fr"
                onClick={_handleDeleteAll}
            ></i>
        </div>

        <Editor
            height="90vh"
            defaultLanguage="json"
            options={{minimap: { enabled: false }}}
            defaultValue={JSON.stringify({
                githubUser: 'matthewnitschke-wk',
                queries: [
                    { label: 'My Prs', query: 'is:pr' }
                ]
            }, null, 4)}
            theme='vs-dark'
        />

        {/* <div className="settings-editor-app-body">
            {definedSettings.map(settingOptions => {
                return <SettingInput
                    key={settingOptions.settingsKey}
                    {...settingOptions}
                    onSave={_handleSave} />
            })}
        </div> */}
    </div>
}

export default PullsSettingsApp;