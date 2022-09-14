const fs = require('fs').promises;
const yaml = require('js-yaml');
const { shell } = require('electron');
const Store = require('electron-store');

export const settingsStore = new Store();

const homedir = require('os').homedir();

export const openUrl = (url) => shell.openExternal(url);
export const openConfigFile = async () => shell.openPath(configFilePath);
export const getConfig = async () => {
  let fileContent = await fs.readFile(configFilePath, 'utf8');
  return yaml.load(fileContent);
}

export const configFilePath = `${homedir}/.pulls-config.yaml`;
