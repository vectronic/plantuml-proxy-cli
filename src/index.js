import {
    STDOUT_PRINTER_SERVICE,
    SimpleSingleCommandNodeCLI, ArgumentValueTypeName,
} from '@flowscripter/cli-framework';

import render from './render';

function getCommand() {
    return {
        name: 'plantrender',
        description: 'Render UML',
        options: [{
            name: 'sourceFolder',
            description: 'Folder path which contains PlantUML files.',
            type: ArgumentValueTypeName.String
        },
        {
            name: 'destFolder',
            description: 'Folder path for output of rendered images.',
            type: ArgumentValueTypeName.String
        },
        {
            name: 'sourceExt',
            description: 'Source PlantUML file extension.',
            type: ArgumentValueTypeName.String,
            defaultValue: 'iuml'
        },
        {
            name: 'destFormat',
            description: 'Output rendered image format.',
            type: ArgumentValueTypeName.String,
            validValues: ['png', 'txt', 'svg'],
            defaultValue: 'png'
        },
        {
            name: 'url',
            description: 'URL of the PlantUML render service.',
            type: ArgumentValueTypeName.String,
            defaultValue: 'http://www.plantuml.com/plantuml/'
        }],
        positionals: [],
        run: async (commandArgs, context) => {
            const printer = context.serviceRegistry.getServiceById(STDOUT_PRINTER_SERVICE);
            if (printer == null) {
                throw new Error('STDOUT_PRINTER_SERVICE not available in context');
            }
            await render(
                commandArgs.sourceFolder,
                commandArgs.destFolder,
                commandArgs.sourceExt,
                commandArgs.destFormat,
                commandArgs.url,
                printer);
        }
    };
}

(async () => {
    const cli = new SimpleSingleCommandNodeCLI(getCommand(), 'plantrender');

    await cli.execute();
})();
