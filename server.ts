import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Initialize Gemini client on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Ensure public/videos and public/audio-cache directories exist
const videosDir = path.join(__dirname, 'public', 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const audioCacheDir = path.join(__dirname, 'public', 'audio-cache');
if (!fs.existsSync(audioCacheDir)) {
  fs.mkdirSync(audioCacheDir, { recursive: true });
}

const customAudioDir = path.join(__dirname, 'public', 'custom-audio');
if (!fs.existsSync(customAudioDir)) {
  fs.mkdirSync(customAudioDir, { recursive: true });
}

const customSongAudiosDir = path.join(customAudioDir, 'songs');
if (!fs.existsSync(customSongAudiosDir)) {
  fs.mkdirSync(customSongAudiosDir, { recursive: true });
}

const customImagesDir = path.join(__dirname, 'public', 'custom-images');
if (!fs.existsSync(customImagesDir)) {
  fs.mkdirSync(customImagesDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const songId = req.params.songId || 'video';
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, `${songId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
});

const audioUploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, customAudioDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp3';
    cb(null, `saludo${ext}`);
  },
});

const uploadAudio = multer({
  storage: audioUploadStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

const imageUploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, customImagesDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `edu_hero${ext}`);
  },
});

const uploadImage = multer({
  storage: imageUploadStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

const songAudioUploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, customSongAudiosDir);
  },
  filename: (req, file, cb) => {
    const songId = req.params.songId || 'song';
    const ext = path.extname(file.originalname) || '.mp3';
    cb(null, `${songId}${ext}`);
  },
});

const uploadSongAudio = multer({
  storage: songAudioUploadStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

// JSON and URL-encoded body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dedicated HTTP 206 Partial Content streaming for mobile video compatibility (iOS Safari & Android)
app.get('/videos/:filename', (req, res) => {
  const filePath = path.join(videosDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Video no encontrado');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// Static assets
app.use('/videos', express.static(videosDir));
app.use('/audio-cache', express.static(audioCacheDir));
app.use('/custom-audio', express.static(customAudioDir));
app.use('/custom-images', express.static(customImagesDir));

// API routes
app.get('/api/videos', (_req, res) => {
  try {
    const files = fs.readdirSync(videosDir);
    const videoMap: Record<string, string> = {};
    files.forEach((file) => {
      const name = path.parse(file).name;
      videoMap[name] = `/videos/${file}`;
    });
    res.json({ success: true, videos: videoMap });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Upload endpoint for specific song ID
app.post('/api/videos/:songId', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se envió ningún archivo de video' });
    }
    const relativeUrl = `/videos/${req.file.filename}`;
    res.json({
      success: true,
      songId: req.params.songId,
      url: relativeUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Bulk upload endpoint
app.post('/api/videos-batch', upload.array('videos', 20), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const uploaded = (files || []).map((f) => ({
      originalName: f.originalname,
      filename: f.filename,
      url: `/videos/${f.filename}`,
    }));
    res.json({ success: true, uploaded });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Custom creator voice greeting endpoints
app.get('/api/custom-greeting', (_req, res) => {
  try {
    if (!fs.existsSync(customAudioDir)) {
      return res.json({ hasCustomGreeting: false, url: null });
    }
    const files = fs.readdirSync(customAudioDir);
    const saludoFile = files.find(f => f.startsWith('saludo'));
    if (saludoFile) {
      return res.json({ hasCustomGreeting: true, url: `/custom-audio/${saludoFile}?t=${Date.now()}` });
    }
    res.json({ hasCustomGreeting: false, url: null });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/custom-greeting', uploadAudio.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No audio file sent' });
    }
    res.json({ success: true, url: `/custom-audio/${req.file.filename}?t=${Date.now()}` });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Custom Hero Image of Edu Cadito
app.get('/api/custom-hero-image', (_req, res) => {
  try {
    if (!fs.existsSync(customImagesDir)) {
      return res.json({ hasCustomImage: false, url: null });
    }
    const files = fs.readdirSync(customImagesDir);
    const heroFile = files.find(f => f.startsWith('edu_hero'));
    if (heroFile) {
      return res.json({ hasCustomImage: true, url: `/custom-images/${heroFile}?t=${Date.now()}` });
    }
    res.json({ hasCustomImage: false, url: null });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/custom-hero-image', uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file sent' });
    }
    res.json({ success: true, url: `/custom-images/${req.file.filename}?t=${Date.now()}` });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.delete('/api/custom-hero-image', (_req, res) => {
  try {
    if (fs.existsSync(customImagesDir)) {
      const files = fs.readdirSync(customImagesDir);
      files.forEach(f => {
        if (f.startsWith('edu_hero')) {
          fs.unlinkSync(path.join(customImagesDir, f));
        }
      });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Custom Song Audios (sung by the creator)
app.get('/api/custom-song-audios', (_req, res) => {
  try {
    if (!fs.existsSync(customSongAudiosDir)) {
      return res.json({ songAudios: {} });
    }
    const files = fs.readdirSync(customSongAudiosDir);
    const audioMap: Record<string, string> = {};
    files.forEach(file => {
      const name = path.parse(file).name;
      audioMap[name] = `/custom-audio/songs/${file}?t=${Date.now()}`;
    });
    res.json({ success: true, songAudios: audioMap });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.post('/api/custom-song-audio/:songId', uploadSongAudio.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No audio file sent' });
    }
    res.json({ success: true, songId: req.params.songId, url: `/custom-audio/songs/${req.file.filename}?t=${Date.now()}` });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// AI TTS Voice of Educadito: natural, warm, friendly 6-year-old child voice
app.post('/api/speak', async (req, res) => {
  try {
    const { text, isSinging = false, style } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    const cleanText = text.trim();
    const hash = crypto.createHash('md5').update(`${cleanText}_${isSinging ? 'sing' : 'talk'}`).digest('hex');
    const audioFilename = `${hash}.wav`;
    const audioFilePath = path.join(audioCacheDir, audioFilename);
    const publicAudioUrl = `/audio-cache/${audioFilename}`;

    // Return cached audio if already generated
    if (fs.existsSync(audioFilePath)) {
      return res.json({ success: true, audioUrl: publicAudioUrl, cached: true });
    }

    // Generate natural voice audio using Gemini TTS
    const speechStyle = style || (isSinging
      ? 'Warm, sweet, cheerful, melodious 6-year-old boy singing playfully with joyful cadence, tender and friendly, high clarity in Spanish'
      : 'Affectionate, joyful, friendly 6-year-old child greeting and talking with a bright smile, natural human emotion, lively and warm in Spanish');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: speechStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // 'Puck' produces an energetic, expressive, youthful voice
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio data received from Gemini TTS');
    }

    const audioBuffer = Buffer.from(base64Audio, 'base64');
    fs.writeFileSync(audioFilePath, audioBuffer);

    return res.json({
      success: true,
      audioUrl: publicAudioUrl,
      cached: false,
    });
  } catch (error) {
    console.error('TTS Generation error:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Edu Cadito server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
