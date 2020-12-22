import React from "react";
import { Designer as ReportDesigner } from "@grapecity/activereports/reportdesigner";
import "@grapecity/activereports/styles/ar-js-ui.css";
import "@grapecity/activereports/styles/ar-js-designer.css";
import "./DesignerHost.scss";

const initDesigner = (designerHostSelector) => {
  new ReportDesigner(designerHostSelector);
};

export const DesignerHost = () => {
  React.useEffect(() => initDesigner("#designer-host"), []);

  return <div id="designer-host"></div>;
};