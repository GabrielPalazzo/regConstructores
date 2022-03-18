import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: NextApiResponse) => {
  const {
    query: { id },
  } = req

  console.log('ingreso a la funcion')
  // Pagination: Fetch posts from before the input date or fetch from newest
  //const creatorId = req.query.by;
  const user = await req.db
    .collection('users')
    .findOne({"id": id
      }
    );
  res.send({user});
});


export default handler