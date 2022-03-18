import axios from 'axios'
import { MigrateService, Parser } from '../../services/migrates.services'

export default async (req, res) => {

    const { idProveedor, key } = req.body


    const service = new MigrateService(process.env.CONTRATAR_KEY)
    const serviceCargarProveedor = new Parser(process.env.CONTRATAR_KEY)
    await service.dbUpd()
    await serviceCargarProveedor.dbUpd()

    
    await service.migrarProveedoresCerficado(idProveedor)
    await service.migrarProveedoresPreInscripcion(idProveedor)
    await service.migrarProveedoresInfoBasica(idProveedor)
    await service.migrarProveedoresBalances(idProveedor)
    await service.migrarProveedoresDatosObra(idProveedor)
    
    await serviceCargarProveedor.init(idProveedor)
    await serviceCargarProveedor.parseInformacionBasica()
    await serviceCargarProveedor.parseEjercicios()
    serviceCargarProveedor.parseObras()
    await serviceCargarProveedor.save()

    res.status(200).send('Done')

}