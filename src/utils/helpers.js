// returns static url
export const getStaticUrl = (req, fileName) => {
  return `${req.protocol}://${req.get("host")}/images/products/${fileName}`;
};

//returns the local saved path of image
export const getLocalePath = (fileName) => {
  return `images/${fileName}`;
};
