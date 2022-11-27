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
describe('deviceController getOne', function () {
    it('for valid device id', async function () {
        const response = await request(app)
            .get('/api/device/18')
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.id).to.be.equal(18);
        expect(response.body.name).to.be.equal('8A');
    });

    it('for not existing device id', async function () {
        const response = await request(app)
            .get('/api/device/100500')
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(404);
        expect(response.body.message).to.be.equal('Девайс не найден');
    });

    it('for invalid device id', async function () {
        const response = await request(app)
            .get('/api/device/abc')
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(404);
        expect(response.body.message).to.be.equal('Id девайса должен быть числом');
    });
});