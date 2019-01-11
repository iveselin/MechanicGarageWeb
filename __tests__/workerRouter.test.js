const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../model/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Testing worker routes - access without auth', () => {

    test('Worker homepage - it should redirect on GET - bad credentials', async () => {

        const response = await request(app).get('/worker')

        expect(response.statusCode).toBe(302);
        expect(response.redirect.valueOf()).toBeTruthy();
        expect(response.header['location'].includes('/login')).toBeTruthy();
    })

    test('Worker tasks page - it should redirect on GET - bad credentials', async () => {

        const response = await request(app).get('/worker/8udBnRAvCoyJLnH7sDkI')

        expect(response.statusCode).toBe(302);
        expect(response.redirect.valueOf()).toBeTruthy();
        expect(response.header['location'].includes('/login')).toBeTruthy();
    })

})

describe('Testing worker routes - access with auth', () => {
    let mongodb;
    let agent;
    let cookie;

    beforeAll(async () => {

        mongodb = new MongoMemoryServer();
        await mongoose.connect(await mongodb.getConnectionString(), { useNewUrlParser: true });
        await mongoose.connection.db.dropDatabase();
        await User.register(new User({ username: 'test@email.hr', tasks: ['12345', '6789'] }), 'password');

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

    afterAll(async () => {
        mongoose.disconnect();
        mongodb.stop();
    })

    test('Worker homepage - it should render list of requests on GET - good credentials', async () => {
        const response = await request(app).get('/worker').set('Cookie', cookie);

        expect(response.statusCode).toBe(200);
        expect(response.text.includes('href="/worker/tasks/12345"')).toBeTruthy();
        expect(response.text.includes('href="/worker/tasks/6789"')).toBeTruthy();
    })

    /* test('Worker task details page - it should render task details', async () => {

        const response = await request(app).get('/worker/tasks/12345').set('Cookie', cookie);

        
    }) */




})