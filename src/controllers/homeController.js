let Contato = require('../models/ContatoModel');

exports.index = async (req, res, next) => { 
    let contatos = await Contato.buscar_contatos();
    res.render('index', { contatos }); 
};