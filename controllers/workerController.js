const firebaseAdmin = require('firebase-admin');
const User = require('../model/User');
const moment = require('moment');

//auth check middleware
exports.auth_check = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in as owner');
        res.redirect('../login');
    }
};

//renders worker index with a list of assigned tasks------> TODO fetch tasks from firestore to check status
exports.worker_index = async (req, res, next) => {
    const db = firebaseAdmin.firestore();
    const requestsReference = db.collection('requests');
    const data = [];
    const id = req.user._id.toString();
    const startOfWeek = moment().startOf('week').unix();

    try {
        const snapshot = await requestsReference.where('worker', '==', id).get();
        if (snapshot.empty) {
            console.log('No data');
        } else {
            snapshot.docs.map(doc => {
                let dataobject = doc.data();
                if (dataobject.time >= startOfWeek) {
                    dataobject.object_id = doc.id;
                    data.push(dataobject);
                }
            })
        }
        data.sort((a, b) => { return a.time - b.time });
        res.render('worker/index', {
            user: req.user,
            data: data,
            title: 'Dodijeljeni zahtjevi'
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
};

//render task details of selected task
exports.task_by_id_get = async (req, res, next) => {
    const db = firebaseAdmin.firestore();
    const requestsReference = db.collection('requests');
    const usersReference = db.collection('users');

    try {
        const requestDoc = await requestsReference.doc(req.params.id).get();
        if (!requestDoc.exists) {
            return next(new Error('No Such Doc'));
        }
        const requestData = requestDoc.data();
        const userDoc = await usersReference.doc(requestData.uid).get();
        if (!userDoc.exists) {
            return next(new Error('No such file'));
        }
        const userData = userDoc.data();
        res.render('worker/task_details', {
            user: req.user,
            title: 'Zadatak ' + req.params.id,
            client: userData,
            request: requestData
        });
    } catch (error) {
        return next(error);
    }
};

//handle request to mark task as done -> remove from workers list and update in firestore
exports.task_by_id_post = async (req, res, next) => {
    const db = firebaseAdmin.firestore();
    const requestsReference = db.collection('requests');

    const workerId = req.user._id;
    const taskId = req.params.id;

    try {
        const workerQ = User.findByIdAndUpdate(workerId, {
            $pull: { tasks: taskId }
        }).exec();

        const requestQ = requestsReference.doc(taskId).update({ done: true });

        const results = [await workerQ, await requestQ];
        res.redirect('/worker');

    } catch (error) {
        return next(error);
    }
};