import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: NextApiResponse) => {
  const {
    query: { cuit },
  } = req

  const tramite = await req.db
    .collection('tramites')
    .findOne({"cuit": cuit
      }
    );
  res.send({tramite});
});

export default handler