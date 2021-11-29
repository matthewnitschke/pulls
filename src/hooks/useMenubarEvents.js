// Node
const { ipcRenderer } = require('electron');

// Libraries
import { useEffect } from 'react';

function _onIPCEvent(ipcEventName, callback, runOnInit=false) {
    ipcRenderer.on(ipcEventName, callback);
    
    if (runOnInit){
        callback();
    }

    return () => {
        ipcRenderer.removeListener(ipcEventName, callback);
    }
}

export function useMenubarShow(onShow, runOnInit) {
    useEffect(() => _onIPCEvent('menubar-show', onShow, runOnInit), []);
}

export function useMenubarHide(onHide, runOnInit) {
    useEffect(() => _onIPCEvent('menubar-hide', onHide, runOnInit), []);
}