export const keys = {
  port: process.env.PORT,
  dbUri: process.env.MONGODB_URI, //db connection URI
  cloundinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    name: process.env.CLOUDINARY_NAME,
  },
  jwt: {
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  },
  cookie: {
    expiry: process.env.COOKIE_EXPIRY,
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
  nodeEnv: process.env.NODE_ENV,
};
