const firebaseAdmin = require('firebase-admin');
const User = require('../model/User');

//auth checking middleware
exports.auth_check = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == "owner") {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in as owner');
        res.redirect('../worker');
    }
};

//administration homepage
exports.admin_index = (req, res) => {
    res.render('admin/admin', { title: 'Restricted Garage access', user: req.user });
}

//additional worker/admin registration page
exports.register_worker_get = (req, res) => {
    res.render('register', { user: req.user });
};

//additional worker registration request process
exports.register_worker_post = async (req, res, next) => {
    var email = req.body.username;
    var password = req.body.password;

    // Validation
    req.checkBody('username', 'Email is required').notEmpty();
    req.checkBody('username', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors
        });

    } else {
        try {
            await User.register(new User({ username: email }), password);
            res.redirect('/administration');
        } catch (err) {
            return next(err);
        }
    }
};

exports.requests_get = async (req, res, next) => {
    const db = firebaseAdmin.firestore();
    const requestsReference = db.collection('requests');
    const data = [];

    try {
        const snapshot = await requestsReference.where('done', '==', false).get();
        if (snapshot.empty) {
            console.log('No data');
        } else {
            snapshot.docs.map(doc => {
                let dataobject = doc.data();
                dataobject.object_id = doc.id;
                data.push(dataobject);
            })
        }
        res.render('admin/requests', {
            user: req.user,
            data: data,
            title: 'Zahtjevi'
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

exports.request_by_Id_get = async (req, res, next) => {
    const db = firebaseAdmin.firestore();
    const requestsReference = db.collection('requests');
    const usersReference = db.collection('users');

    try {
        const workers = User.find().exec();
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

        res.render('admin/request_details', {
            user: req.user,
            request: requestData,
            client: userData,
            workers: await workers,
            title: 'Zahtjev ' + req.params.id
        });

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

exports.request_by_Id_post = async (req, res, next) => {
    const db = firebaseAdmin.firestore();
    const requestsReference = db.collection('requests');

    const workerId = req.body.worker;
    const taskId = req.params.id;

    try {
        const workerQ = User.findByIdAndUpdate(workerId, {
            $push: { tasks: taskId }
        }).exec();

        const taskQ = requestsReference.doc(taskId).update({ worker: workerId });

        const results = [await workerQ, await taskQ];
        res.redirect('/administration/requests');

    } catch (error) {
        return next(error);
    }
}

exports.schedule_get = (req, res) => {
    res.render('admin/schedule', { user: req.user, title: 'Raspored' });
}

exports.schedule_post = async (req, res, next) => {
    const db = firebaseAdmin.firestore();
    const scheduleReference = db.collection('schedule');

    const data = JSON.parse(JSON.stringify(req.body));
    
    try {
        await scheduleReference.doc().set(data);
        res.redirect("/administration");
    } catch (error) {
        return next(error);
    }
}