const settings = require('./settings-utils.js');

import React, { useState } from 'react';

function SettingInput(props) {
    const defaultValue = settings.has(props.settingsKey) ? settings.get(props.settingsKey) : props.defaultValue;
    let [isFocused, setIsFocused] = useState(false);

    function _handleCommitValue(e) {
        if (props.type == 'checkbox') {
            settings.set(props.settingsKey, e.target.checked);
        } else {
            let inputValue = e.target.value;

            if (inputValue == '') {
                settings.delete(props.settingsKey);
            } else {
                if (props.type == 'list'){
                    inputValue = inputValue.split(/, */);
                }
                settings.set(props.settingsKey, inputValue);
            }
        }

        props.onSave();
        setIsFocused(false);
    }

    return <div className="settings-input">
        <label className={`${props.isRequired ? 'required' : ''}`}>{props.label}</label>
        <div className={`settings-input-hint ${!props.hint ? 'hidden' : ''}`}>{props.hint}</div>

        { props.type == 'checkbox' &&
            <input 
                type="checkbox"
                defaultChecked={defaultValue}
                onChange={_handleCommitValue} />
        }

        { props.type != 'checkbox' &&
            <input 
                type={props.isProtected && !isFocused ? 'password' : 'text'}
                defaultValue={defaultValue}
                onFocus={() => setIsFocused(true)}
                onBlur={_handleCommitValue} />
        }
    </div>
}

export default SettingInput;