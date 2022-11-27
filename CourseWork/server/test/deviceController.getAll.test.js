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
describe('deviceController getAll', function () {
    it('no brandId and no typeId', async function () {
        const response = await request(app)
            .get('/api/device')
            .set('page', '1')
            .set('limit', '2')
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.count).to.be.greaterThan(0);
    });

    it('valid brandId and no typeId', async function () {
        const response = await request(app)
            .get('/api/device')
            .set('brandId', '1')
            .set('page', '1')
            .set('limit', '2')
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.count).to.be.greaterThan(0);
    });

    it('no brandId and valid typeId', async function () {
        const response = await request(app)
            .get('/api/device')
            .set('typeId', '1')
            .set('page', '1')
            .set('limit', '2')
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.count).to.be.greaterThan(0);
    });

    it('valid brandId and valid typeId', async function () {
        const response = await request(app)
            .get('/api/device')
            .set('typeId', '2')
            .set('brandId', '1')
            .set('page', '1')
            .set('limit', '2')
            .set('Accept', 'application/json');
        expect(response.statusCode).to.be.equal(200);
        expect(response.body.count).to.be.greaterThan(0);
    });
});