import config from '../config'
import axios from 'axios'
import https from 'https'
import { MongoClient } from 'mongodb';

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

  // const tramite = await db.collection('tramites').findOne({"cuit":""})()
  

  /*
  listaCertificados.forEach(c => {
    waitTill = new Date(new Date().getTime() + 1 * 200)
    service.migrarProveedoresCerficado(c.Id)
    while (waitTill > new Date(new Date().getTime())) { }
    console.log(`Certificado migrado: ${c.Id}`)
  })*/

  for (let cuitProveedor of process.argv[2].split(',')) {
    
    const tramite :TramiteAlta = await db.collection('tramites').findOne({"cuit":cuitProveedor})
    const clean = (r) => {
      r.isOk=true
      r.review =''
      return r
    } 

    tramite.revisiones[0].reviews = tramite.revisiones[0].reviews.map(r => clean(r))
    await db.collection('tramites').save(tramite)
  }

  process.exit()

})()