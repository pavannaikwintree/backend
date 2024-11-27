import path from "path";
import fs from "fs";

// returns static url
export const getStaticUrl = (req, fileName) => {
  if (fileName.includes(" ")) {
    fileName = fileName.replace(" ", "%20");
  }
  return `${req.protocol}://${req.get("host")}/images/products/${fileName}`;
};

//returns the local saved path of image
export const getLocalePath = (fileName) => {
  const from = "D:/backend/public/";
  const resolvedPath = path.resolve(from, "images", "products", fileName);
  return `${resolvedPath}`;
};

export const deleteImage = (localPath) => {
  fs.unlinkSync(localPath);
};
