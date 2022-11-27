const {expect} = require('chai');
const {checkEmailLength} = require('../lib/validation');

describe('checkEmailLength', function () {
    it('Invalid partitioning num.1 (till 8) - 6 symbols', function () {
        expect(checkEmailLength('q@t.ru')).to.be.false;
    });

    it('Valid boundary value - 8', function () {
        expect(checkEmailLength('qq@te.ru')).to.be.true;
    });

    it('Valid partitioning - 12 symbols', function () {
        expect(checkEmailLength('qwerty@pop.ru')).to.be.true;
    });

    it('Valid boundary value - 30 symbols', function () {
        expect(checkEmailLength('qwerty12345789123456@gmail.com')).to.be.true;
    });

    it('Invalid partitioning num.2 (above 30) - 32 symbols', function () {
        expect(checkEmailLength('qwerty12345789123456@gmail.commm')).to.be.false;
    });

    it('Invalid boundary value - 31 symbols', function () {
        expect(checkEmailLength('qwerty12345789123456@gmail.comm')).to.be.false;
    });

    it('Invalid boundary value - 7 symbols', function () {
        expect(checkEmailLength('qw@t.ru')).to.be.false;
    });
});