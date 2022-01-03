import React from 'react';

import GreenCheckmark from './icons/GreenCheckmark';
import RedXMark from './icons/RedXMark';
import YellowCircle from './icons/YellowCircle';

export default function StatusIcon(props) {
    switch(props.state?.toLowerCase() ?? '') {
        case 'success': return <GreenCheckmark />
        case 'pending': return <YellowCircle />
        case 'failure': return <RedXMark />
        default: return <i 
            className={`fas fa-circle pr-status-indicator ${props.state}`}
        ></i>
    }
}