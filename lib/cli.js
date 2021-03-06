(function () {
    const optimist = require('optimist');
    const Rehack = require(__dirname + '/rehack');

    const argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .alias('s', 'silent')
            .default('s', false)
            .describe('s', 'stop log.')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    const rehack = new Rehack(argv._[0], argv._[1]);

    rehack.on('error', (err) => {
        if (argv.s) {
            return;
        }
        console.error('[error]'.red, err);
    });

    rehack.on('file', (e) => {
        if (argv.s) {
            return;
        }
        console.log([
            e.modified ? '[update]'.green : '[default]',
            e.newFilePath ? e.newFilePath.green : e.filePath
        ].join('\t'));
    });
    
    rehack.on('end', (e) => {
        console.log('[done]'.green);
    });
    
    rehack.startWalking();
})();
