var fs = require('fs');
var child_process = require('child_process');
var util = require('util');

var lodash = require('lodash');
var async = require('async');
var colors = require('colors');
var walk = require('walk');

var FormedName = require(__dirname + '/FormedName');


var Rehack = function (name1, name2, opts) {
    var undef;

    if (!name1 || !name2) {
        throw new Error('arguments error.');
    }
    opts = opts || {};

    this.cwd = opts.cwd || '.';
    this.verbose = (opts.verbose === undef) ? true : opts.verbose;
    this.useGitCmd = (opts.useGitCmd === undef) ? true : opts.useGitCmd;
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
        [ this.name1.toClassName(), this.name2.toClassName() ],
        [ this.name1.toCamelCase(), this.name2.toCamelCase() ],
        [ this.name1.toSnakeCase(), this.name2.toSnakeCase() ],
        [ this.name1.toChainCase(), this.name2.toChainCase() ]
    ];

    var walker = walk.walk(this.cwd, {
        followLinks: false,
        filters: this.ignore
    });

    walker.on('file', function (root, stat, cb) {
        var filePath = [root, stat.name].join('/');
        this.convert(filePath, patterns, cb);
    }.bind(this));
};

Rehack.prototype.convert = function (filePath, patterns, cb) {
    var fileBody, newFileBody, newFilePath;

    async.series([function (next) {
        // read file
        fs.readFile(filePath, 'utf8', function (err, body) {
            fileBody = body;
            next(err);
        });
    }.bind(this), function (next) {
        // matching file body
        patterns.forEach(function (pattern) {
            while ((newFileBody || fileBody).indexOf(pattern[0]) >= 0) {
                newFileBody = (newFileBody || fileBody).replace(pattern[0], pattern[1]);
            }
        });
        if (newFileBody) {
            fs.writeFile(filePath, newFileBody, next);
        } else {
            setImmediate(next);
        }
    }.bind(this), function (next) {
        // matching file name
        patterns.forEach(function (pattern) {
            if (!newFilePath) {
                while ((newFilePath || filePath).indexOf(pattern[0]) >= 0) {
                    newFilePath = filePath.replace(pattern[0], pattern[1]);
                }
            }
        });
        if (newFilePath) {
            if (this.useGitCmd) {
                child_process.exec(
                    util.format('git mv %s %s', filePath, newFilePath),
                    next
                );
            } else {
                fs.rename(filePath, newFilePath, next);
            }
        } else {
            setImmediate(next);
        }
    }.bind(this), function (next) {
        // messaging
        this.log([
            newFileBody ? '[update]'.green : '[default]',
            newFilePath ? newFilePath.green : filePath
        ].join('\t'));
        setImmediate(next);
    }.bind(this)], cb);
};

Rehack.prototype.log = function (msg) {
    if (this.verbose) {
        console.log(msg);
    }
};

module.exports = Rehack;
