const express = require('express');
const app = express();

app.use(express.json());

// Ruta para obtener contenido
app.get('/api/content', async (req, res) => {
  // En Vercel no podemos escribir archivos, usar base de datos o variables de entorno
  res.json({
    error: "Este endpoint necesita una base de datos. Vercel no permite escribir archivos localmente."
  });
});

module.exports = app;