import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: NextApiResponse) => {
  /*
  if (req.user.Role.filter(r => 'CONTROLADOR').length ===0)
    res.status(401).send('Forbidden')*/

    const {
      query: { cuit },
    } = req

  const certificados  = await req.db
    .collection('certificadosOtorgados')
    .find({"tramite.cuit":cuit})
    .toArray();
  res.send({ certificados });
  
});


export default handler