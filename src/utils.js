const {shell} = require('electron');

export const openUrl = (url) => {
    shell.openExternal(url);
}