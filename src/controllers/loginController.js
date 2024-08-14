const Login = require('../models/LoginModel'); 

exports.index = (req, res, next) => {
    if(req.session.user) return res.render('login-logado');
    return res.render('login');
};

exports.register = async (req, res, next) => {
    try {
        let login = new Login(req.body);
        await login.register();

        if(login.errors.length > 0){
            req.flash('errors', login.errors);

            req.session.save(() => { /* salvando a minha sessão */
                return res.redirect('/login');
            });

            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso!');

        req.session.save(() => { /* salvando a minha sessão */
            return res.redirect('/login');
        });

    } catch(e){
        console.log(e);
        return res.render('404');
    }
};

exports.login = async (req, res, next) => {
    try {
        let login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0){
            req.flash('errors', login.errors);

            req.session.save(() => { 
                return res.redirect('/login');
            });

            return;
        }

        req.flash('success', 'Você acessou sua conta com sucesso!');
        req.session.user = login.user;

        req.session.save(() => { 
            return res.redirect('/login');
        });

    } catch(e){
        console.log(e);
        return res.render('404');
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
};