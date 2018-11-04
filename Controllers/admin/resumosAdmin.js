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
}