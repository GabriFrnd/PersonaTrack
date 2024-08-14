exports.middleware_global = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;

    next();
};

exports.check_csrf = (err, req, res, next) => { 
    if(err){
        return res.render('404');
    }

    next();
};

exports.csrf_middleware = (req, res, next) => { 
    res.locals.csrfToken = req.csrfToken(); 
    next();
};

exports.login_required = (req, res, next) => {
    if(!req.session.user){
        req.flash('errors', 'Você precisa fazer login.');
        req.session.save(() => res.redirect('/'));

        return;
    }

    next();
};