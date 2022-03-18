import { CalculadoraCapacidad } from 'rnc-main-lib'
import _ from 'lodash'

export default async (req, res) => {
    const tramite: TramiteAlta = JSON.parse(req.body.payload)[0].tramite
    const calculadora = new CalculadoraCapacidad(tramite)
    await calculadora.init()
    const capacidadEjecucion = calculadora
      .getMontoCertificacionesPorPeriodo()
      .aplicarIndiceCorreccion()
      .ordenarMontoDescendente()
      .tomarLosTresPrimerosElementos()
      .aplicarPromedioLineal()
      .aplicarIndicesEconomicos()
    

    const capacidadFinanciera = _.isEmpty(tramite.ddjjObras) ? capacidadEjecucion :
      capacidadEjecucion - calculadora.filtrarObrasCandidatas()
        .value
        .map(obra => {
          return calculadora.getCompromiso(obra) 
        })
        .reduce((acc, val) => acc += val, 0)


    res.json({
        capacidadEjecucion,
        capacidadFinanciera,
        evidencia: calculadora.getEvidencia()
    })
}