"use strict";

class FormedName {
    constructor(name) {
        this.setName(name);
    }

    setName(name) {
        var words = [];
        if (/_/.test(name)) {
            words = name.split(/_/g);
        } else if (/-/.test(name)) {
            words = name.split(/-/g);
        } else {
            while (/[A-Z]/.test(name)) {
                var index = name.match(/[A-Z]/).index;
                words.push(name.slice(0, index));
                name = [
                    name.slice(index, index + 1).toLowerCase(),
                    name.slice(index + 1)
                ].join('');
            }
            words.push(name);
            if (!words[0]) {
                words.shift();
            }
        }

        words.forEach(() => {
            words.push(words.shift().toLowerCase());
        });
        
        this.words = words;
    }

    toCamelCase () {
        var className = this.toClassName();
        return [
            className.slice(0, 1).toLowerCase(),
            className.slice(1)
        ].join('');
    }

    toClassName () {
        var buf = [];
        this.words.forEach((word) => {
            buf.push(
                word.slice(0, 1).toUpperCase(),
                word.slice(1)
            );
        });
        return buf.join('');
    }

    toSnakeCase () {
        return this.words.join('_');
    }

    toChainCase () {
        return this.words.join('-');
    }

    toLargeChainCase () {
        var largeWords = [];
        this.words.forEach((word) => {
            largeWords.push(word.toUpperCase());
        });
        return largeWords.join('-');
    }

    toLargeSnakeCase () {
        var largeWords = [];
        this.words.forEach((word) => {
            largeWords.push(word.toUpperCase());
        });
        return largeWords.join('_');
    }
}

module.exports = FormedName;










