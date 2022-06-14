import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nextConnect();

handler.use(middleware);

/**
 * CONSD-127333: visibilidad de trámites asignados
 * Los trámites asignados solo son vistos por el mismo usuario.
 * Los usuarios con rol JEFE REGISTRO pueden ver y consultar todos los trámites.
 */
handler.get(async (req: any, res: NextApiResponse) => {

  if (req.user.Role.filter(() => 'CONTROLADOR').length === 0)
    res.status(401).send('Forbidden')

  let tramites = null;
  const esJefeFegistro: Boolean = req.user.Role.filter(function (rol: string) {return rol === 'JEFE REGISTRO' }).length > 0;  

  if (esJefeFegistro) {
    tramites = await req.db
      .collection('tramites')
      .find({ "$or": [{ 'categoria': 'PRE INSCRIPTO' }, { 'categoria': 'DESACTUALIZADO' }] },
        {
          categoria: 1, status: 1, createdAt: 1, _id: 1, razonSocial: 1, cuit: 1, submitedAt: 1, asignadoA: 1, revisiones: 1, cantidadObservado: 1, cantidadSubsanado: 1
        }).toArray();
  }
  else {
    // { 'asignadoA': null },
    tramites = await req.db
      .collection('tramites')
      .find({ "$or": [{ 'asignadoA.cuit': req.user.cuit }] },
        {
          categoria: 1, status: 1, createdAt: 1, _id: 1, razonSocial: 1, cuit: 1, submitedAt: 1, asignadoA: 1, revisiones: 1, cantidadObservado: 1, cantidadSubsanado: 1
        }).toArray();
  }


  res.send({
    tramites: tramites.map(t => {
      return {
        categoria: t.categoria,
        status: t.status,
        createdAt: t.createdAt,
        _id: t._id,
        razonSocial: t.razonSocial,
        cuit: t.cuit,
        submitedAt: t.submitedAt,
        asignadoA: t.asignadoA,
        cantidadObservado: t.cantidadObservado,
        cantidadSubsanado: t.cantidadSubsanado,
        revisiones: t.revisiones
      }
    })
  });

});


export default handler