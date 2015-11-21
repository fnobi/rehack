var expect = require('chai').expect;

var FormedName = require(__dirname + '/../lib/FormedName');

describe('FormedName', function () {
    it('chain case to camel case', function () {
        var name = new FormedName('hoge-moge');
        expect(name.toCamelCase()).to.be.equal('hogeMoge');
    });

    it('chain case to class name', function () {
        var name = new FormedName('hoge-moge');
        expect(name.toClassName()).to.be.equal('HogeMoge');
    });

    it('chain case to snake case', function () {
        var name = new FormedName('hoge-moge');
        expect(name.toSnakeCase()).to.be.equal('hoge_moge');
    });

    it('chain case to chain case', function () {
        var name = new FormedName('hoge-moge');
        expect(name.toChainCase()).to.be.equal('hoge-moge');
    });

    it('snake case to camel case', function () {
        var name = new FormedName('hoge_moge');
        expect(name.toCamelCase()).to.be.equal('hogeMoge');
    });

    it('snake case to class name', function () {
        var name = new FormedName('hoge_moge');
        expect(name.toClassName()).to.be.equal('HogeMoge');
    });

    it('snake case to snake case', function () {
        var name = new FormedName('hoge_moge');
        expect(name.toSnakeCase()).to.be.equal('hoge_moge');
    });

    it('snake case to chain case', function () {
        var name = new FormedName('hoge_moge');
        expect(name.toChainCase()).to.be.equal('hoge-moge');
    });

    it('camel case to camel case', function () {
        var name = new FormedName('hogeMoge');
        expect(name.toCamelCase()).to.be.equal('hogeMoge');
    });

    it('camel case to class name', function () {
        var name = new FormedName('hogeMoge');
        expect(name.toClassName()).to.be.equal('HogeMoge');
    });

    it('camel case to snake case', function () {
        var name = new FormedName('hogeMoge');
        expect(name.toSnakeCase()).to.be.equal('hoge_moge');
    });

    it('camel case to chain case', function () {
        var name = new FormedName('hogeMoge');
        expect(name.toChainCase()).to.be.equal('hoge-moge');
    });
});
