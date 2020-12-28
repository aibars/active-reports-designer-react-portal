import React, { useRef } from 'react';
import { Designer as ReportDesigner } from '@grapecity/activereports/reportdesigner';
import './DesignerHost.scss';

interface IDesignerHostProps {
  element: HTMLElement
}
export const DesignerHost: React.FC<IDesignerHostProps> = ({ element }) => {
  const designerRef = React.useRef<ReportDesigner | undefined>();
  const counter = React.useRef<number>(0);
  const [reportStorage, setReportStorage] = React.useState(new Map());

  React.useEffect(() => {
    designerRef.current = new ReportDesigner(element);
    designerRef.current.setActionHandlers({
      onSave: function (info) {
        const reportId = info.id || `report${counter.current++}`;
        setReportStorage(new Map(reportStorage.set(reportId, info.definition)));
        return Promise.resolve({ displayName: reportId });
      },
      onSaveAs: function (info) {
        const reportId = info.id || `report${counter.current++}`;
        setReportStorage(new Map(reportStorage.set(reportId, info.definition)));
        return Promise.resolve({ id: reportId, displayName: reportId });
      },
    });
  }, []);

  return null;
};