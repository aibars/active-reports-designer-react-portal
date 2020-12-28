import React, { useState } from 'react';
import WindowPortal from './WindowPortal';
import WindowPortalIFrame from './WindowPortalIFrame';


const Main: React.FC = () => {
    const [show, setShow] = useState(false);

    return (
        <div>
            <button onClick={() => setShow(!show)}>Open Designer</button>

            {/* Approach #1 - Portal with React component   */}
            {show &&
                (<WindowPortal closeWindowPortal={() => setShow(!show)} />)}


            {/* Approach #2  - Portal with iframe and PureJS implementation    */}
            {/* {show &&
                (<WindowPortalIFrame closeWindowPortal={() => setShow(!show)} />)} */}
        </div>
    );
}

export default Main;