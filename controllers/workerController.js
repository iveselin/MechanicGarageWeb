const firebaseAdmin = require('firebase-admin');
const User = require('../model/User');

exports.auth_check = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in as owner');
        res.redirect('../login');
    }
};

exports.worker_index = (req, res, next) => {
    User.findById(req.user._id).exec()
        .then(user => {
            res.render('worker/index', { title: 'Assigned tasks', user: req.user, data: user.tasks });
        })
        .catch(error => {
            return next(error);
        })
}

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
}

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
        console.log(results);
        res.redirect('/worker');

    } catch (error) {
        return next(error);
    }
}