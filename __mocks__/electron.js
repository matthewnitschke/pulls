'use strict';

module.exports = {
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
    sendSync: jest.fn(),
    removeListener: jest.fn(),
  },
}
