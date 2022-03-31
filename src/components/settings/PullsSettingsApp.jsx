const { ipcRenderer } = require('electron');
const settings = require('./settings-utils.js');

import swal from 'sweetalert';

import React, { useState } from 'react';
import PreferencesEditor from './PreferencesEditor.jsx';

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

        <PreferencesEditor
            defaultValue={JSON.stringify(settings.get('preferences'), null, 2)}
            onChange={val => settings.set('preferences', JSON.parse(val))} />
    </div>
}

export default PullsSettingsApp;