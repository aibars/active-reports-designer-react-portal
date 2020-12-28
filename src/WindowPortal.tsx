import React from 'react';
import ReactDOM from 'react-dom';
import { DesignerHost } from './DesignerHost';

interface IWindowPortalProps {
    closeWindowPortal: () => void;
}

class WindowPortal extends React.PureComponent<IWindowPortalProps> {

    private externalWindow: Window;
    private designerContainer: HTMLDivElement;

    constructor(props: IWindowPortalProps) {
        super(props);
        this.designerContainer = document.createElement('div');
        this.designerContainer.id = 'designer-host';
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
        this.externalWindow.document.body.appendChild(this.designerContainer);

        this.externalWindow.document.title = 'ActiveReports Designer';

        this.copyStyles(document, this.externalWindow.document);
        this.externalWindow.addEventListener('beforeunload', () => {
            this.props.closeWindowPortal();
        });
    }

    componentWillUnmount() {
        this.externalWindow.close();
    }

    render() {
        return ReactDOM.createPortal(<DesignerHost element={this.designerContainer} />, this.designerContainer);
    }
}

export default WindowPortal;