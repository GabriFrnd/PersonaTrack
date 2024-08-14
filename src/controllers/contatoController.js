const Contato = require('../models/ContatoModel');

exports.index = (req, res, next) => {
    res.render('contato', {
        contato: {}
    });
};

exports.register = async (req, res, next) => {
    try {
        let contato = new Contato(req.body);
        await contato.register();

        if(contato.errors.length > 0){
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('/contato'));

            return;
        }

        req.flash('success', 'Contato registrado com sucesso!');
        req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));

        return;
    } catch(e){
        console.log(e);
        return res.render('404');
    }
};

exports.edit_index = async (req, res, next) => {
    if(!req.params.id) return res.render('404');
    
    let contato = await Contato.buscar_id(req.params.id);
    if(!contato) return res.render('404');

    res.render('contato', { contato });
};

exports.edit = async (req, res, next) => {
    try {
        if(!req.params.id) return res.render('404');

        let contato = new Contato(req.body);
        await contato.edit(req.params.id);

        if(contato.errors.length > 0){
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('/contato'));

            return;
        }

        req.flash('success', 'Contato editado com sucesso!');
        req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));

        return;
    } catch(e){
        console.log(e);
        res.render('404');
    }
};

exports.delete = async (req, res, next) => {
    if(!req.params.id) return res.render('404');
    
    let contato = await Contato.delete(req.params.id);
    if(!contato) return res.render('404');

    req.flash('success', 'Contato apagado com sucesso!');
    req.session.save(() => res.redirect(`back`));

    return;
};