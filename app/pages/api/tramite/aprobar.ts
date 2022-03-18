import nextConnect from 'next-connect';
import { nanoid } from 'nanoid';
import middleware from '../../../middlewares/middleware';
import { NextApiResponse } from 'next';
import _ from 'lodash'
import moment from 'moment'
import { CalculadoraCapacidad } from 'rnc-main-lib'
import { generarCertificado } from '../../../services/business';

const handler = nextConnect();

handler.use(middleware);


const finalizarTramite = async (tramite: TramiteAlta, usuario: Usuario, db): Promise<TramiteAlta> => {

  const newTramite = {
    ...tramite,
    aprobacion: {
      aprobadoPor: usuario,
      aprobadoAt: new Date().getTime()
    }
  };

  await db.collection('tramites').save(newTramite);
  return newTramite
}




handler.post(async (req: any, res: NextApiResponse) => {

  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }

  if (_.isEmpty(req.user.Role.filter(r => r === 'JEFE REGISTRO')))
    res.status(403).send('Forbidden')



  const tramite: TramiteAlta = req.body

  tramite.categoria = 'INSCRIPTO'
  tramite.status = 'VERIFICADO'


  const mapObras = (obra: DDJJObra) => {
    let status = obra.status
    if (!obra.status || obra.status === 'SUPERVIZADA')
        status = 'APROBADA'
    return {
      ...obra,
      status,
      fechaAprobacion: status === 'APROBADA' ? new Date().getTime() : null 
    }
  }

  tramite.ddjjObras = tramite.ddjjObras.map(mapObras)

  const mapEjercicios = (ejercicio: Ejercicio) => {
    return {
      ...ejercicio,
      status: 'APROBADO' as any
    }
  }

  tramite.ejercicios = tramite.ejercicios.map(mapEjercicios)

  const tramiteActualizado = await finalizarTramite(tramite, req.user, req.db)
  try{
    const certificado = await generarCertificado(tramiteActualizado, req.user, req.db)
    res.json(certificado)
  }
  catch(ex){
    console.log(ex)
    res.send(ex)
  }
  

});

export default handler;

