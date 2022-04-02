import React from 'react';

import Header from './header/Header.jsx';

import {openConfigFile} from '../utils'

function MissingRequiredSettingsView() {
    return <div>
        <Header empty/>
        <div className="m3 tac" style={{ color: "#adbac7"}}>
            Pulls does not contain required settings. Click <a className="unstyled" href="#" onClick={openConfigFile}>Here</a> to fill out necessary values.
        </div>
    </div>
}

export default MissingRequiredSettingsView;
