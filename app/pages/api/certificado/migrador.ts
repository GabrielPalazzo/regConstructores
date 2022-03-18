import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import https from 'https'
import axios from 'axios'

const handler = nextConnect();

handler.use(middleware);

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

const doPreflight = async  (key) => {
  try {
    const result = await axios.get(`${process.env.URL_CONTRATAR}/API/Proveedores/ObtenerDatosConstancia?id=11444fecha=Sun%20Mar%2007%202021`, {
      httpsAgent: httpsAgent,
      headers: {
        "Cookie": key
      }
    })
    return {
      success: true,

    }
  }catch(error){
    console.log(error)
    return {
      success: false, 
      error
    }
  }
}

handler.get(async (req: any, res: NextApiResponse) => {
  if (req.user.Role.filter(r => 'JEFE REGISTRO').length === 0)
    res.status(401).send('Forbidden')


  
  const processInfo= {}


  const db = await req.db


  processInfo['cookie']=req.headers.authorizationkey
  processInfo['preflight'] = await doPreflight(req.headers.authorizationkey)
  processInfo['contratarURL'] = process.env.URL_CONTRATAR
  processInfo['uploaded'] = []
  processInfo['notUploded']  =[]
  processInfo['errors'] = []
  // Pre Flight only for test 
  

  if (!processInfo['preflight'].success){
    res.status(500).json(processInfo)
    return 
  }

  let waitTill = null
  for (let i = 8000; i <= 17000; i++) {
    try {
      waitTill = new Date(new Date().getTime() + 1 * 300)
      const result = await axios.get(`${process.env.URL_CONTRATAR}/API/Proveedores/ObtenerDatosConstancia?id=${i}&fecha=Sun%20Mar%2007%202021`, {
        httpsAgent: httpsAgent,
        headers: {
          "Cookie": req.headers.authorizationkey
        }
      })

      if (result.data && result.data.EstadoProveedor ==='Inscripto' ) {
        db.collection('certificados')
          .save({
            '_id': i,
            ...result.data
          });

        processInfo['uploaded'].push({
          razonSocial: result.data.RazonSocial,
          cuit: result.data.NumeroCUIT
        })
      }else {
        processInfo['notUploded'].push(i)
      }


      while (waitTill > new Date(new Date().getTime())) { }

    } catch (err) {
      processInfo['errors'].push({
        id: i,
        err
      })
    }
  }

  res.status(200).json(processInfo)



});


export default handler