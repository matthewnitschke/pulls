// Libraries
import React, {useRef} from 'react';
import { useDrag } from 'react-dnd';

const settings = require('./settings/settings-utils.js');

// Components
import PrStatusIndicator from "./utils/PrStatusIndicator";


const PullListItem = React.forwardRef((props, ref) => {
    let { filterText } = props;

    function _getPrTitle() {
        let name = 
            settings.has('prTitleRewriter') 
              ? props.name.replace(new RegExp(settings.get('prTitleRewriter')), '') 
              : props.name
        

        if (filterText != '' || filterText != null) {
            let matchStart = name.toLowerCase().indexOf(filterText.toLowerCase());

            // sanity check to make sure the filter text is in the name
            if (matchStart <= -1) return name;

            let prefix = name.substring(0, matchStart)
            let match = name.substring(matchStart, matchStart+filterText.length);
            let suffix = name.substring(matchStart+filterText.length)

            return <>{prefix}<mark>{match}</mark>{suffix}</>;
        }

        return name;
    }

    return <div
        ref={ref}
        className={`pr-list-item ${props.isSelected ? 'selected' : ''} ${props.isHovered ? 'hovered': ''}`}
        onClick={props.onClick}
        style={props.style}
        role="listitem"
    >
        <PrStatusIndicator state={props.prStatus} isMerged={props.isClosed}/>
        <div className={`pr-list-item__text ${props.isClosed ? 'merged' : ''}`}>
            <span className='pr-list-item__repo-name'>{props.repo}</span>
            {_getPrTitle()}
        </div>
    </div>
});

export default PullListItem;