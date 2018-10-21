var app = require('./config/custom-express')();
let port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log('Servidor ligado'+port);
}); 



 
