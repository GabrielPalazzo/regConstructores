import './dotenv'

const config = {
  contratar : {
    host: process.env.URL_CONTRATAR,
    key: process.env.CONTRATAR_KEY
  },
  registro: {
    dataBase: process.env.MONGO_DATABASE_REGISTRO
  }
}

export default config