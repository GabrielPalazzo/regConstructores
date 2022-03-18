
import { MigrateService, Parser } from '../services/migrates.services'


(async () => {

  const service = new MigrateService(process.env.CONTRATAR_KEY)
  const serviceCargarProveedor = new Parser(process.env.CONTRATAR_KEY)
  await service.dbUpd()
  await serviceCargarProveedor.dbUpd()

  for (let idProveedor of process.argv[2].split(',')) {
    await service.migrarProveedoresPreInscripcion(idProveedor)
    await service.migrarProveedoresInfoBasica(idProveedor)
    await service.migrarProveedoresBalances(idProveedor)
    await service.migrarProveedoresDatosObra(idProveedor)
    await service.migrarProveedoresCerficado(idProveedor)
    await serviceCargarProveedor.init(idProveedor)
    const info = await serviceCargarProveedor.parseInformacionBasica()
    await serviceCargarProveedor.parseEjercicios()
    serviceCargarProveedor.parseObras()
    await serviceCargarProveedor.save()
    console.log(`Proveedor Migrado: ${idProveedor}`)
  }

  process.exit()


})()