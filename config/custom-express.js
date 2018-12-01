const express = require('express');
const bodyParser = require('body-parser');
const consign = require('consign');
const validator = require('express-validator');
const cors = require('cors');


//exportando objeto express e incluindo pasta Controllers, com as rotas
// ou endpoints dentro do objeto express
module.exports = function () {
    const app = express();

    const server = require('http').Server(app);
    const io = require('socket.io')(server);
    console.log("objeto express iniciado com sucesso");
    app.use(cors());
    //ensinar o objeto express a ler requisoes com o body em json
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(validator());

    app.use((req, res, next) => {
        req.io = io;
        next();
    });
    //criando error log para requisições erradas e/ou não encontradas;
    // app.use((req,res,next) => {
    //     const error = new Error('EndPoint não existente/encontrado');
    //     error.status= 404;
    //     next(error);
    // });
    // //passando error para o client da API
    // app.use((error,req,res,next)=>{
    //     console.log("entrei aqui");
    //     res.json({
    //         error:{
    //             message: error.message
    //         }
    //     })
    //     next();
    // })
    //lib consign faz com que incluimos uma pasta e seus conteudos
    //dentro de um objeto
    consign()
        .include('Controllers')
        .then('persistencia')
        .into(app);
    return app;
}