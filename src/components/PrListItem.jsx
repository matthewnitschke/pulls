// Libraries
import React from 'react';
import {removeTicketFromPrTitle} from '../utils.js';

const settings = require('./settings/settings-utils.js');

// Components
import PrStatusIndicator from "./utils/PrStatusIndicator";

function PullListItem(props) {

    function _getPrTitle() {
        if (settings.has('prTitleRewriter')) {
            return props.name.replace(new RegExp(settings.get('prTitleRewriter')), '')
        }

        return props.name
    }

    return <div
        className={`pr-list-item ${props.isSelected ? 'selected' : ''}`}
        onClick={props.onClick}
        role="listitem"
    >
        <PrStatusIndicator state={props.prStatus} isMerged={props.isClosed}/>
        <div className={`pr-list-item__text ${props.isClosed ? 'merged' : ''}`}>
            <span className='pr-list-item__repo-name'>{props.repo}</span>
            {_getPrTitle()}
        </div>
    </div>
}

export default PullListItem;