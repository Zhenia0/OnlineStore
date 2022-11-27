const {expect} = require('chai');
const {checkPasswordLength, checkEmailLength} = require('../lib/validation');

describe('checkPasswordLength', function () {
    it('Invalid partitioning num.1 (till 8) - 5 symbols', function () {
        expect(checkPasswordLength('12345')).to.be.false;
    });

    it('Valid boundary value - 8', function () {
        expect(checkPasswordLength('12345678')).to.be.true;
    });

    it('Valid partitioning - 10 symbols', function () {
        expect(checkPasswordLength('1234567890')).to.be.true;
    });

    it('Valid boundary value - 20 symbols', function () {
        expect(checkPasswordLength('12345678901234567890')).to.be.true;
    });

    it('Invalid partitioning num.2 (above 20) - 22 symbols', function () {
        expect(checkPasswordLength('12345678901234567890AB')).to.be.false;
    });

    it('Invalid boundary value - 21 symbols', function () {
        expect(checkPasswordLength('q12345678901234567890')).to.be.false;
    });

    it('Invalid boundary value - 7 symbols', function () {
        expect(checkPasswordLength('1234567')).to.be.false;
    });
});