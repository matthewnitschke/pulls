const settings = require('./settings-utils.js');

import React, { useState } from 'react';
import { useEffect } from 'react';

function SettingInput(props) {
    const defaultValue = settings.has(props.settingsKey) ? settings.get(props.settingsKey) : props.defaultValue;
    let [isFocused, setIsFocused] = useState(false);

    function _handleCommitValue(e) {
        if (props.type == 'checkbox') {
            settings.set(props.settingsKey, e.target.checked);
        } else if (props.type == 'map') {
            console.log(`Committing: ${JSON.stringify(e)}`);
            settings.set(props.settingsKey, e);
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

        {
            props.type == 'map' &&
            <MapInput 
                {...props}
                defaultValue={defaultValue}
                onCommitValue={_handleCommitValue}
            />
        }

        { props.type == 'string' &&
            <input 
                type={props.isProtected && !isFocused ? 'password' : 'text'}
                defaultValue={defaultValue}
                onFocus={() => setIsFocused(true)}
                onBlur={_handleCommitValue} />
        }
    </div>
}

export default SettingInput;

function MapInput(props) {
    let [entries, setEntries] = useState(props.defaultValue);

    useEffect(() => props.onCommitValue(entries), [entries]);

    let _moveEntry = (entry, delta) => {
        let currentIndex = entries.indexOf(entry)

        let newIndex = currentIndex + delta
        if (newIndex >= entries.length) {
            newIndex = 0;
        } else if (newIndex <= 0) {
            newIndex = entries.length -1;
        }

        let newEntries = [...entries]

        newEntries.splice(currentIndex, 1);
        newEntries.splice(newIndex, 0, entry)

        setEntries(newEntries);
    }

    return <div>
        {entries.map(entry => <div 
            key={entry.key + entry.value}
            style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '.3rem',
            }}
        >
            <div 
                style={{
                    color: 'grey',
                    marginRight: '.1rem',
                    cursor: 'pointer'
                }}
                onClick={() => _moveEntry(entry, -1)}
            >↑</div>
            <div 
                style={{
                    color: 'grey',
                    cursor: 'pointer'
                }}
                onClick={() => _moveEntry(entry, 1)}
            >↓</div>

            <input 
                defaultValue={entry.key} 
                style={{
                    marginRight: '.3rem',
                    marginLeft: '.3rem'
                }} 
                type='text'
                onBlur={(event) => setEntries(entries.map(el => {
                    if (el == entry) return {...el, key: event.target.value}
                    return el
                }))}
            />

            <input
                defaultValue={entry.value}
                style={{
                    flexGrow: '1',
                    fontFamily: 'monospace'
                }}
                type='text' 
                onBlur={(event) => setEntries(entries.map(el => {
                    if (el == entry) return {...el, value: event.target.value}
                    return el
                }))}
            />

            <button
                 style={{
                    color: 'red',
                    background: 'none',
                    border: 'none',
                }}
                onClick={() => setEntries(entries.filter(el => el != entry))}
            >
                <i style={{color:'red'}}
                    className="fas fa-minus clickable"></i>
            </button>
        </div>)}

        <i
            style={{
                color: '#adbac7',
                marginTop: '.5rem',
                fontSize: '1.1rem',
            }}
            onClick={() => setEntries([...entries, {key: '', value: ''}])}
            className="fas fa-plus clickable"></i>
    </div>
}