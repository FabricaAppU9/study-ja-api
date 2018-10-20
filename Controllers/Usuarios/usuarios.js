const jwt = require('jsonwebtoken');
const crypto= require('crypto');
const ApiAuth = require('../../Middlewares/Api-auth');
module.exports=(app) => {
    
    app.get("/",(req,res) => {
        res.json({
            message: "Hello Word"
        })
    });
    app.post("/usuarios/cadastro", ApiAuth,(req,res) =>{ 
       const usuario = req.body;
            let connection = app.persistencia.connectionFactory();
            connection.connect();
            let usuariosDAO = new app.persistencia.UsuariosDAO(connection);
            let mykey= crypto.createCipher('aes192','teste');
            let hash= mykey.update(req.body.usu_senha,'utf8','hex');
            hash+= mykey.final('hex');
            console.log(hash);
            usuario.usu_senha = hash;
            usuariosDAO.salvar(usuario,function(err,resultado){
                if(!err){
                    res.status(201);
                    res.json({
                        message: "usuário criado com sucesso",
                        resultado: resultado
                    });
                }else{
                        if(err.errno==1062){
                            res.status(400).json({
                            message: "usuário ja existente",
                            error: err
                        });
                    }else{
                        res.status(500).json({
                            message:err
                        });
                    }
                }
                connection.end();
            });
    });
    app.post("/usuarios/login",ApiAuth,(req,res,next)=>{
        let email = req.body.usu_email;
        let senha = req.body.usu_senha;
        let validate = false;
        let connection = app.persistencia.connectionFactory();
        connection.connect();
        let usuariosDAO = new app.persistencia.UsuariosDAO(connection);
        usuariosDAO.getHash(email,(err,resultado)=>{
            if(!err){ 
                let hash = resultado[0].usu_senha;
                console.log(resultado);
                let decipher = crypto.createDecipher('aes192','teste');
                console.log(decipher);
                let dec = decipher.update(hash,'hex','utf8');
                dec+= decipher.final('utf8');
                validate = senha==dec?true:false;
                if(!validate){
                    res.status(401).json({
                        message: "Auth Failed"
                    });  
                }if(validate){
                    const token =jwt.sign({
                        email: email,
                        userId : resultado[0].usu_id
                    },
                    "HJGLSFK20@255D",
                    {
                        expiresIn: "1h"
                    }
                );
                    res.status(200).json({
                        message:"Auth sucessful",
                        token: token
                    })
                }
            }
            else { 
               res.json({
                    messageDev:err,
                    message: "Auth Failed"
               });
            }   
            });
     
    });
    app.delete("/usuarios/:id",ApiAuth,(req,res,next)=>{
        let id = req.params.id;
        let connection = app.persistencia.connectionFactory();
        connection.connect;
        let UsuariosDAO = new app.persistencia.UsuariosDAO(connection);
        UsuariosDAO.deletar(id,(err,resultado)=>{
            if(resultado.affectedRows<1){
                res.status(404).json({
                    message: "usuário não encontrado"
                });
                return;
            }
             if(!err){
                res.status(200).json({
                    message: "usuário deletado com sucesso",
                    resultado: resultado
                });
            }else{
                res.json({
                    error: err,
                })
            }
        });
    });
    app.get("/usuario/:id",(req,res,next)=>{
        let id=req.params.id;
        let connection = app.persistencia.connectionFactory();
        connection.connect();
        let usuariossDAO = new app.persistencia.UsuariosDAO(connection);
        usuariossDAO.getUserInfo(id,(err,resultado)=>{
            if(!err){
                res.status(200).json({
                    resultado:resultado
                });
            }else{
                res.status(400).json({
                    MensagemDev:err,
                    mensagem: "usuário inexistente"
                });
            }
        });
    });
}