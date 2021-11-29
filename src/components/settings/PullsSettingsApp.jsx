const { ipcRenderer } = require('electron');
const definedSettings = require('./settings-config.js');
const settings = require('./settings-utils.js');

import swal from 'sweetalert';

import React from 'react';
import SettingInput from './SettingInput';

function PullsSettingsApp() {

    function _handleSave() {
        ipcRenderer.send('refresh-pulls-app')
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
                ipcRenderer.send('refresh-pulls-app')
            }
        })
    }

    return <div className="settings-editor-app">
        <div className="header">
            Pulls settings

            <i 
                className="far fa-trash-alt clickable fr"
                onClick={_handleDeleteAll}
            ></i>
        </div>
        <div className="settings-editor-app-body">
            {definedSettings.map(settingOptions => {
                return <SettingInput
                    key={settingOptions.settingsKey}
                    {...settingOptions}
                    onSave={_handleSave} />
            })}
        </div>
    </div>
}

export default PullsSettingsApp;