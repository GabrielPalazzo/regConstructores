import nextConnect from 'next-connect';
import middleware from '../../middlewares/middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = nextConnect();

handler.use(middleware);




handler.get(async (req: any, res: NextApiResponse) => {
  
  const tramites = await req.db
    .collection('tramites')
    .find({
      "$or":[
        {'creatorId.cuit': req.user.cuit},
        {"apoderados" : {"$elemMatch":{"cuit":parseInt(req.user.cuit)}}},
        {"apoderados" : {"$elemMatch":{"cuit":req.user.cuit}}}
      ]
    })
    .toArray();
  res.send({ tramites });
});


export default handler