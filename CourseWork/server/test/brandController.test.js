const request = require('supertest');
const {expect} = require('chai');
const createApp = require('../index').createApp;
const {Device} = require('../models/models');

const databaseMock = {
    User: {
        create(email) {
            return {id: 1, email: email, role: 'ADMIN'}
        },
        findOne(opts) {
            if (opts.where.email === 'Peter_Parker@gmail.com') {
                return {id: 6, email: 'Peter_Parker@gmail.com', password: '$2b$05$y9W7cvBuo808Zit2wQ/SK.seuOSTwPhZoF4eFTsQi.NkOG3rDdfUa'};
            }
        }
    },
    Basket: {
        create(opts) {
        },
        findOne(opts) {
            return {id: 6};
        }
    },
    Type: {
        create(type){
            return {name: type.name, id: 123}
        }
    },
    Device
}

const app = createApp(databaseMock);
describe('brandController', function () {
    it('getAll', async function () {
        const response = await request(app)
            .get('/api/brand')
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.length).to.be.greaterThan(0);
    });
});