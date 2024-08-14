const mongoose = require('mongoose'); 
const validator = require('validator'); /* importando o validador de e-mail */
const bcryptjs = require('bcryptjs'); /* importando o 'camuflador' de senha */

const LoginSchema = new mongoose.Schema({ /* esquema do meu BD com duas chaves: email e senha */
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema); 

class Login {
    constructor(body){
        this.body = body; /* captura e-mail e senha digitados pelo usuário no formulário */
        this.errors = []; /* flag de erros, caso tenha algum */
        this.user = null;
    }

    async login(){
        this.validar();

        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email }); /* encontra o usuário */

        if(!this.user){ /* verifica se o usuário existe */
            this.errors.push('Usuário não existe!');
            return;
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)){ /* verifica a senha */
            this.errors.push('Senha inválida!');
            this.user = null;
            
            return;
        }
    }

    async register(){ /* realiza o cadastro do usuário na base de dados após validação */
        this.validar();
        if(this.errors.length > 0) return; /* verifica se há algum erro no e-mail e/ou senha */

        await this.usuario_existente();
        if(this.errors.length > 0) return; 

        let salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.user = await LoginModel.create(this.body); /* registrando na base de dados */
    }

    async usuario_existente(){ /* verifica se já existe um usuário igual na base de dados */
        this.user = await LoginModel.findOne({ email: this.body.email });
        if(this.user) this.errors.push('Usuário já cadastrado na base de dados!');
    }   

    validar(){ /* método para validar as informações (e-mail e senha) do usuário */
        this.clean_up();

        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');

        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.errors.push('A senha precisa conter entre 3 e 50 caracteres.');
        }
    }

    clean_up(){ /* garante que tudo o que eu receber vai ser uma string */
        for(let key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
};

module.exports = Login;