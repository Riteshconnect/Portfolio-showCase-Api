import multer from 'multer';
import path from 'path';

// 1. Set up storage for uploaded files
const storage = multer.diskStorage({
  // Set the destination directory
  destination: (req, file, cb) => {
    // We'll save files to a folder named 'uploads' in the root
    // Make sure this 'uploads' folder exists!
    cb(null, 'uploads/');
  },
  // Set the file name
  filename: (req, file, cb) => {
    // Create a unique file name to avoid overwrites
    // It will be: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// 2. Create a file filter to allow only images
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check file extension
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    // Reject the file
    cb(new Error('Error: Images Only!'));
  }
};

// 3. Initialize Multer with our configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter: fileFilter,
});

export default upload;