import React, { useState } from 'react';
import WindowPortal from './WindowPortal';


const Main: React.FC = () => {
    const [show, setShow] = useState(false);

    return (
        <div>
            <button onClick={() => setShow(!show)}>Open Designer</button>
            {show &&
                (<WindowPortal closeWindowPortal={() => setShow(!show)} />)}

            {/* <Modal show={show} onHide={() => setShow(!show)} className="designerModal">
                <Modal.Header>
                    <Modal.Title id="ModalTitle">Designer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DesignerHost />
                </Modal.Body>
            </Modal> */}

            {/* {show &&

                <DesignerHost />
            }  */}
            {/* {show &&
                <WindowWrapper closeWindowPortal={() => setShow(!show)}/>
            } */}
        </div>
    );
}

export default Main;