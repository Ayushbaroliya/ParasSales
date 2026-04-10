const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to run middleware in serverless
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const cookies = req.headers.cookie;
  const isAuthenticated = cookies && cookies.includes('admin_session=authenticated');
  if (!isAuthenticated) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await runMiddleware(req, res, upload.single('file'));

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'paaras_sales' },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    Readable.from(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser is required for multer to work
  },
};
