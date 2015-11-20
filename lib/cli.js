(function () {
    var optimist = require('optimist');
    var Rehack = require(__dirname + '/rehack');

    var argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    new Rehack();
})();
