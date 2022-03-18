import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: NextApiResponse) => {
  const {
    query: {  _id,cuit,token, id },
  } = req

 
  const tramite = await axios.get(`https://rnc.argentina.gob.ar/api/tramite/findById?_id=${_id}`,{
      headers: {
          Authorization: `Bearer ${token}`
      }
  })

  console.log(tramite.data)

  if (!client.isConnected()) await client.connect();
  const db = client.db(process.env.DB_NAME);
  await db
    .collection('tramites')
    .insertOne(tramite.data.tramite);
  res.send('Done')
  /*
  await req.db
    .collection('tramites')
    .save(tramite);*/

 
  
});

export default handler