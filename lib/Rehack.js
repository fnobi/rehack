"use strict";

const fs = require('fs');
const child_process = require('child_process');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

const lodash = require('lodash');
const async = require('async');
const colors = require('colors');
const walk = require('walk');

const FormedName = require(__dirname + '/FormedName');

class Rehack extends EventEmitter {
    constructor (name1, name2, opts) {
        super();
        
        let undef;

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
        
        if (!this.name1 || !this.name2) {
            throw new Error('name1 or name2 is invalid.');
        }
        
        this.patterns = [
            [ this.name1.toClassName(), this.name2.toClassName() ],
            [ this.name1.toCamelCase(), this.name2.toCamelCase() ],
            [ this.name1.toSnakeCase(), this.name2.toSnakeCase() ],
            [ this.name1.toChainCase(), this.name2.toChainCase() ],
            [ this.name1.toLargeChainCase(), this.name2.toLargeChainCase() ],
            [ this.name1.toLargeSnakeCase(), this.name2.toLargeSnakeCase() ]
        ];
    }

    startWalking () {
        async.series([(next) => {
            // rename dir
            child_process.exec(
                // TODO: .以外のcwdを用いた場合、cwdをrenameしてしまう可能性がある
                util.format('find %s -type d', this.cwd),
                (err, stdout, stderr) => {
                    if (err) {
                        next(err);
                        return;
                    }

                    async.forEach(stdout.split(/\n/), (dirPath, cb) => {
                        if (!dirPath) {
                            cb();
                            return;
                        }
                        this.convertDir(dirPath, cb);
                    }, next);
                }
            );
            
        }, (next) => {
            // rename file
            const walker = walk.walk(this.cwd, {
                followLinks: false,
                filters: this.ignore
            });

            walker.on('file', (root, stat, cb) => {
                const filePath = [root, stat.name].join('/');
                this.convertFile(filePath, cb);
            });

            walker.on('end', () => {
                next();
            });
        }], () => {
            this.emit('end');
        });
    }

    convertDir (dirPath, cb) {
        let newDirPath;

        async.series([(next) => {
            this.moveWithPattern(dirPath, (err, result) => {
                if (err) {
                    next(err);
                } else {
                    newDirPath = result;
                    next();
                }
            });
        }, (next) => {
            this.emit('file', {
                filePath: dirPath,
                newFilePath: newDirPath
            });
            setImmediate(next);
        }], cb);
    }
    
    convertFile (filePath, cb) {
        let fileBody, newFileBody, newFilePath;

        async.series([(next) => {
            // read file
            fs.readFile(filePath, 'utf8', (err, body) => {
                fileBody = body;
                next(err);
            });
        }, (next) => {
            // matching file body
            this.patterns.forEach((pattern) => {
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
            this.moveWithPattern(filePath, (err, result) => {
                if (err) {
                    next(err);
                } else {
                    newFilePath = result;
                    next();
                }
            });
        }, (next) => {
            this.emit('file', {
                filePath: filePath,
                newFilePath: newFilePath,
                modified: !!newFileBody
            });
            setImmediate(next);
        }], cb);
    }

    moveWithPattern (filePath, cb) {
        let result;

        this.patterns.forEach((pattern) => {
            if (!result) {
                while ((result || filePath).indexOf(pattern[0]) >= 0) {
                    result = filePath.replace(pattern[0], pattern[1]);
                }
            }
        });
        if (result) {
            if (this.useGitCmd) {
                child_process.exec(
                    util.format('git mv %s %s', filePath, result),
                    (err) => {
                        cb(err, result);
                    }
                );
            } else {
                fs.rename(filePath, result, (err) => {
                    cb(err, result);
                });
            }
        } else {
            setImmediate(cb);
        }
    }
}

module.exports = Rehack;
