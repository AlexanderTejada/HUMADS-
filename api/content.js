// API para obtener contenido
// En Vercel no podemos escribir archivos, así que leemos el content.json estático
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'content.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      res.status(200).json(JSON.parse(fileContents));
    } catch (error) {
      res.status(500).json({ error: 'Error al leer contenido' });
    }
  } else if (req.method === 'POST') {
    // En Vercel no podemos guardar archivos permanentemente
    res.status(403).json({
      error: 'No se puede guardar en Vercel. Use administración local o una base de datos externa.',
      suggestion: 'Para guardar cambios, ejecute el CMS localmente y haga git push'
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}