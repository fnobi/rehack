var expect = require('chai').expect;

var FormedName = require(__dirname + '/../lib/FormedName');

describe('FormedName', function () {
    it('parse chain case', function () {
        var name = new FormedName('hoge-moge');
        expect(name.toChainCase()).to.be.equal('hoge-moge');
        expect(name.toSnakeCase()).to.be.equal('hoge_moge');
        expect(name.toCamelCase()).to.be.equal('hogeMoge');
        expect(name.toClassName()).to.be.equal('HogeMoge');
    });
    
    it('parse snake case', function () {
        var name = new FormedName('hoge_moge');
        expect(name.toChainCase()).to.be.equal('hoge-moge');
        expect(name.toSnakeCase()).to.be.equal('hoge_moge');
        expect(name.toCamelCase()).to.be.equal('hogeMoge');
        expect(name.toClassName()).to.be.equal('HogeMoge');
    });
    
    it('parse camel case', function () {
        var name = new FormedName('hogeMoge');
        expect(name.toChainCase()).to.be.equal('hoge-moge');
        expect(name.toSnakeCase()).to.be.equal('hoge_moge');
        expect(name.toCamelCase()).to.be.equal('hogeMoge');
        expect(name.toClassName()).to.be.equal('HogeMoge');
    });

    it('parse class name', function () {
        var name = new FormedName('HogeMoge');
        expect(name.toChainCase()).to.be.equal('hoge-moge');
        expect(name.toSnakeCase()).to.be.equal('hoge_moge');
        expect(name.toCamelCase()).to.be.equal('hogeMoge');
        expect(name.toClassName()).to.be.equal('HogeMoge');
    });

    it('parse large chain case', function () {
        var name = new FormedName('HOGE-MOGE');
        expect(name.toChainCase()).to.be.equal('hoge-moge');
        expect(name.toSnakeCase()).to.be.equal('hoge_moge');
        expect(name.toCamelCase()).to.be.equal('hogeMoge');
        expect(name.toClassName()).to.be.equal('HogeMoge');
    });

    it('parse large snake case', function () {
        var name = new FormedName('HOGE_MOGE');
        expect(name.toChainCase()).to.be.equal('hoge-moge');
        expect(name.toSnakeCase()).to.be.equal('hoge_moge');
        expect(name.toCamelCase()).to.be.equal('hogeMoge');
        expect(name.toClassName()).to.be.equal('HogeMoge');
    });

    it('parse single word', function () {
        var name = new FormedName('hoge');
        expect(name.toChainCase()).to.be.equal('hoge');
        expect(name.toSnakeCase()).to.be.equal('hoge');
        expect(name.toCamelCase()).to.be.equal('hoge');
        expect(name.toClassName()).to.be.equal('Hoge');
    });
});
