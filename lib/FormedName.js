var FormedName = function (name) {
    this.setName(name);
};

FormedName.prototype.setName = function (name) {
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

    words.forEach(function () {
        words.push(words.shift().toLowerCase());
    });
    
    this.words = words;
};

FormedName.prototype.toCamelCase = function () {
    var className = this.toClassName();
    return [
        className.slice(0, 1).toLowerCase(),
        className.slice(1)
    ].join('');
};

FormedName.prototype.toClassName = function () {
    var buf = [];
    this.words.forEach(function (word) {
        buf.push(
            word.slice(0, 1).toUpperCase(),
            word.slice(1)
        );
    });
    return buf.join('');
};

FormedName.prototype.toSnakeCase = function () {
    return this.words.join('_');
};

FormedName.prototype.toChainCase = function () {
    return this.words.join('-');
};

module.exports = FormedName;
