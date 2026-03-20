const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Multer destination cb called. File:', file.originalname);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const name = uniqueSuffix + path.extname(file.originalname);
        console.log('Multer filename cb called. Name:', name);
        cb(null, name);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        console.log('Multer fileFilter called. Mimetype:', file.mimetype);
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            console.log('File blocked by filter due to mimetype:', file.mimetype);
            cb(new Error('Apenas imagens são permitidas. Recebido: ' + file.mimetype));
        }
    }
});

router.post('/', authMiddleware, (req, res, next) => {
    console.log('Upload endpoint hit by user:', req.user.email);
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: 'Erro de upload: ' + err.message });
        } else if (err) {
            console.error('Unknown upload error:', err);
            return res.status(500).json({ error: 'Erro no servidor: ' + err.message });
        }
        
        console.log('Multer finished without errors. File inside req:', req.file ? req.file.originalname : 'none');
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
            }
            
            const imageUrl = `/uploads/${req.file.filename}`;
            res.status(200).json({ url: imageUrl });
        } catch (error) {
            console.error('Catch block error:', error);
            res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
        }
    });
});

module.exports = router;
