import React from 'react';
import { useSelector } from 'react-redux';

import {openConfigFile} from '../utils'


export default function ConfigValidator(props) {
  let isValid = useSelector(state => state.config.isValid);
  let errors = useSelector(state => state.config.errors);

  if (!isValid) {
    return <div className="p3" style={{ color: "#adbac7"}}>
      <div className="">
        Pulls config file contains errors. Click <a className="unstyled" href="#" onClick={openConfigFile}>Here</a> to fill out necessary values.
      </div>

      <h3 className="mt3">Validation Errors</h3>
      <ul>
        {errors.map((err, i) => <li key={i}>{err.message}</li>)}
      </ul>
    </div>;
  }

  return props.children;
}
