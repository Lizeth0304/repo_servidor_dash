const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const { format } = require('date-fns'); // Importa la función format de date-fns


const app = express();
const port = 3000; // Cambia el puerto si es necesario

app.use(cors());
app.use(bodyParser.json());

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost', // Cambia a la dirección de tu base de datos MySQL
  user: 'root',
  password: '',
  database: 'tramite_une',
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.message);
  } else {
    console.log('Conexión a la base de datos establecida');
  }
});

// Ruta para manejar la inserción de datos
app.post('/guardar-datos', (req, res) => {
  const { expediente, c, s,remitido,documento,mes,fechaR,asunto, fecha, plazos,folios,observaciones,derivadoa,viceacade, viceinve,secre,diga,posgrado,ciencias,direccion,oficina,ciencias2,direccion2,oficina2,otro2,otro, cc2, envio, respuesta1,cc4,documento2, respuesta3, cc6,documento3,respuesta4,documentoF } = req.body;


// Construir derivadoA
const derivadoA = 
(viceacade ? 'Vicerrectorado Académico' : '') +
(viceinve ? 'Vicerrectorado de Investigación' : '') +
(secre ? 'Secretaría General' : '') +
(diga ? 'Dirección General de Administración' : '') +
(posgrado ? 'Escuela de Posgrado' : '') +
(ciencias ? 'Facultad ' + ciencias2 : '') +
(direccion ? 'Dirección '+direccion2:'')+
(oficina ? 'Oficina '+oficina2:'')+
(otro ? 'Otro: ' + otro2 : '');

  // Convierte la fecha al formato deseado (día, mes y año)

  const formattedFecha = new Date(fecha + 'T00:00:00Z').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
  
  const envioF="H.E. N°"+envio+"-2023-R-UNE";

  
// Luego, inserta derivadoA en la base de datos

  const sql = 'INSERT INTO hojas_rectorado (n_exp, c, s, dependencia,documentoR, mes, fechaR, asunto, fechaD, plazos, dr, obs, derivadoa, cc1, documentoD, respuesta, cc2, documento2, respuesta3, cc3, documento3,respuesta4, documentoF) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  db.query(sql, [expediente, c,s,remitido,documento,mes,fechaR, asunto, formattedFecha, plazos,folios,observaciones,derivadoA,cc2,envioF,respuesta1,cc4,documento2,respuesta3,cc6,documento3,respuesta4,documentoF], (err, result) => {
    if (err) {
      console.error('Error al insertar datos: ' + err.message);
      res.status(500).json({ message: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Datos guardados correctamente' });
    }
  });
});


// Ruta para obtener datos guardados
app.get('/datos-guardados', (req, res) => {
    const sql = 'SELECT * FROM hojas_rectorado'; // Reemplaza 'h_envio' con el nombre de tu tabla
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error al obtener datos: ' + err.message);
        res.status(500).json({ message: 'Error interno del servidor' });
      } else {
        res.json(result);
      }
    });
  });

  // Ruta para eliminar una fila por ID
app.delete('/datos-guardados/:id', (req, res) => {
  const id = req.params.id;

  // Elimina la fila de la tabla correspondiente en tu base de datos
  const sql = 'DELETE FROM hojas_rectorado WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(`Error al eliminar fila con ID ${id}: ` + err.message);
      res.status(500).json({ message: 'Error interno del servidor' });
    } else {
      res.json({ message: `Fila con ID ${id} eliminada correctamente` });
    }
  });
});
// Ruta para actualizar datos
app.put('/datos-guardados', (req, res) => {
  const updatedData = req.body;

  if (!Array.isArray(updatedData)) {
    return res.status(400).json({ message: 'Se esperaba un arreglo de datos para actualizar.' });
  }

  updatedData.forEach((datum) => {
    const { id,expediente, c, s,remitido,documento,mes,fechaR,asunto, fecha, plazos,folios,observaciones,derivadoa, cc1, envio, respuesta,cc2,documento2, respuesta3, cc3,documento3,respuesta4,documentoF } = datum;

    const sql = 'UPDATE hojas_rectorado SET n_exp = ?, c = ?, s = ?, dependencia = ?, documentoR = ?, mes = ?, fechaR=?, asunto = ?,fechaD=?,plazos=?,dr=?, obs = ?,derivadoa=?, cc1=?,documentoD=?,respuesta=?, cc2=?, documento2=?, respuesta3=?, cc3=?, documento3=?, respuesta4=?, documentoF=? WHERE id = ?';
    db.query(
      sql,
      [expediente, c, s,remitido,documento,mes,fechaR,asunto, fecha, plazos,folios,observaciones,derivadoa, cc1, envio, respuesta,cc2,documento2, respuesta3, cc3,documento3,respuesta4,documentoF, id],
      (err, result) => {
        if (err) {
          console.error(`Error al actualizar datos con ID ${id}: ` + err.message);
        } else {
          console.log(`Datos con ID ${id} actualizados en la base de datos`);
        }
      }
    );
  });

  res.json({ message: 'Datos editados actualizados correctamente' });
});

// Ruta para manejar la inserción de datos
app.post('/guardar-datos2', (req, res) => {
  const { envio2, fecha2, folios2, documento2, remitido2, asunto2, observaciones2,cc1,cc2,cc3 } = req.body;

  const formattedFecha2 = new Date(fecha2 + 'T00:00:00Z').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
  

  const sql = 'INSERT INTO hojas_rectorado (tramite, fechaD, folios, documento, remitido, asunto, observaciones, cc1, cc2, cc3) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)';
  db.query(sql, [envio2, formattedFecha2, folios2, documento2, remitido2, asunto2, observaciones2,cc1,cc2,cc3], (err, result) => {
    if (err) {
      console.error('Error al insertar datos: ' + err.message);
      res.status(500).json({ message: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Datos guardados correctamente' });
    }
  });
});

// Ruta para obtener datos guardados
app.get('/datos-guardados2', (req, res) => {
  const sql = 'SELECT * FROM hojas_rectorado'; // Reemplaza 'h_envio' con el nombre de tu tabla
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener datos: ' + err.message);
      res.status(500).json({ message: 'Error interno del servidor' });
    } else {
      res.json(result);
    }
  });
});

// Ruta para eliminar una fila por ID
app.delete('/datos-guardados2/:id', (req, res) => {
const id = req.params.id;

// Elimina la fila de la tabla correspondiente en tu base de datos
const sql = 'DELETE FROM hojas_rectorado WHERE id = ?';
db.query(sql, [id], (err, result) => {
  if (err) {
    console.error(`Error al eliminar fila con ID ${id}: ` + err.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  } else {
    res.json({ message: `Fila con ID ${id} eliminada correctamente` });
  }
});
});
// Ruta para actualizar datos
app.put('/datos-guardados2', (req, res) => {
const updatedData = req.body;

if (!Array.isArray(updatedData)) {
  return res.status(400).json({ message: 'Se esperaba un arreglo de datos para actualizar.' });
}

updatedData.forEach((datum) => {
  const { id, envio, fechaD, folios, documento, remitido, asunto, observaciones, cc1, cc2, cc3 } = datum;

  const sql = 'UPDATE hojas_rectorado SET tramite = ?, fechaD = ?, folios = ?, documento = ?, remitido = ?, asunto = ?, observaciones = ?, cc1 = ?, cc2 =?, cc3=? WHERE id = ?';
  db.query(
    sql,
    [envio, fechaD, folios, documento, remitido, asunto, observaciones,cc1,cc2,cc3, id],
    (err, result) => {
      if (err) {
        console.error(`Error al actualizar datos con ID ${id}: ` + err.message);
      } else {
        console.log(`Datos con ID ${id} actualizados en la base de datos`);
      }
    }
  );
});
res.json({ message: 'Datos editados actualizados correctamente' });
});

// Ruta para manejar la inserción de datos
app.post('/guardar-datos3', (req, res) => {
  
  const { expediente, c, s, remitido2, documento2, mes, fechaR,asunto2,fecha2,plazos,folios2, observaciones2,cc2,envio2,respuesta1,cc3,documento22, respuesta3, cc4,documento3,respuesta4,documentoF,derivadoA } = req.body;

  // Convierte la fecha al formato deseado (día, mes y año)
  const formattedFecha2 = new Date(fecha2 + 'T00:00:00Z').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
  
  const envioF2="H.T. N°"+envio2+"-2023-R-UNE";
  const sql = 'INSERT INTO hojas_rectorado (n_exp, c, s, dependencia,documentoR, mes, fechaR, asunto, fechaD, plazos, dr, obs, derivadoa, cc1, documentoD, respuesta, cc2, documento2, respuesta3, cc3, documento3,respuesta4, documentoF) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  db.query(sql, [expediente,c,s,remitido2,documento2,mes,fechaR,asunto2, formattedFecha2,plazos, folios2,observaciones2,derivadoA,cc2,envioF2,respuesta1,cc3,documento22,respuesta3,cc4,documento3,respuesta4,documentoF], (err, result) => {
    if (err) {
      console.error('Error al insertar datos: ' + err.message);
      res.status(500).json({ message: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Datos guardados correctamente' });
    }
  });
});

// Ruta para obtener datos guardados
app.get('/datos-guardados3', (req, res) => {
  const sql = 'SELECT * FROM hojas_rectorado'; // Reemplaza 'h_envio' con el nombre de tu tabla
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener datos: ' + err.message);
      res.status(500).json({ message: 'Error interno del servidor' });
    } else {
      res.json(result);
    }
  });
});

// Ruta para eliminar una fila por ID
app.delete('/datos-guardados3/:id', (req, res) => {
const id = req.params.id;

// Elimina la fila de la tabla correspondiente en tu base de datos
const sql = 'DELETE FROM hojas_rectorado WHERE id = ?';
db.query(sql, [id], (err, result) => {
  if (err) {
    console.error(`Error al eliminar fila con ID ${id}: ` + err.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  } else {
    res.json({ message: `Fila con ID ${id} eliminada correctamente` });
  }
});
});
// Ruta para actualizar datos
app.put('/datos-guardados3', (req, res) => {
const updatedData = req.body;

if (!Array.isArray(updatedData)) {
  return res.status(400).json({ message: 'Se esperaba un arreglo de datos para actualizar.' });
}

updatedData.forEach((datum) => {
  const { id, envio, fechaD, folios, documento, remitido, asunto, observaciones, cc1, cc2, cc3 } = datum;

  const sql = 'UPDATE hojas_rectorado SET tramite = ?, fechaD = ?, folios = ?, documento = ?, remitido = ?, asunto = ?, observaciones = ?, cc1 = ?, cc2 =?, cc3=? WHERE id = ?';
  db.query(
    sql,
    [envio, fechaD, folios, documento, remitido, asunto, observaciones,cc1,cc2,cc3, id],
    (err, result) => {
      if (err) {
        console.error(`Error al actualizar datos con ID ${id}: ` + err.message);
      } else {
        console.log(`Datos con ID ${id} actualizados en la base de datos`);
      }
    }
  );
});
res.json({ message: 'Datos editados actualizados correctamente' });
});


app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
