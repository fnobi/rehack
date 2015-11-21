var fs = require('fs');

var lodash = require('lodash');
var walk = require('walk');
var colors = require('colors');

var FormedName = require(__dirname + '/FormedName');


var Rehack = function (name1, name2, opts) {
    var undef;

    if (!name1 || !name2) {
        throw new Error('arguments error.');
    }
    opts = opts || {};

    this.cwd = opts.cwd || '.';
    this.verbose = (opts.verbose === undef) ? true : opts.verbose;
    this.ignore = opts.ignore || [
        '.git',
        'node_modules',
        'bower_component',
        '.sass-cache'
    ];

    this.name1 = new FormedName(name1);
    this.name2 = new FormedName(name2);

    this.startWalking();
};

Rehack.prototype.startWalking = function () {
    var patterns = [
        [ this.name1.toCamelCase(), this.name2.toCamelCase() ],
        [ this.name1.toSnakeCase(), this.name2.toSnakeCase() ],
        [ this.name1.toChainCase(), this.name2.toChainCase() ]
    ];

    var walker = walk.walk(this.cwd, {
        followLinks: false,
        filters: this.ignore
    });

    walker.on('file', function (root, stat, next) {
        var filePath = [root, stat.name].join('/');
        var rename = null;
        patterns.forEach(function (pattern) {
            if (rename) {
                return;
            }
            while ((rename || filePath).indexOf(pattern[0]) >= 0) {
                rename = filePath.replace(pattern[0], pattern[1]);
            }
        });
        if (rename) {
            this.log(rename.green);
            fs.rename(filePath, rename, next);
        } else {
            this.log(filePath);
            setImmediate(next);
        }
    }.bind(this));
};

Rehack.prototype.log = function (msg) {
    if (this.verbose) {
        console.log(msg);
    }
};

module.exports = Rehack;
