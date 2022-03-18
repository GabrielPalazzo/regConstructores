require('dotenv').config();

module.exports = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    DB_NAME: process.env.DB_NAME,
    WEB_URI: process.env.WEB_URI,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SESSION_SECRET: process.env.SESSION_SECRET,
    MODO: process.env.MODO,
    OPENID_AUTH: process.env.OPENID_AUTH,
    OPENID_USERDATA: process.env.OPENID_USERDATA,
    OPENID_LOGOUT: process.env.OPENID_LOGOUT,
    IPFS_NODE_HOST:process.env.IPFS_NODE_HOST,
    IPFS_NODE_PROTOCOL:process.env.IPFS_NODE_PROTOCOL,
    IPFS_NODE_PORT:process.env.IPFS_NODE_PORT,
    IPFS_NODE_APIPATH:process.env.IPFS_NODE_APIPATH
  },
};
