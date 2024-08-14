const mongoose = require('mongoose'); 
const validator = require('validator'); 

const ContatoSchema = new mongoose.Schema({ 
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema); 

function Contato(body){
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.prototype.register = async function(){
    this.validar();

    if(this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.validar = function(){ 
    this.clean_up();

    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');
    if(!this.body.nome) this.errors.push('Nome é um campo obrigatório.');

    if(!this.body.email && !this.body.telefone){
        this.errors.push('Ao menos uma forma de contato (e-mail ou telefone) precisa ser enviado.');
    }
}

Contato.prototype.clean_up = function(){ 
    for(let key in this.body){
        if(typeof this.body[key] !== 'string'){
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone
    };
}

Contato.prototype.edit = async function(id){
    if(typeof id !== 'string') return;
    this.validar();

    if(this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
}

/* métodos estáticos: */

Contato.buscar_id = async (id) => { 
    if(typeof id !== 'string') return;
    let contato = await ContatoModel.findById(id);
    
    return contato;
};

Contato.buscar_contatos = async () => { 
    let contatos = await ContatoModel.find().sort({ criadoEm: -1 });
    return contatos;
};

Contato.delete = async (id) => { 
    if(typeof id !== 'string') return;

    let contato = await ContatoModel.findOneAndDelete({ _id: id });
    return contato;
};

module.exports = Contato;