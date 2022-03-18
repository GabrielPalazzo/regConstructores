import nextConnect from 'next-connect';
import { nanoid } from 'nanoid';
import middleware from '../../../middlewares/middleware';
import { NextApiResponse } from 'next';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: NextApiResponse) => {
  /*
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }
  */

  const { content } = req.body;

  if (!content) return res.status(400).send('You must write something');

  const user = {
    _id: nanoid(),
    content,
    createdAt: new Date(),
    creatorId: req.user._id,
  };

  await req.db.collection('users').insertOne(user);
  return res.send(user);
});

export default handler;
