import {Parser} from '../services/migrates.services'

(async () => {

    const idProveedor = '14067'
    const service = new Parser(process.env.CONTRATAR_KEY)
    

    await service.init(idProveedor)

  
    await service.dbUpd()
    const info = await service.parseInformacionBasica()
    await service.parseEjercicios()
    service.parseObras()
    await service.save()
    await service.dbUpd()



  })()