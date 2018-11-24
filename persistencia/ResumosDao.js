function Resumos(connection) {
    this._connection = connection;
}
Resumos.prototype.salvaResumoLivroTransaction = function (resumo, callback) {
    this._connection.begingTransaction(function (error) {
        if (error) {
            callback(error, null);
        }
        this._connection.query('insert into trabalho (tra_usu_id,tra_cat_id,tra_descricao,tra_texto,tra_dt_criacao,tra_visualizacoes) VALUES (?,?,?,?,now(),?);', [resumo[0], resumo[1], resumo[2], resumo[3], resumo[5], resumo[6]], function (error, result) {
            if (error) {
                return this._connection.rollback(function () {
                    callback(error, null);
                });
            }
            const lastId = result.insertId;
            this._connection.query('insert into livro (tra_id,liv_nome,liv_editora,liv_volume,liv_ano) VALUES(?,?,?,?);', lastId, resumo[7], resumo[8], resumo[9], function (error, result) {
                if (error) {
                    return this._connection.rollback(function () {
                        callback(error, null);
                    });
                }
                this._connection.commit(function (error) {
                    if (error) {
                        return this._connection.rollback(function () {
                            callback(error, null);
                        });
                    }
                    return callback(null, result);
                });
            });
        });
    });
}
Resumos.prototype.salvaResumoLivro = function (resumo, callback) {
    this._connection.query(`START TRANSACTION;
        insert into trabalho (tra_usu_id,tra_cat_id,tra_descricao,tra_texto,tra_dt_criacao,tra_visualizacoes) VALUES (?,?,?,?,now(),?);
        insert into livro (tra_id,liv_nome,liv_editora,liv_volume,liv_ano) VALUES(LAST_INSERT_ID(),?,?,?);
        COMMIT;`, [resumo[0], resumo[1], resumo[2], resumo[3], resumo[5], resumo[6], resumo[7], resumo[8], resumo[9]], callback);
}
Resumos.prototype.salvaResumoArtigo = function (resumo, callback) {
    this._connection.query(`START TRANSACTION; 
        insert into trabalho (tra_usu_id,tra_cat_id,tra_descricao,tra_texto,tra_dt_criacao,tra_visualizacoes) VALUES (?,?,?,?,now(),?); 
        insert into artigo(tra_id,art_titulo) VALUES (LAST_INSERT_ID(),?); 
        COMMIT;`, [resumo[0], resumo[1], resumo[2], resumo[3], resumo[5], resumo[6], resumo[7]], callback);
}
Resumos.prototype.listaResumosLivro = function (callback) {
    this._connection.query('select t.*,l.*,u.usu_nome from trabalho t inner join livro l on t.tra_id = l.tra_id inner join usuario u on t.tra_usu_id=u.usu_id', callback);
}
Resumos.prototype.listaResumosArtigo = function (callback) {
    this._connection.query('select t.*,a.*,u.usu_nome from trabalho t inner join artigo a on t.tra_id = a.tra_id inner join usuario u on t.tra_usu_id=u.usu_id', callback);
}
Resumos.prototype.listaId = function (id, callback) {
    this._connection.query('select * from trabalho where tra_id = ?', id, callback);
}
Resumos.prototype.editar = function (id, callback) {
    this._connection.query("update trabalho set trab_inf_post = 1 where usu_id = ? ", id, callback);
}
Resumos.prototype.listaResumosPendentes = function (callback) {
    this._connection.query('select * from trabalho where tra_verifica = 0', callback);
};
Resumos.prototype.listaCategorias = function (callback) {
    this._connection.query('select * from categoria', callback);
}
Resumos.prototype.resumosLivroCategoria = function (id, callback) {
    this._connection.query('select t.*, l.* from trabalho t inner join livro l on t.tra_id=l.tra_id where tra_cat_id = ?', id, callback);
}
Resumos.prototype.resumosAvaliacao = function (info, callback) {
    this._connection.query('insert into estrela set ?', info, callback);
}
Resumos.prototype.getAvaliacao = function (id, callback) {
    this._connection.query('select e.est_valor from estrela e where est_tra_id = ?', id, callback);
}
Resumos.prototype.newComent = function (usu_id, tra_id, comentario, callback) {
    this._connection.query('insert into comentario (comnt_usu_id,comnt_tra_id,comnt_comentario) VALUES (?,?,?)', [usu_id, tra_id, comentario], callback);
}
Resumos.prototype.getComent = function (comnt_trab_id, callback) {
    this._connection.query('select c.*,u.usu_nome,u.usu_sobrenome,u.usu_img_perfil from comentario c inner join trabalho t on c.comnt_tra_id=t.tra_id inner join usuario u on c.comnt_usu_id=u.usu_id where comnt_tra_id = ?', comnt_trab_id, callback);
}


module.exports = function () {
    return Resumos;
}

