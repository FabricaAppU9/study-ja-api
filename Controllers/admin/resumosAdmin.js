const AdminAuth= require("../../Middlewares/AdminToken-auth");
const ApiAuth = require('../../Middlewares/Api-auth');
module.exports=function(app){
    app.get('/resumos/resumosPendentes',AdminAuth,(req,res) => {
        let connection = app.persistencia.connectionFactory();
        connection.connect();
        let resumosDAO = new app.persistencia.ResumosDao(connection);
        resumosDAO.listaResumosPendentes((error,resultado)=>{
            if(!error){
                res.status(200);
                res.json(resultado);
            }else{
                res.status(404);
                res.json({
                    message: error
                });
            }
        })
    });
    app.patch('/resumos/resumo/:id',AdminAuth,(req,res,next)=>{
        const id= req.params.id;
        let validatorId = req.assert('id','id é obrigatório').notEmpty();
        let errors = req.validationErrors();
        if(errors){
            res.json(errors);
            res.status(422)
            return;
        }
        var connection = app.persistencia.connectionFactory();
        var resumosDao = new app.persistencia.ResumosDao(connection);
        resumosDao.editar(id,(erros,callback)=>{
            if(!erros){
                res.status(200).json({
                    Mensagem: "Resumo aprovado com sucesso",
                    resultado:callback
                });
            }
            else{
                res.status(400).json({
                    Mensagem: "Não foi possível aprovar este resumo",
                    error: erros
                });
            }
        });
    });
}