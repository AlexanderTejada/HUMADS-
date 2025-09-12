const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'assets', 'uploads');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
    } catch (err) {}
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Variables en memoria para draft
let draftContent = null;

// Rutas API
app.get('/api/content', async (req, res) => {
  try {
    const data = await fs.readFile('content.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el contenido' });
  }
});

// Ruta para obtener el draft (para vista previa)
app.get('/api/content/draft', async (req, res) => {
  try {
    if (draftContent) {
      res.json(draftContent);
    } else {
      // Si no hay draft, devolver contenido guardado
      const data = await fs.readFile('content.json', 'utf8');
      res.json(JSON.parse(data));
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el contenido draft' });
  }
});

// Ruta para actualizar draft (para vista previa en tiempo real)
app.post('/api/content/draft', (req, res) => {
  try {
    draftContent = req.body;
    res.json({ success: true, message: 'Draft actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el draft' });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    await fs.writeFile('content.json', JSON.stringify(req.body, null, 2));
    // Limpiar draft al guardar
    draftContent = null;
    res.json({ success: true, message: 'Contenido actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el contenido' });
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }
  
  const imageUrl = `/assets/uploads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl });
});

// Servir el panel de administración
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Panel de administración en http://localhost:${PORT}/admin`);
});