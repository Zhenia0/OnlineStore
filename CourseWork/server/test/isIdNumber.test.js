const {expect} = require('chai');
const {isIdNumber} = require('../lib/validation');

describe('isIdNumber', function () {
    ['2', '100', 1, 10].forEach(id => {
        it(`positive ${id}`, function () {
            expect(isIdNumber(id)).to.be.true;
        });
    });

    ['a1',
        '1a',
        'aaa'
    ].forEach(id => {
        it(`negative ${id}`, function () {
            expect(isIdNumber(id)).to.be.false;
        });
    })
});