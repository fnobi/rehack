const fs = require('fs');

const expect = require('chai').expect;
const mkdirp = require('mkdirp');
const del = require('del');

const Rehack = require('../');

describe('Rehack', () => {
    const TMP_DIR = 'tmp';

    before((done) => {
        mkdirp(TMP_DIR, done);
    });
    
    after((done) => {
        del(TMP_DIR).then(() => {
            done();
        });
    });
    
    it('rename basename', (done) => {
        fs.writeFileSync(TMP_DIR + '/hogeHoge.txt');
        fs.writeFileSync(TMP_DIR + '/hoge-hoge.js');
        fs.writeFileSync(TMP_DIR + '/hoge_hoge.css');
        
        const rehack = new Rehack('hogeHoge', 'mogeMoge', {
            cwd: TMP_DIR,
            useGitCmd: false
        });
        
        rehack.on('error', (e) => {
            throw new Error(e);
        });
        
        rehack.on('end', () => {
            expect(fs.existsSync(TMP_DIR + '/mogeMoge.txt')).to.be.ok;
            expect(fs.existsSync(TMP_DIR + '/moge-moge.js')).to.be.ok;
            expect(fs.existsSync(TMP_DIR + '/moge_moge.css')).to.be.ok;
            done();
        });
        
        rehack.startWalking();
    });
    
    it('rename dirname', () => {
        
    });
});
