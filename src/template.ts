import { RDLReportDefinition } from "@grapecity/activereports/lib/ar-js-core";

export const generateTemplate = (definition?: RDLReportDefinition): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />

    <title>ActiveReports Report Designer</title>
    <meta name="description" content="ActiveReports Report Designer" />

    <link rel="stylesheet" href="http://cdn.grapecity.com/activereportsjs/2.0.1/styles/ar-js-ui.css" type="text/css" />
    <link rel="stylesheet" href="http://cdn.grapecity.com/activereportsjs/2.0.1/styles/ar-js-designer.css"
        type="text/css" />
    <script src="http://cdn.grapecity.com/activereportsjs/2.0.1/dist/ar-js-core.js"></script>
    <script src="http://cdn.grapecity.com/activereportsjs/2.0.1/dist/ar-js-designer.js"></script>
    <style>
        #designer-host {
            margin: 0 auto;
            width: 100%;
            height: 100vh;
        }
    </style>
</head>
<body>
    <div id="designer-host"></div>
    <script>
        var designer = new GC.ActiveReports.ReportDesigner.Designer("#designer-host");

        designer.setActionHandlers({
            onSave: function (info) {
                // this seems like it's not being fired when clicking the button
                window.top.postMessage({ ...info, type: 'save' }, '*');
                return Promise.resolve({ id: info.id, displayName: 'New Report' });
            },
            onSaveAs: function (info) {
                window.top.postMessage({ ...info, type: 'saveas' }, '*');
                return Promise.resolve({ id: info.id, displayName: 'New Report' });
            }
        });
        ${definition ? `designer.setReport({ definition: JSON.parse(${JSON.stringify(JSON.stringify(definition))}) });` : ''}

        setInterval(async () => {
            const reportInfo = await designer.getReport();
            if (reportInfo?.isDirty) {
              designer.processCommand('save');
            }
          }, 300000);
</script>
</body>
</html>
`;