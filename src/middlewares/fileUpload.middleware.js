import multer from "multer";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/products");
//   },
//   filename: (req, file, cb) => {
//     const parts = file.originalname.split(".");
//     const uniqueName = `${parts[0]}-${Date.now().toString()}.${parts[1]}`;
//     cb(null, uniqueName);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage });
export default upload;
