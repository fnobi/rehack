"use strict";

var fs = require('fs');
var child_process = require('child_process');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var lodash = require('lodash');
var async = require('async');
var colors = require('colors');
var walk = require('walk');

var FormedName = require(__dirname + '/FormedName');

class Rehack extends EventEmitter {
    constructor (name1, name2, opts) {
        super();
        
        var undef;

        opts = opts || {};
        this.cwd = opts.cwd || '.';
        this.useGitCmd = (opts.useGitCmd === undef) ? true : opts.useGitCmd;
        this.ignore = opts.ignore || [
            '.git',
            'node_modules',
            'bower_component',
            '.sass-cache'
        ];

        if (name1) {
            this.name1 = new FormedName(name1);
        }
        if (name2) {
            this.name2 = new FormedName(name2);
        }
    }

    startWalking () {
        if (!this.name1 || !this.name2) {
            this.emit('error', new Error('name1 or name2 is invalid.'));
            return;
        }
        
        var patterns = [
            [ this.name1.toClassName(), this.name2.toClassName() ],
            [ this.name1.toCamelCase(), this.name2.toCamelCase() ],
            [ this.name1.toSnakeCase(), this.name2.toSnakeCase() ],
            [ this.name1.toChainCase(), this.name2.toChainCase() ],
            [ this.name1.toLargeChainCase(), this.name2.toLargeChainCase() ],
            [ this.name1.toLargeSnakeCase(), this.name2.toLargeSnakeCase() ]
        ];

        var walker = walk.walk(this.cwd, {
            followLinks: false,
            filters: this.ignore
        });

        walker.on('file', (root, stat, cb) => {
            var filePath = [root, stat.name].join('/');
            this.convert(filePath, patterns, cb);
        });
    }

    convert (filePath, patterns, cb) {
        var fileBody, newFileBody, newFilePath;

        async.series([(next) => {
            // read file
            fs.readFile(filePath, 'utf8', (err, body) => {
                fileBody = body;
                next(err);
            });
        }, (next) => {
            // matching file body
            patterns.forEach((pattern) => {
                while ((newFileBody || fileBody).indexOf(pattern[0]) >= 0) {
                    newFileBody = (newFileBody || fileBody).replace(pattern[0], pattern[1]);
                }
            });
            if (newFileBody) {
                fs.writeFile(filePath, newFileBody, next);
            } else {
                setImmediate(next);
            }
        }, (next) => {
            // matching file name
            patterns.forEach((pattern) => {
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
        }, (next) => {
            this.emit('file', {
                filePath: filePath,
                newFilePath: newFilePath,
                modified: !!newFileBody
            });
            setImmediate(next);
        }], cb);
    }
}

module.exports = Rehack;
