const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../model/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Testing administration routes - no auth', () => {

    test('Administration homepage - it should redirect on GET - no credentials', async () => {
        const response = await request(app).get('/administration')

        expect(response.statusCode).toBe(302);
        expect(response.redirect.valueOf()).toBeTruthy();
        expect(response.header['location'].includes('/worker')).toBeTruthy();
    })


})

describe('Testing administration routes - worker auth', () => {

    let mongodb;
    let agent;
    let cookie;

    beforeAll(async () => {

        mongodb = new MongoMemoryServer();
        await mongoose.connect(await mongodb.getConnectionString(), { useNewUrlParser: true });
        await mongoose.connection.db.dropDatabase();
        await User.register(new User({ username: 'test@email.hr', role: 'worker' }), 'password');

        agent = request.agent(app);
        await agent.post('/login')
            .send({
                username: 'test@email.hr',
                password: 'password'
            })
            .expect(302)
            .then((res) => {
                const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
                cookie = cookies.join(';');
            });
    })

    test('Administration homepage - it should redirect on GET - no credentials', async () => {
        const response = await request(app).get('/administration').set('Cookie', cookie);

        expect(response.statusCode).toBe(302);
        expect(response.redirect.valueOf()).toBeTruthy();
        expect(response.header['location'].includes('/worker')).toBeTruthy();
    })

})

describe('Testing administration routes - owner auth', () => {

    let mongodb;
    let agent;
    let cookie;

    beforeAll(async () => {

        mongodb = new MongoMemoryServer();
        await mongoose.connect(await mongodb.getConnectionString(), { useNewUrlParser: true });
        await mongoose.connection.db.dropDatabase();
        await User.register(new User({ username: 'test@email.hr', role: 'owner' }), 'password');

        agent = request.agent(app);
        await agent.post('/login')
            .send({
                username: 'test@email.hr',
                password: 'password'
            })
            .expect(302)
            .then((res) => {
                const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
                cookie = cookies.join(';');
            });
    })

    test('Administration homepage - it should render on GET - good credentials', async () => {
        const response = await request(app).get('/administration').set('Cookie', cookie);

        expect(response.statusCode).toBe(200);
        expect(response.text.includes('<title>Restricted Garage access</title>')).toBeTruthy();
    })

    test('Register page - it should render on GET - good credentials', async () => {
        const response = await request(app).get('/administration/register').set('Cookie', cookie);

        expect(response.statusCode).toBe(200);
        expect(response.text.includes('<form')).toBeTruthy();
    })

    test('Register page - it should save User on POST - good credentials', async () => {
        const countBefore = await User.count();

        const response = await request(app).post('/administration/register')
            .set('Cookie', cookie)
            .send({
                username: 'new@user.hr',
                password: 'newpass',
                password2: 'newpass'
            })

        expect(response.statusCode).toBe(302);

        expect(await User.count()).toEqual(countBefore + 1);
    })

    test('Schedule page - it should render on GET - good credentials', async () => {
        const response = await request(app).get('/administration/schedule').set('Cookie', cookie);

        expect(response.statusCode).toBe(200);
        expect(response.text.includes('type="checkbox"')).toBeTruthy();
    })

})