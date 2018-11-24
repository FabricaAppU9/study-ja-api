const TokenAuth = require('../../Middlewares/Token-auth');
const AdminAuth = require('../../Middlewares/AdminToken-auth');
module.exports = function (app) {
    app.get('/resumos/livros', (req, res) => {
        var connection = app.persistencia.connectionFactory();
        connection.connect();
        var resumosDao = new app.persistencia.ResumosDao(connection);
        resumosDao.listaResumosLivro((err, resultado) => {
            if (!err) {
                console.log("aqui estou eu");
                res.json(resultado);
            }
            else
                console.log('Error while performing Query.' + err);
        });
        connection.end();
    });
    app.get('/resumos/artigos', (req, res) => {
        var connection = app.persistencia.connectionFactory();
        connection.connect();
        var resumosDao = new app.persistencia.ResumosDao(connection);
        resumosDao.listaResumosArtigo((err, resultado) => {
            if (!err) {
                console.log("aqui estou eu");
                res.json(resultado);
            }
            else
                console.log('Error while performing Query.' + err);
        });
        connection.end();
    });

    app.post('/resumos/livro', TokenAuth, (req, res) => {

        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            return res.json({
                message: 'Resumo não pode ser vazio!'
            });
        }
        const tra_usu_id = req.body.tra_usu_id;
        const tra_cat_id = req.body.tra_cat_id;
        const tra_descricao = req.body.tra_descricao;
        const tra_texto = req.body.tra_texto;
        const tra_dt_criacao = req.body.tra_dt_criacao;
        const tra_visualizacoes = req.body.tra_visualizacoes;
        const liv_nome = req.body.liv_nome;
        const liv_editora = req.body.liv_editora;
        const liv_ano = req.body.liv_ano;

        let resumo = [tra_usu_id, tra_cat_id, tra_descricao, tra_texto, tra_dt_criacao, tra_visualizacoes, liv_nome, liv_editora, liv_ano];

        var connection = app.persistencia.connectionFactory();
        var resumosDao = new app.persistencia.ResumosDao(connection);

        resumosDao.salvaResumoLivroTransaction(resumo, function (error, resultado) {
            if (error) {
                res.status(400).json({
                    error: error
                })
            }
            if (!error) {
                console.log('resumo criado');
                res.status(200).json(resultado);
            }
            else
                console.log("error performing POST" + error);
        });
        connection.end();
    });
    app.post('/resumos/artigo', TokenAuth, (req, res) => {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            return res.json({
                message: 'Resumo não pode ser vazio!'
            });
        }
        const tra_usu_id = req.body.tra_usu_id;
        const tra_cat_id = req.body.tra_cat_id;
        const tra_descricao = req.body.tra_descricao;
        const tra_texto = req.body.tra_texto;
        const tra_dt_criacao = req.body.tra_dt_criacao;
        const tra_visualizacoes = req.body.tra_visualizacoes;
        const art_titulo = req.body.art_titulo;
        let resumo = [tra_usu_id, tra_cat_id, tra_descricao, tra_texto, tra_dt_criacao, tra_visualizacoes, art_titulo];

        var connection = app.persistencia.connectionFactory();
        var resumosDao = new app.persistencia.ResumosDao(connection);

        resumosDao.salvaResumoArtigo(resumo, function (error, resultado) {
            if (error) {
                res.status(400).json({
                    error: error
                })
            }
            if (!error) {
                console.log('resumo criado');
                res.status(200).json(resultado);
            }
            else
                console.log("error performing POST" + error);
        });
        connection.end();
    });
    app.get('/resumos/resumo/:id', (req, res) => {
        const id = req.params.id;
        let validatorId = req.assert('id', 'id é obrigatório').notEmpty();
        let erros = req.validationErrors();
        if (erros) {
            res.json(erros);
            res.status(422);
            return;
        }
        var connection = app.persistencia.connectionFactory();
        var resumosDao = new app.persistencia.ResumosDao(connection);

        resumosDao.listaId(id, (error, resultado) => {
            if (JSON.stringify(resultado) === '[]') {
                res.status(200);
                res.json({
                    mensagem: 'Resumo não existente'
                });
                return;
            }
            if (!error) {
                res.send(resultado);
                res.status(200);
            }
            else {
                res.status(500);
                res.send(error);
            }
        });
        connection.end();
    });

    app.get('/resumos/categorias', (req, res, next) => {
        let connection = app.persistencia.connectionFactory();
        var resumosDao = new app.persistencia.ResumosDao(connection);
        resumosDao.listaCategorias((err, resultado) => {
            if (!err) {
                res.status(200).json({
                    resultado: resultado
                })
            } else {
                res.status(400).json({
                    error: err
                })
            }
        });
    });
    app.get('/resumos/categoria/:id', (req, res, next) => {
        let id = req.params.id
        let connection = app.persistencia.connectionFactory();
        var resumosDao = new app.persistencia.ResumosDao(connection);
        resumosDao.resumosLivroCategoria(id, (err, resultado) => {
            if (!err) {
                res.status(200).json({
                    Resumos: resultado
                });
            }
        });
    });
    app.post('/resumos/resumo/avaliar', TokenAuth, (req, res, next) => {
        let info = req.body;
        let connection = app.persistencia.connectionFactory();
        var resumosDao = new app.persistencia.ResumosDao(connection);
        resumosDao.resumosAvaliacao(info, (err, resultado) => {
            if (!err) {
                res.status(200).json({
                    Mensagem: "Resumo Avaliado com sucesso!"
                });
            } else {
                res.status(400).json({
                    Mensagem: "Não foi possível avaliar este resumo",
                    error: err
                });
            }
        });
    });
    app.get('/resumos/resumo/avaliado/:id', (req, res, next) => {
        let id = req.params.id;
        let connection = app.persistencia.connectionFactory();
        let resumosDao = new app.persistencia.ResumosDao(connection);

        resumosDao.getAvaliacao(id, (err, resultado) => {
            if (!err) {
                let avaliacoes = 0;
                console.log(resultado.length);
                for (let i = 0; i < resultado.length; i++) {
                    let numeros = (parseInt(resultado[i].est_valor));
                    avaliacoes += numeros;
                    console.log(avaliacoes);
                }
                let mediaAvaliacoes = avaliacoes / resultado.length;
                res.status(200).json({
                    resultado: mediaAvaliacoes
                });
            } else {
                res.status(400).json({
                    mensagem: "Não foi possível avaliar este resumo",
                    error: err
                })
            }
        });
    });
    app.post('/resumos/resumo/comentar', TokenAuth, (req, res, next) => {
        let tra_id = req.body.comnt_tra_id;
        let usu_id = req.body.comnt_usu_id;
        let coment = req.body.comnt_comentario;

        let connection = app.persistencia.connectionFactory();
        connection.connect();
        let resumosDao = new app.persistencia.ResumosDao(connection);
        resumosDao.newComent(usu_id, tra_id, coment, (err, resultado) => {
            if (!err) {
                res.status(200).json({
                    Mensagem: "Comentário feito com sucesso!",
                    resultado: resultado
                });
            } else {
                res.status(400).json({
                    Mensagem: "Não possível efetuar o comentário",
                    error: err
                });
            }
        });
    });
    app.get('/resumos/resumo/comentarios/:id', (req, res, nexte) => {
        let trab_id = req.params.id;

        let connect = app.persistencia.connectionFactory();
        let resumosDao = new app.persistencia.ResumosDao(connect);
        resumosDao.getComent(trab_id, (err, resultado) => {
            if (!err) {
                res.status(200).json({
                    comentarios: resultado
                });
            } else {
                res.status(400).json({
                    Mensagem: "Não foi possível carregar os comentários",
                    error: err
                });
            }
        });
    });
}