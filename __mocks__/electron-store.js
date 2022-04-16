let mockStoreData = {};

module.exports = class Store {
  has(key) { return mockStoreData.hasOwnProperty(key) }
  get(val) { return mockStoreData[val] }
  set(key, val) { mockStoreData[key] = val }
}
