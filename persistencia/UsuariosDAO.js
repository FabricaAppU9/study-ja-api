function Usuarios(connection) {
    this._connection = connection;
}

Usuarios.prototype.salvar = function (usuario, callback) {
    this._connection.query("insert into usuario set ?", usuario, callback);
}
Usuarios.prototype.detail = function (id, callback) {
    this._connection.query("SELECT `usu_id`, `usu_per_id`, `usu_nome`, `usu_sobrenome`, `usu_naturalidade`, `usu_sexo`, `usu_dat_nascimento`, `usu_email`, `usu_cpf`, `usu_ins_id`, `usu_not_email`, `usu_not_telefone`, `usu_dat_registro`, `usu_dat_atualizacao`, `usu_dat_autenticacao`, `usu_img_perfil` FROM `usuario` WHERE `usu_id`= ?", id, callback)
}
Usuarios.prototype.getHash = function (email, callback) {
    this._connection.query("select usu_senha,usu_id from usuario where usu_email = ?", email, callback);
}
Usuarios.prototype.verificar = function (email, senha, callback) {
    this._connection.query("select * from usuario where email = ? AND senha = ?", [email, senha], callback);
}
Usuarios.prototype.deletar = function (id, callback) {
    this._connection.query("UPDATE usuario SET usu_enable = false where usu_id = ? ", id, callback);
}
Usuarios.prototype.getUserInfo = function (id, callback) {
    this._connection.query("select usu_id, usu_nome, usu_sobrenome, usu_sexo, usu_dat_nascimento,usu_email,usu_cpf,usu_img_perfil, usu_descricao from usuario where usu_id=?", id, callback);
}
Usuarios.prototype.hasEmail = function (email, callback) {
    this._connection.query("select usu_id from usuario where usu_email = ?", email, callback);
}
Usuarios.prototype.getProfileInfo = function (username, callback){
    this._connection.query("select usu_id, usu_nome, usu_sobrenome, usu_username, usu_img_perfil, usu_descricao from usuario where usu_username = ?", username, callback);
}
module.exports = () => {
    return Usuarios;
} 