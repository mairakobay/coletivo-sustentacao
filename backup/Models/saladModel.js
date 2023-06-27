const pool = require('../config/dbConfig');

class SaladModel {
    constructor(codigo, nome, preco, tamanho) {
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.tamanho = tamanho;
    }

    static async buscarTodos() {
        const sql = 'SELECT * FROM salads';
        const [rows] = await pool.query(sql);
        
        const salads = rows.map(saladData => {
            const salad = new SaladModel(saladData);
            return salad;
        });

        return salads;
    }
}