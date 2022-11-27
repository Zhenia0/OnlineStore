const {expect} = require('chai');
const {isEmailValid} = require('../lib/validation');

describe('isEmailValid', function () {
    ['textEmail@gmail.com',
        'peter_parker@gmail.com',
        'superman_petr@epam.com'
    ].forEach(email => {
        it(`positive ${email}`, function () {
            expect(isEmailValid(email)).to.be.true;
        });
    });

    ['@gmail.com',
        'peter_parker',
        'superman petr@epam.com'
    ].forEach(email => {
        it(`negative ${email}`, function () {
            expect(isEmailValid(email)).to.be.false;
        });
    })
});