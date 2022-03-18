import { MongoClient } from 'mongodb'
import _ from 'lodash'
import config from '../config'
(async () => {
    const client = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    
      await client.connect()
      const db = client.db(config.registro.dataBase)
    
      const tramites :Array<TramiteAlta> = await db.collection('tramites').find().toArray()

      for (let i = 0; i< tramites.length; i++) {
          let tramite = tramites[i]
          if (!tramite.subCategoria) {
                const certs = await db.collection('certificados').find({"tramite.cuit":tramite.cuit}).toArray()


                tramite.subCategoria = _.isEmpty(certs.filter(c =>c.tramite &&  c.tramite._id !== tramite._id)) ? 'INSCRIPCION' : 'ACTUALIZACION'

                await db.collection('tramites').save(tramite)
          }
      }

      process.exit()

})()