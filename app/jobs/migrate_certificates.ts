import config from '../config'
import axios from 'axios'
import https from 'https'
import { MongoClient } from 'mongodb';
import { MigrateService, Parser } from '../services/migrates.services'

(async () => {

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })
 
  const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect()
  const db = client.db(config.registro.dataBase)

  let waitTill 

  const listaCertificados = await db.collection('certificados').find({}).toArray()
  const service = new MigrateService(process.env.CONTRATAR_KEY)
  await service.dbUpd()

  listaCertificados.forEach(c => {
    waitTill = new Date(new Date().getTime() + 1 * 200)
    service.migrarProveedoresCerficado(c.Id)
    while (waitTill > new Date(new Date().getTime())) { }
    console.log(`Certificado migrado: ${c.Id}`)
  })

  process.exit()

})()