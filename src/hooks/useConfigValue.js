
import { useCallback, useEffect, useState } from 'react'
import { getConfig, configFilePath } from '../utils'

const fs = require('fs');

export function useConfigValue(selector, defaultValue) {
  let [val, setVal] = useState(defaultValue);

  let selectConfigVal = useCallback(async () => {
    let config = await getConfig();
    setVal(selector(config) ?? defaultValue);
  }, [])

  useEffect(() => fs.watch(configFilePath, selectConfigVal), []);
  selectConfigVal();
  
  return val
}
