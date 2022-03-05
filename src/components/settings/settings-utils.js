const Store = require('electron-store');
const store = new Store();

const settingsConfig = require('./settings-config.js');

module.exports = {
    get: (key) => store.get(key),
    set: (key, val) => store.set(key, val),
    has: (key) => store.has(key),
    onDidChange: (key, callback) => store.onDidChange(key, callback),
    onDidAnyChange: (callback) => store.onDidAnyChange(callback),
    setDefaults: () => {
        settingsConfig
            .filter(s => s.hasOwnProperty('defaultValue'))
            .filter(s => {
                if (!store.has(s.settingsKey)) return true

                let value = store.get(s.settingsKey);
                if (value !== null || value !== "") return false;

                return true
            })
            .forEach(s => {
                let val = s.defaultValue;
                if (s.type == 'list') {
                    val = val.split(/, */);
                }
                store.set(s.settingsKey, val);
            });
    },
    hasRequiredSettings: () => {
        return settingsConfig
            .filter(s => s.isRequired && !store.has(s.settingsKey))
            .length <= 0;
    },
}