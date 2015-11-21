(function () {
    var optimist = require('optimist');
    var Rehack = require(__dirname + '/rehack');

    var argv = optimist
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

    new Rehack(argv._[0], argv._[1], {
        verbose: !argv.s
    });
})();
