var lodash = require('lodash');
var walk = require('walk');

var Rehack = function (opts) {
    opts = opts || {};

    this.cwd = opts.cwd || '.';
    this.ignore = opts.ignore || [
        '.git',
        'node_modules',
        'bower_component'
    ];

    this.startWalking();
};

Rehack.prototype.startWalking = function () {
    var walker = walk.walk(this.cwd, {
        followLinks: false,
        filters: this.ignore
    });

    walker.on('file', function (root, stat, next) {
        console.log([root, stat.name].join('/'));
        setImmediate(next);
    });    
};

module.exports = Rehack;
