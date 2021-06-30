import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash'
import moment from 'moment'
import { getCodigoObra } from '../../../services/business';

const handler = nextConnect();

handler.use(middleware);



handler.get(async (req: any, res: NextApiResponse) => {
    const {
        query: { cuit,type, id },
    } = req

    if (!req.user) {
        return res.status(401).send('unauthenticated');
    }

    if (_.isEmpty(req.user.Role.filter(r => r === 'JEFE REGISTRO')))
        res.status(403).send('Forbidden')

    if (!type){
        res.send('ERROR - Debe indicar el tipo de operación a realizar')
    }

    const fixCertificaciones = async () => {
        
        const tramites: Array<TramiteAlta> = await req.db
            .collection('tramites')
            .find({
                "cuit": cuit
            }
            ).toArray()

        const fixCertificacionesDate = (cert) => {
            if (cert.periodo.length > 10)
                cert.periodo = moment(cert.periodo).format('DD/MM/YYYY')
                
            if ( !cert.codigo)
                cert.codigo = getCodigoObra()
                
            return cert
        }

        for (let tramite of tramites) {
            let counter = 0
            for (let obra of tramite.ddjjObras) {
                obra.certificaciones = obra.certificaciones.map(fixCertificacionesDate)
                tramite.ddjjObras[counter] = obra
                counter++
            }
            await req.db.collection('tramites').save(tramite)
        }
    }

    const fixReviews = async () => {
        const tramite: TramiteAlta = await req.db
            .collection('tramites')
            .findOne({
                "_id": id
            })
        
        // tramite.revisiones.map(r => r.reviews)
        const reviews = tramite.revisiones[0].reviews.map(r => {return {...r,isOk:true, review:''}})
        tramite.revisiones[0].reviews = reviews
        tramite.revisiones = tramite.revisiones.slice(0,1)
        await req.db.collection('tramites')
            .save(tramite)

        
            
    }

    if (type==='CERTIFICACIONES')
        await fixCertificaciones()
    
    if (type==='REMOVEREVIEWS')
        await fixReviews()




    res.send('Done')

});

export default handler