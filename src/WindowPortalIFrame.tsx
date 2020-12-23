import { RDLReportDefinition } from '@grapecity/activereports/lib/ar-js-core';
import { ReportInfo } from '@grapecity/activereports/reportdesigner';
import React from 'react';
import ReactDOM from 'react-dom';
import './DesignerHost.scss';
import { generateTemplate } from './template';


interface IWindowPortalIFrameProps {
    closeWindowPortal: () => void;
}

interface IWindowPortalIFrameState {
    printTemplate: RDLReportDefinition;
}

class WindowPortalIFrame extends React.PureComponent<IWindowPortalIFrameProps, IWindowPortalIFrameState> {

    private externalWindow: Window;
    private containerEl: HTMLDivElement;

    constructor(props: IWindowPortalIFrameProps) {
        super(props);
        this.containerEl = document.createElement('div'); // STEP 1: create an empty div
        this.externalWindow = null;

        this.state = {
            printTemplate: null
        };
    }

    componentDidMount() {
        this.externalWindow = window.open('', '', `height=${window.screen.height},width=${window.screen.width}`);
        this.externalWindow.document.body.appendChild(this.containerEl);
        this.externalWindow.document.title = `ActiveReports Designer`;
        this.externalWindow.addEventListener('message', this.handleSaveReport);

        this.externalWindow.addEventListener('beforeunload', () => {
            this.props.closeWindowPortal();
        });
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleSaveReport);
        this.externalWindow.close();
    }

    private handleSaveReport = (event: any) => {
        const reportInfo = event?.data as ReportInfo;
        if (reportInfo?.definition) {
           this.setState({ printTemplate: reportInfo.definition });
        }
    }

    render() {
        const { printTemplate } = this.state;

        const portal: React.ReactNode = (
            <iframe
                frameBorder='no'
                scrolling='yes'
                sandbox='allow-same-origin allow-scripts'
                id='ar-designer'
                width='100%'
                height='100%'
                srcDoc={generateTemplate(printTemplate)}
            />
        );

        return ReactDOM.createPortal(portal, this.containerEl);
    }
}


export default WindowPortalIFrame;