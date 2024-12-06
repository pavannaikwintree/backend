import path from "path";
import fs from "fs";

// returns static url
export const getStaticUrl = (req, fileName) => {
  // if (fileName.includes(" ")) {
  //   fileName = fileName.replace(" ", "%20");
  // }
  // return `${req.protocol}://${req.get("host")}/images/products/${fileName}`;
  return `public/images/products/${fileName}`;
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

// convert to date 

export const getFormattedDate = (dateStr) => {
  const formattedDate = new Date();
  const dateArr = dateStr.split('/');
  formattedDate.setDate(dateArr[0]);
  formattedDate.setMonth(dateArr[1]-1);
  formattedDate.setFullYear(dateArr[2]);
  
  return formattedDate;
  
}