const pool = require('../config/dbConfig');
const passwordService = require('../services/passwordService');

class UserModel {
    constructor({ id, name, username, birthDate, password, email, sex, status, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.birthDate = birthDate;
        this.password = password;
        this.email = email;
        this.sex = sex;
        this.status = status ?? 'Ativado';
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt;
    }

    async create() {
        try {
            const hashedPassword = await passwordService.hashPassword(this.password);

            const sql = 'INSERT INTO user (name, username, birthDate, password, email, sex, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [this.name, this.username, this.birthDate, hashedPassword, this.email, this.sex, this.status, this.createdAt, this.updatedAt];
            const [rows, fields] = await pool.query(sql, values);

            return rows.insertId;
        } catch (error) {
            console.error(error);
            throw new Error(`Ocorreu um erro ao cadastrar o usuário.`);
        }
    }

    async update() {
        try {
            const hashedPassword = await passwordService.hashPassword(this.password);
            const updatedAt = new Date();

            const sql = 'UPDATE user SET name = ?, username = ?, birthDate = ?, password = ?, email = ?, sex = ?, status = ?, createdAt = ?, updatedAt = ? WHERE id = ?';
            const values = [this.name, this.username, this.birthDate, hashedPassword, this.email, this.sex, this.status, this.createdAt, updatedAt, this.id];
            const [rows, fields] = await pool.query(sql, values);

            return rows.affectedRows > 0;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao atualizar o usuário.');
        }
    }

    async delete() {
        try {
            const sql = 'DELETE FROM user WHERE id = ?';
            const [rows, fields] = await pool.query(sql, [this.id]);

            return rows.affectedRows > 0;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao excluir o usuário.');
        }
    }

    static async findById(id) {
        try {
            const sql = 'SELECT * FROM user WHERE id = ?';
            const [rows, fields] = await pool.query(sql, [id]);

            if (rows.length === 0) {
                return null;
            }

            const userData = rows[0];
            const user = new UserModel(userData);
            return user;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao buscar o usuário por ID.');
        }
    }

    static async findAll() {
        try {
            const sql = 'SELECT * FROM user';
            const [rows, fields] = await pool.query(sql);

            const users = rows.map(userData => {
                const user = new UserModel(userData);
                return user;
            });

            return users;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao buscar todos os usuários.');
        }
    }

    static async findByUsernameOrEmail(usernameOrEmail) {
        try {
            const sql = 'SELECT * FROM user WHERE email = ? OR username = ?';
            const [rows, fields] = await pool.query(sql, [usernameOrEmail, usernameOrEmail]);

            if (rows.length === 0) {
                return null;
            }

            const userData = rows[0];
            const user = new UserModel(userData);

            return user;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao buscar o usuário por nome de usuário ou email.');
        }
    }

}

module.exports = UserModel;