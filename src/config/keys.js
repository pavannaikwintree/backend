export const keys = {
  port: process.env.PORT,
  dbUri: process.env.MONGODB_URI, //db connection URI
  cloundaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloundaryApiSecret: process.env.CLOUDINARY_API_SECRETE,
  cloundaryName: process.env.CLOUDINARY_NAME,
  jwt: {
    secret: process.env.JWT_SECRET,
    tokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  },
  cookie: {
    expiry: process.env.COOKIE_EXPIRY, //enter in days
  },
  nodeMailer: {
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    secure: process.env.SECURE,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
  },
  resetToken: {
    tokenExpiry: process.env.TEMP_TOKEN_EXPIRY,
  },
};
