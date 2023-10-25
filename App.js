const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'articulosdb' 
});

conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

app.get('/api/articulos', (req, res) => {
    conexion.query('SELECT * FROM articulos', (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.json(filas);
        }
    });
});

app.get('/api/articulos/:id', (req, res) => {
    const id = req.params.id;
    conexion.query('SELECT * FROM articulos WHERE id = ?', [id], (error, fila) => {
        if (error) {
            throw error;
        } else {
            if (fila.length === 0) {
                res.status(404).json({ mensaje: 'Artículo no encontrado' });
            } else {
                res.json(fila[0]);
            }
        }
    });
});

app.post('/api/articulos', (req, res) => {
    const data = {
        id: req.body.id,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        stock: req.body.stock
    };
    const sql = "INSERT INTO articulos SET ?";
    conexion.query(sql, data, function (error, resultados) {
        if (error) {
            throw error;
        } else {
            res.json({ mensaje: 'Artículo creado', id: resultados.insertId });
        }
    });
});

app.on('exit', function () {
    conexion.end(function (error) {
        if (error) {
            throw error;
        } else {
            console.log('Conexión a la base de datos cerrada');
        }
    });
});

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, function () {
    console.log('Servidor OK en puerto ' + puerto);
});
