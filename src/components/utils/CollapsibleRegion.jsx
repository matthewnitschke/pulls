import React, { useState } from 'react';

function CollapsibleRegion(props) {
    let defaultIsClosed = props.defaultIsClosed != null ? props.defaultIsClosed : false;

    let [ isClosed, setIsClosed ] = useState(defaultIsClosed)

    return <div>
        <h2 onClick={() => setIsClosed(!isClosed)} className="df aic clickable">
            {props.header}
            <i className={`fas fa-chevron-${isClosed ? 'right' : 'down'} ml1`}></i>
        </h2>

        <div>
            {!isClosed && props.children}
        </div>
    </div>
}

export default CollapsibleRegion;