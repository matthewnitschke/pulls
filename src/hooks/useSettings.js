const { ipcRenderer } = require('electron');

const { useState, useEffect } = require('react');
const settings = require('../components/settings/settings-utils.js');

export function useSettings(key, defaultValue) {
    let [setting, setSetting] = useState(settings.get(key) ?? defaultValue)

    useEffect(() => {
        let callback = () => {
            setSetting(settings.get(key) ?? defaultValue);
        };

        ipcRenderer.on('settings-updated', callback);
        return () => ipcRenderer.removeListener('settings-updated', callback);
    }, [key]);

    return setting
}