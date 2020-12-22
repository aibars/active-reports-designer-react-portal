import React from 'react';
import ReactDOM from 'react-dom';
import { Designer } from "@grapecity/activereports/reportdesigner";
import styles from './DesignerHost.module.scss';
import './DesignerHost.scss';


interface IWindowPortalProps {
    closeWindowPortal: () => void;
}

class WindowPortal extends React.PureComponent<IWindowPortalProps> {

    private externalWindow: Window;
    private containerEl: HTMLDivElement;

    constructor(props: IWindowPortalProps) {
        super(props);
        this.containerEl = document.createElement('div'); // STEP 1: create an empty div
        this.containerEl.id = 'designer-host';
        this.containerEl.className = styles.designerHost;
        this.externalWindow = null;
    }

    private copyStyles = (sourceDoc: Document, targetDoc: Document) => {
        Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
            if (styleSheet.cssRules) { // true for inline styles
                const newStyleEl = sourceDoc.createElement('style');

                Array.from(styleSheet.cssRules).forEach(cssRule => {
                    newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
                });

                targetDoc.head.appendChild(newStyleEl);
            } else if (styleSheet.href) { // true for stylesheets loaded from a URL
                const newLinkEl = sourceDoc.createElement('link');

                newLinkEl.rel = 'stylesheet';
                newLinkEl.href = styleSheet.href;
                targetDoc.head.appendChild(newLinkEl);
            }
        });
    }

    componentDidMount() {
        this.externalWindow = window.open('', '', `height=${window.screen.height},width=${window.screen.width}`);
        this.externalWindow.document.body.appendChild(this.containerEl);

        this.externalWindow.document.title = 'Report Designer window';
        let s = document.createElement("script");
        s.type = "text/javascript";
        s.src = 'http://cdn.grapecity.com/activereportsjs/2.0.0/dist/ar-js-core.js';
        this.externalWindow.document.head.append(s);

        s = document.createElement("script");
        s.type = "text/javascript";
        s.src = 'http://cdn.grapecity.com/activereportsjs/2.0.0/dist/ar-js-designer.js';
        this.externalWindow.document.head.append(s);



        this.copyStyles(document, this.externalWindow.document);
        this.externalWindow.addEventListener('beforeunload', () => {

            this.props.closeWindowPortal();
        });

        s = document.createElement("script");
        s.innerHTML = ' new GC.ActiveReports.ReportDesigner.Designer("#designer-host");';
        this.externalWindow.document.body.appendChild(s);

        this.externalWindow.addEventListener('load', (e) => {    
            console.log(e); 
            const designer = new Designer('#designer-host');
            console.log(designer);
        });
    }

    componentWillUnmount() {
        this.externalWindow.close();
    }

    render() {
        return ReactDOM.createPortal(null, this.containerEl);
    }
}


export default WindowPortal;