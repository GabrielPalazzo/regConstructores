import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nextConnect();

handler.use(middleware);


handler.get(async (req: any, res: NextApiResponse) => {

  if (req.user.Role.filter(r => 'CONTROLADOR').length ===0)
   res.status(401).send('Forbidden')

  
  const tramites = await req.db
    .collection('tramites')
    .find({"$or":[
      {'categoria': 'PRE INSCRIPTO'},
      {'categoria': 'DESACTUALIZADO'}
    ]},{
      categoria:1,
      status:1,
      createdAt:1,
      _id:1,
      razonSocial:1,
      cuit:1,
      submitedAt:1,
      asignadoA:1,
      revisiones:1,
      cantidadObservado:1,
      cantidadSubsanado:1
    } )
    .toArray();
  res.send({
    tramites:tramites.map(t=>{
      return{
        categoria:t.categoria,
        status: t.status,
        createdAt: t.createdAt,
        _id: t._id,
        razonSocial: t.razonSocial,
        cuit:t.cuit,
        submitedAt: t.submitedAt,
        asignadoA: t.asignadoA,
        cantidadObservado:t.cantidadObservado,
        cantidadSubsanado:t.cantidadSubsanado,
        revisiones: t.revisiones
      }
    })
  });
  
});


export default handler