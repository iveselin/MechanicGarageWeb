const workerController = require('../controllers/workerController');
const User = require('../model/User');
const mongoose = require('mongoose');

const mockUser = new User();
mockUser.username = 'username';
mockUser.password = 'password'
mockUser.role = 'worker';
mockUser.tasks = ['1', '2', '3'];


describe('Test of workerController', () => {

    test('Auth middleware - success', () => {
        const isAuthenticated = jest.fn(() => true);
        const next = jest.fn();
        const res = jest.fn();
        const req = {
            isAuthenticated
        }

        workerController.auth_check(req, res, next);

        expect(isAuthenticated).toBeCalled();
        expect(next).toBeCalled();
    });

    test('Auth middleware - fail', () => {
        const isAuthenticated = jest.fn(() => false)
        const redirect = jest.fn();
        const res = {
            redirect
        }
        const req = {
            isAuthenticated
        }

        workerController.auth_check(req, res, {});

        expect(isAuthenticated).toBeCalled();
        expect(redirect).toBeCalled();
        expect(redirect).toHaveBeenCalledWith('../login');
    })

    test('Worker index - GET', () => {
        const mockedQuery = jest.spyOn(User, 'findById').mockImplementation((id) => {
            const exec = jest.fn(() => Promise.resolve(mockUser));
            const docQ = {
                exec,
            }
            return docQ
        })
        jest.spyOn(User.findById(1), 'exec').mockImplementationOnce(() => Promise.resolve(mockUser));

        const req = {
            user: {
                role: 'owner',
                tasks: ['1', '2'],
                _id: 'asdf',
                username: 'ivan@ivan.hr'
            },
        }
        const render = jest.fn();
        const next = jest.fn();
        const res = {
            render,
        }

        workerController.worker_index(req, res, next);

        expect(render).toBeCalled();
    })




})