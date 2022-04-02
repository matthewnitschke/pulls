const fs = require('fs').promises
const yaml = require('js-yaml');
const {shell} = require('electron');
const Store = require('electron-store');
const store = new Store();

const homedir = require('os').homedir();

const configFilePath = `${homedir}/.pulls-config.yaml`;
module.exports = {
  openUrl: (url) => {
    shell.openExternal(url);
  },
  getConfig: async () => {
    let fileContent = await fs.readFile(configFilePath, 'utf8');
    return yaml.safeLoad(fileContent);
  },
  openConfigFile: async () => {
    shell.openPath(configFilePath);
  },
  settingsStore: store,
  configFilePath,
}
