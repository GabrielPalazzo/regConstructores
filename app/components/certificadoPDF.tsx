import React from 'react';
import { Page, Text, View, Document, StyleSheet, Svg, Path, Line, Font} from '@react-pdf/renderer';
import moment from 'moment'
import { calcularSaldoObra, getVigenciaCertificado } from '../services/business';
import numeral from 'numeral'
import _ from 'lodash'
import { Certificado } from './certificado';
import { debug } from 'console';
import obras from '../pages/obras';


//Font.register({ family: 'Roboto', src: source });

// Create styles
const styles = StyleSheet.create({
  page: {

    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  sectionFooter: {
    color: '#5b5b5f',
    fontSize: '7px',
    textAlign: 'center',
    margin: 20,
  },
  sectionFooterBold: {

    fontWeight: 'bold',
  },
  sectionFooterRegular: {
    fontWeight: 'light',
  },
  textsize10: {
    fontSize: '10px'
  },

  sectionHeader: {
    color: '#5b5b5f',
    fontSize: '9px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    margin: 10,
  },


  sectionContentHead: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    color: '#5b5b5f',
    fontSize: '10px',

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionContentHead2: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  sectionContentHeadColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionContentHeadColumn3: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionContentHeadColumn2: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 20,
    paddingRight: 40,
  },
  sectionContentEspecialidades: {
    color: '#5b5b5f',
    fontSize: '12px',
    backgroundColor: '#987654'
  },
  sectionContentCapacidad: {
    margin: 10,
    color: '#5b5b5f',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionContentCapacidadColumn: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    width: '600px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1
  },
  sectionContentCapacidadColumnBorder: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    width: '600px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    borderLeft: '1px solid #5b5b5f',
    paddingLeft: 20
  },
  sectionContentCapacidadColumnBorder2: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    borderLeft: '1px solid #5b5b5f',
    textAlign: 'center'
  },
  sectionContentEspecialidadColumn: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 6
  },
  sectionContentEspecialidadColumnBorder2: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 6,
    borderLeft: '1px solid #5b5b5f',
    paddingLeft: 20
  },

  sectionContentTitle: {
    padding: 5,
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: '#00bbeb'
  },
  sectionContent100: {
    padding: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#5b5b5f',
    fontSize: '8pt',
    textTransform: 'uppercase'
  },

  sectionH2: {
    color: '#5b5b5f',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  sectionH3: {
    margin: 10,
    padding: 10,
    color: '#949397',
    fontSize: '10pt',
  },
  sectionEtiqueta: {
    color: '#5b5b5f',
    fontSize: '10px',
    fontWeight: 'extrabold',
    textTransform: 'uppercase'
  },
  sectionEtiquetaTable: {
    color: '#5b5b5f',
    fontSize: '8px',
    alignContent: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: '1px solid #5b5b5f',
    textAlign: 'center',
  },
  sectionContentTable: {
    color: '#5b5b5f',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  sectionContentTableColumnBorder: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    width: '300px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    borderLeft: '1px solid #5b5b5f',
    borderBottom: '1px solid #5b5b5f',
    
  },
  sectionContentTableColumnBorder2: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    textAlign: 'center',
    width: '180px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    borderLeft: '1px solid #5b5b5f',
    borderBottom: '1px solid #5b5b5f',
    
  },
  sectionContentTableColumnBorder3: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    width: '300px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    borderLeft: '1px solid #5b5b5f',
    borderBottom: '1px solid #5b5b5f',
    
  },
  sectiontable: {
    height:'70px',
    borderBottom: '1px solid #5b5b5f',
    padding:'0px',
    margin:'0px'
    
  },
  row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
},
description: {
    width: '60%',
    textAlign: 'left',
    borderRightWidth: 1,
    paddingLeft: 8,
},
qty: {
    width: '10%',
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
},
rate: {
    width: '15%',
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
},
amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
},
});


const tipoEspecialidad = [
  {
    label: 'INGENIERIA VIAL',
    value: 'IV',
  },
  {
    label: 'INGENIERÍA HIDRÁULICA',
    value: 'IH',
  },
  {
    label: 'SANITARIA',
    value: 'SANITARIA',
  },
  {
    label: 'INGENIERÍA FERROVIARIA',
    value: 'IF',
  },
  {
    label: 'INGENIERÍA ELECTROMECANICA',
    value: 'IE',
  },
  {
    label: 'INGENIERÍA  MECÁNICA',
    value: 'IM',
  },
  {
    label: 'INGENIERÍA AMBIENTAL',
    value: 'IA',
  },
  {
    label: 'ENERGIA',
    value: 'ENERGIA',
  },
  {
    label: 'INGENIERÍA NAVAL',
    value: 'IN',
  },
  {
    label: 'TELECOMUNICACIONES',
    value: 'TELECOMUNICACIONES',
  },
  {
    label: 'ELECTRÓNICA',
    value: 'ELECTRONICA',
  },
  {
    label: 'OBRAS MENORES EN LA VIA PÚBLICA',
    value: 'OMVP',
  },
  {
    label: 'INFORMÁTICA',
    value: 'INFORMATICA',
  },
  {
    label: 'INGENIERÍA AERONÁUTICA Y ESPACIAL',
    value: 'IAE',
  },
  {
    label: 'OBRAS DE ARQUITECTURA',
    value: 'OA',
  },


]

const tipoSubespecialidadIA = [
  {
    label: 'Pavimentos Rígidos',
    value: 'PR',
    parent: 'IV',
  },
  {
    label: 'Pavimentos Flexibles',
    value: 'PF',
    parent: 'IV',
  },
  {
    label: 'Puentes (Obras de arte mayor)',
    value: 'Puentes',
    parent: 'IV',
  },
  {
    label: 'Aeródromos (Pistas)',
    value: 'AERODROMO',
    parent: 'IV',
  },
  {
    label: 'Túneles',
    value: 'Tuneles',
    parent: 'IV',
  },
  {
    label: 'Movimiento de Suelos',
    value: 'MS',
    parent: 'IV',
  },
  {
    label: 'Estabilización de Terrenos, Autopistas',
    value: 'EA',
    parent: 'IV',
  },
  {
    label: 'Gaviones',
    value: 'Gaviones',
    parent: 'IV',
  },
  {
    label: 'Conservación de Caminos',
    value: 'CC',
    parent: 'IV',
  },
  {
    label: 'Pavimentos Urbanos y articulados',
    value: 'PUA',
    parent: 'IV',
  },
  {
    label: 'Voladuras',
    value: 'Voladuras',
    parent: 'IV',
  },
  {
    label: 'Limpieza de Terrenos, Desbosques',
    value: 'LTD',
    parent: 'IV',
  },
  {
    label: 'Destronque',
    value: 'Destronque',
    parent: 'IV',
  },
  {
    label: 'Relevamiento Topográfico,(Apertura de Trazas)',
    value: 'RT',
    parent: 'IV',
  },
  {
    label: 'Señalización Horizontal y Vertical',
    value: 'SHV',
    parent: 'IV',
  },
  {
    label: 'Obras de Arte Menor',
    value: 'OAM',
    parent: 'IV',
  },
  {
    label: 'Presas,Diques,Escolleras',
    value: 'PDE',
    parent: 'IH',
  }, {
    label: 'Obras de Arte Menor',
    value: 'OAM',
    parent: 'IH',
  }, {
    label: 'Canales Navegables',
    value: 'Canales Navegables',
    parent: 'IH',
  }, {
    label: 'Portuarias',
    value: 'Portuarias',
    parent: 'IH',
  }, {
    label: 'Acueductos',
    value: 'Acueductos',
    parent: 'IH',
  }, {
    label: 'Hidromecánicas',
    value: 'Hidromecánicas',
    parent: 'IH',
  }, {
    label: 'Acondicionamiento Hidráulico,',
    value: 'Acondicionamiento_Hidráulico,',
    parent: 'IH',
  }, {
    label: '(Sistematización de ríos y lagos)',
    value: 'SRL',
    parent: 'IH',
  }, {
    label: 'Canales de riego, Esclusas',
    value: 'CRE',
    parent: 'IH',
  }, {
    label: 'Dragados',
    value: 'Dragados',
    parent: 'IH',
  }, {
    label: 'Perforaciones',
    value: 'Perforaciones',
    parent: 'IH',
  }, {
    label: 'Tablestacados',
    value: 'Tablestacados',
    parent: 'IH',
  }, {
    label: 'Defensa aluvionales',
    value: 'Defensa_aluvionales',
    parent: 'IH',
  }, {
    label: 'Planta de Potabilización Pozos',
    value: 'PPB',
    parent: 'SANITARIA',
  }, {
    label: 'Plantas de Depuración',
    value: 'PD',
    parent: 'SANITARIA',
  }, {
    label: 'Impulsión y Bombeo',
    value: 'Impulsión_Bombeo',
    parent: 'SANITARIA',
  }, {
    label: 'Redes Principales de Desagüe',
    value: 'RPDD',
    parent: 'SANITARIA',
  }, {
    label: 'Redes Principales de Provisión de Agua',
    value: 'RPPA',
    parent: 'SANITARIA',
  }, {
    label: 'Pozos-Perforaciones-Drenaje',
    value: 'Pozos-Perforaciones-Drenaje',
    parent: 'SANITARIA',
  }, {
    label: 'Redes Secundarias de Desagüe',
    value: 'RSD',
    parent: 'SANITARIA',
  }, {
    label: 'Redes Secundarias de Provisión de Agua',
    value: 'RSPA',
    parent: 'SANITARIA',
  }, {
    label: 'Impermeabilización',
    value: 'Impermeabilización',
    parent: 'SANITARIA',
  }
  , {
    label: 'Mantenimiento en General',
    value: 'MG',
    parent: 'SANITARIA',
  }, {
    label: 'Electrificación',
    value: 'Electrificación',
    parent: 'IF',
  }, {
    label: 'Subterráneos',
    value: 'Subterráneos',
    parent: 'IF',
  }, {
    label: 'Material Rodante',
    value: 'Material Rodante',
    parent: 'IF',
  }, {
    label: 'Señalización y Enclavamiento',
    value: 'Señalización_Enclavamiento',
    parent: 'IF',
  }, {
    label: 'Instalación para Seguridad',
    value: 'Instalación_para_Seguridad',
    parent: 'IF',
  }, {
    label: 'Mantenimiento ferroviario',
    value: 'Mantenimiento_ferroviario',
    parent: 'IF',
  }, {
    label: 'Vía y Obra',
    value: 'VO',
    parent: 'IF',
  }, {
    label: 'Centrales Hidroeléctricas',
    value: 'Centrales_Hidroeléctricas',
    parent: 'IE',
  }, {
    label: 'Línea de Alta Tensión',
    value: 'LAT',
    parent: 'IE',
  }, {
    label: 'Subusinas',
    value: 'Subusinas',
    parent: 'IE',
  }, {
    label: 'Centrales Térmicas',
    value: 'Centrales_Térmicas',
    parent: 'IE',
  }, {
    label: 'Centrales Nucleares',
    value: 'Centrales_Nucleares',
    parent: 'IE',
  }, {
    label: 'Gasoductos',
    value: 'Gasoductos',
    parent: 'IE',
  }, {
    label: 'Planta de Impulsión y Almacenamiento',
    value: 'Planta_de _mpulsión_Almacenamiento',
    parent: 'IE',
  }, {
    label: 'Instalaciones eléctricas',
    value: 'Instalaciones_eléctricas',
    parent: 'IE',
  }, {
    label: 'Instalaciones Electromecánicas',
    value: 'Instalaciones_Electromecánicas',
    parent: 'IE',
  }, {
    label: 'Instalaciones Electrotérmicas',
    value: 'InstalacionesElectrotérmicas',
    parent: 'IE',
  }, {
    label: 'Instalaciones Acústicas',
    value: 'InstalacionesAcústicas',
    parent: 'IE',
  }, {
    label: 'Línea de Media y Baja Tensión',
    value: 'LíneaMediaBajaTensións',
    parent: 'IE',
  }, {
    label: 'Electrificación Rural',
    value: 'ElectrificaciónRural',
    parent: 'IE',
  }, {
    label: 'Red de alumbrado público',
    value: 'Redalumbradopúblico',
    parent: 'IE',
  }, {
    label: 'Semaforización',
    value: 'Semaforización',
    parent: 'IE',
  }, {
    label: 'Señalamiento y Balizamiento',
    value: 'SeñalamientoBalizamiento',
    parent: 'IE',
  }, {
    label: 'Radioeléctrico',
    value: 'Radioeléctrico',
    parent: 'IE',
  }, {
    label: 'Mantenimiento eléctrico',
    value: 'Mantenimientoeléctrico',
    parent: 'IE',
  }, {
    label: 'Instalaciones Termomecánicas',
    value: 'InstalacionesTermomecánicas',
    parent: 'IE',
  }, {
    label: 'Instalaciones Térmicas, Refrigeración',
    value: 'InstalacionesTérmicasRefrigeración',
    parent: 'IE',
  }, {
    label: 'Aire Acondicionado',
    value: 'AireAcondicionado',
    parent: 'IE',
  }, {
    label: 'Energía Solar',
    value: 'EnergíaSolar',
    parent: 'IE',
  }
  , {
    label: 'Horno de Ventilación',
    value: 'HornoVentilación',
    parent: 'IE',
  }
  , {
    label: 'Soldaduras',
    value: 'Soldaduras',
    parent: 'IE',
  }
  , {
    label: 'Mantenimiento Térmico',
    value: 'MantenimientoTérmico',
    parent: 'IE',
  }
  , {
    label: 'Redes de Distribución de Gas',
    value: 'RedesDistribuciónGas',
    parent: 'IE',
  }
  , {
    label: 'Provisión de Gas Natural',
    value: 'ProvisiónGasNatural',
    parent: 'IE',
  }, {
    label: 'Elevadores de Granos',
    value: 'ElevadoresGranos',
    parent: 'IM',
  }, {
    label: 'Translación Vertical Ascensores',
    value: 'TranslaciónVerticalAscensores',
    parent: 'IM',
  }, {
    label: 'Montacargas',
    value: 'Montacargas',
    parent: 'IM',
  }, {
    label: 'Cintas Transportadoras',
    value: 'CintasTransportadoras',
    parent: 'IM',
  }, {
    label: 'Silos y Norias',
    value: 'SilosNorias',
    parent: 'IM',
  }, {
    label: 'Fábrica de Motores',
    value: 'FábricaMotores',
    parent: 'IM',
  }, {
    label: 'Equipos Rodantes',
    value: 'EquiposRodantes',
    parent: 'IM',
  }, {
    label: 'Mantenimiento Mecánico',
    value: 'MantenimientoMecánico',
    parent: 'IM',
  }, {
    label: 'Instalaciones Industriales',
    value: 'InstalacionesIndustriales',
    parent: 'IM',
  }, {
    label: 'Instalaciones Metalúrgicas',
    value: 'InstalacionesMetalúrgicas',
    parent: 'IM',
  }, {
    label: 'Servicios de mantenimiento y limpieza',
    value: 'ServiciosmantenimientoLimpieza',
    parent: 'IA',
  }, {
    label: 'Recolección de residuos Peligrosos',
    value: 'RecolecciónresiduosP',
    parent: 'IA',
  }, {
    label: 'Recolección de residuos Domesticos',
    value: 'RecolecciónresiduosD',
    parent: 'IA',
  }, {
    label: 'Oleoducto, Poliductos',
    value: 'OleoductoPoliductos',
    parent: 'ENERGIA',
  }, {
    label: 'Plantas de Impulsión y Almacenamiento',
    value: 'PlantasAlmacenamiento',
    parent: 'ENERGIA',
  }, {
    label: 'Perforaciones y Pozos',
    value: 'PerforacionesPozos',
    parent: 'ENERGIA',
  }, {
    label: 'Instalación y Mantenimiento de Surtidores de Combustible',
    value: 'InstalaciónCombustible',
    parent: 'ENERGIA',
  }, {
    label: 'Servicios para la Industria del Petróleo',
    value: 'ServiciosPetróleo',
    parent: 'ENERGIA',
  }, {
    label: 'Servicios para la Industria de Mantenimiento',
    value: 'ServiciosIndustriaMantenimiento',
    parent: 'ENERGIA',
  }, {
    label: 'Astilleros (Construcción de Buques)',
    value: 'AstillerosConstrucciónBuques',
    parent: 'IN',
  }, {
    label: 'Talleres Navales',
    value: 'TalleresNavales',
    parent: 'IN',
  }, {
    label: 'Reparaciones Navales',
    value: 'ReparacionesNavales',
    parent: 'IN',
  }, {
    label: 'Reflotamientos',
    value: 'Reflotamientos',
    parent: 'IN',
  }, {
    label: 'Salvamentos Marítimos y Fluviales',
    value: 'SalvamentosMarítimosFluviales',
    parent: 'IN',
  }, {
    label: 'Telegrafía y Telefonía',
    value: 'TelegrafíaTelefonía',
    parent: 'TELECOMUNICACIONES',
  }, {
    label: 'Telecomunicaciones',
    value: 'Telecomunicaciones',
    parent: 'TELECOMUNICACIONES',
  }, {
    label: 'Radioenlace',
    value: 'Radioenlace',
    parent: 'TELECOMUNICACIONES',
  }, {
    label: 'Radar',
    value: 'Radar',
    parent: 'TELECOMUNICACIONES',
  }, {
    label: 'Sistema de Señalización',
    value: 'SistemaSeñalización',
    parent: 'ELECTRONICA',
  }, {
    label: 'Letreros Electrónicos',
    value: 'LetrerosElectrónicos',
    parent: 'ELECTRONICA',
  }, {
    label: 'Reparación de veredas y/o calzadas',
    value: 'ReparaciónVeredas',
    parent: 'OMVP',
  }, {
    label: 'Bacheos en calles de hormigón y/o asfalto',
    value: 'Bacheoscalles',
    parent: 'OMVP',
  }, {
    label: 'Construcción de rampas para discapacitados',
    value: 'Construcciónrampasdiscapacitados',
    parent: 'OMVP',
  }, {
    label: 'Construcción de bicisendas',
    value: 'Construcciónbicisendas',
    parent: 'OMVP',
  }, {
    label: 'Construcción de cercos en terrenos baldíos',
    value: 'ConstrucciónCercosTerrenosBaldíos',
    parent: 'OMVP',
  }, {
    label: 'Colocación de señales urbanas',
    value: 'ColocaciónSeñalesUrbanas',
    parent: 'OMVP',
  }, {
    label: 'Colocación de refugios para colectivos y/o taxis',
    value: 'ColocaciónRefugio',
    parent: 'OMVP',
  }, {
    label: 'Podas de árboles',
    value: 'Podasárboles',
    parent: 'OMVP',
  }, {
    label: 'Informática',
    value: 'Informática',
    parent: 'INFORMATICA',
  }, {
    label: 'Ingeniería Aeronáutica y Espacial',
    value: 'IngenieríaAeronáuticaEspacial',
    parent: 'IAE',
  }, {
    label: 'Construcciones Civiles en General',
    value: 'ConstruccionesCivilesGeneral',
    parent: 'OA',
  }, {
    label: 'Construcciones Industriales',
    value: 'ConstruccionesIndustriales',
    parent: 'OA',
  }, {
    label: 'Estructuras de Hormigón Armado',
    value: 'EstructurasHormigónArmado',
    parent: 'OA',
  }, {
    label: 'Urbanismo',
    value: 'Urbanismo',
    parent: 'OA',
  }, {
    label: 'Construcciones Prefabricadas',
    value: 'ConstruccionesPrefabricadas',
    parent: 'OA',
  }, {
    label: 'Construcciones Metálicas',
    value: 'ConstruccionesMetálicas',
    parent: 'OA',
  }, {
    label: 'Estructuras Metálicas (galpones, etc.)',
    value: 'Estructuras_Metálicas',
    parent: 'OA',
  }, {
    label: 'Restauración y Refacción de Edificios',
    value: 'RestauraciónEdificios',
    parent: 'OA',
  }, {
    label: 'Restauración de Sitios, Monumentos y Lugares Históricos.',
    value: 'RestauraciónMonumentos ',
    parent: 'OA',
  }, {
    label: 'Instalaciones contra incendio',
    value: 'Instalacionesincendio',
    parent: 'OA',
  }, {
    label: 'Instalaciones de Seguridad',
    value: 'InstalacionesSeguridad',
    parent: 'OA',
  }, {
    label: 'Instalaciones Complementarias',
    value: 'InstalacionesComplementarias',
    parent: 'OA',
  }, {
    label: 'Demoliciones y Excavaciones',
    value: 'DemolicionesExcavaciones',
    parent: 'OA',
  }, {
    label: 'Aislaciones Acústicas',
    value: 'AislacionesAcusticas',
    parent: 'OA',
  }, {
    label: 'Aislaciones Termicas',
    value: 'AislacionesTermicas',
    parent: 'OA',
  }, {
    label: 'Aislaciones Hidrófugas',
    value: 'AislacionesHidrófugas',
    parent: 'OA',
  }, {
    label: 'Impermeabilizaciones',
    value: 'Impermeabilizaciones',
    parent: 'OA',
  }
  , {
    label: 'Albañilería',
    value: 'Albañilería',
    parent: 'OA',
  }
  , {
    label: 'Limpieza de Frentes',
    value: 'LimpiezaFrentes',
    parent: 'OA',
  }
  , {
    label: 'Pinturas y Afines',
    value: 'PinturasAfines',
    parent: 'OA',
  }
  , {
    label: 'Marmolería',
    value: 'Marmolería',
    parent: 'OA',
  }
  , {
    label: 'Carpintería',
    value: 'Carpintería',
    parent: 'OA',
  }
  , {
    label: 'Herrería',
    value: 'Herrería',
    parent: 'OA',
  }, {
    label: 'Yesería',
    value: 'Yesería',
    parent: 'OA',
  }, {
    label: 'Vidriería',
    value: 'Vidriería',
    parent: 'OA',
  }, {
    label: 'Decoración Integral (provisión y colocación)',
    value: 'DecoraciónIntegral',
    parent: 'OA',
  }, {
    label: 'Limpieza de Edificios',
    value: 'LimpiezadeEdificios',
    parent: 'OA',
  }, {
    label: 'Parquización y Forestación',
    value: 'ParquizaciónyForestación',
    parent: 'OA',
  }, {
    label: 'Equipamiento Urbano',
    value: 'EquipamientoUrbano',
    parent: 'OA',
  }, {
    label: 'Amoblamientos',
    value: 'Amoblamientos',
    parent: 'OA',
  }



]




// Create Document Component
export default (props) => {

  const getDescripcionEspecialidad = (especialidad) => {
    const element = tipoEspecialidad.filter(e => e.value === especialidad)
    return _.isEmpty(element) ? "" : element[0].label
  }
  const especialidades = _.concat(props.certificado.tramite.ddjjObras.map((o: DDJJObra) => getDescripcionEspecialidad(o.especialidad1)), props.certificado.tramite.ddjjObras.map((o: DDJJObra) => getDescripcionEspecialidad(o.especialidad2)))

  const getEstadoText = () => {
    console.log(props.certificado)

    const cert = props.certificado
    if (cert.tramite.categoria === 'INSCRIPTO')
      return 'La empresa se encuentra inscripta y con su información actualizada en este momento. Consulte los próximos vencimientos en esta constancia.'

    if (cert.tramite.categoria === 'PRE INSCRIPTO')
      return 'Trámite correspondiente a Inscripción ante el Registro Nacional de Constructores y Firmas Consultoras de Obras Públicas iniciado .'

    if (cert.tramite.categoria === 'DESACTUALIZADO')
      return 'Trámite correspondiente a Actualización de datos iniciado ante el RNCYFCOP. Tener en cuenta que los datos actualizados podrán afectar considerablemente la capacidad luego de aprobarse el trámite.'

    if (cert.tramite.categoria === 'INSCRIPTO CON ACTUALIZACION')
      return 'Trámite correspondiente a actualización de datos iniciado. Tener en cuenta que los datos actualizados podrán afectar considerablemente la capacidad luego de aprobarse el trámite.'
    console.log(props.certificado)
    return ''
  }

  return (

    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.sectionHeader} >
          <Svg height="70px" >

            <Path fill="#66AED7" d="M37.25,24.78l-0.01-0.03L37.25,24.78c0.58-0.09,1.1-0.14,1.54-0.14c1.44,0,1.66,0.48,1.69,0.53
  c0,0.01,0.05,0.12,0.2,0.12c0.02,0,0.05,0,0.07-0.01c0.04-0.01,0.08-0.03,0.09-0.05c0.02-0.04,0.02-0.09-0.01-0.16
  c0-0.01-0.34-0.93-1.82-1.09c-0.01,0-0.8-0.1-1.65,0.05c-0.23,0.04-0.3,0.58-0.3,0.58c-0.01,0.06,0,0.11,0.03,0.14
  C37.14,24.8,37.22,24.79,37.25,24.78"/>
            <Path fill="#66AED7" d="M34.79,25.4L34.79,25.4c-0.34-0.16-1.13-0.12-1.14-0.12c-1.26,0.04-1.61,0.83-1.62,0.84
  c-0.03,0.08-0.04,0.15-0.01,0.19c0.03,0.05,0.1,0.06,0.1,0.06c0.26,0.06,0.33-0.13,0.34-0.14c0,0,0.08-0.24,0.63-0.38
  c0.01,0,0.02,0,0.03,0.01c0.01,0.01,0.01,0.02,0.01,0.03c-0.03,0.08-0.05,0.16-0.05,0.24c0,0.35,0.28,0.64,0.64,0.64
  s0.64-0.29,0.64-0.64c0-0.09-0.02-0.17-0.05-0.25c0-0.01,0-0.02,0.01-0.03c0.01-0.01,0.02-0.01,0.03-0.01
  c0.22,0.09,0.39,0.24,0.49,0.45c0.04,0.07,0.11,0.12,0.37,0.12c0.06,0,0.13-0.01,0.17-0.05c0.02-0.03,0.01-0.07,0.01-0.08
  C35.21,25.6,34.8,25.4,34.79,25.4"/>
            <Path fill="#66AED7" d="M37.2,26.4c0.26,0,0.33-0.05,0.37-0.12c0.1-0.21,0.27-0.36,0.49-0.45c0.01,0,0.03,0,0.03,0.01
  c0.01,0.01,0.01,0.02,0.01,0.03c-0.03,0.08-0.05,0.16-0.05,0.25c0,0.35,0.29,0.64,0.64,0.64c0.35,0,0.64-0.29,0.64-0.64
  c0-0.08-0.01-0.16-0.05-0.24c0-0.01,0-0.02,0.01-0.03c0.01-0.01,0.02-0.01,0.03-0.01c0.54,0.13,0.62,0.36,0.63,0.39
  c0.01,0.02,0.09,0.19,0.32,0.13c0.05-0.01,0.09-0.03,0.11-0.06c0.03-0.04,0.02-0.11-0.01-0.19c0-0.01-0.36-0.79-1.61-0.83
  c-0.08,0-0.81-0.02-1.14,0.12c0,0-0.42,0.21-0.57,0.86c-0.01,0.03-0.01,0.07,0.01,0.09C37.07,26.4,37.14,26.4,37.2,26.4"/>
            <Path fill="#66AED7" d="M31.64,25.29L31.64,25.29C31.64,25.29,31.64,25.29,31.64,25.29c0.03,0.01,0.06,0.01,0.08,0.01
  c0.15,0,0.2-0.12,0.2-0.12c0.01-0.03,0.36-0.85,3.22-0.39c0,0,0.11,0.02,0.16-0.03c0.03-0.03,0.04-0.07,0.03-0.14
  c0-0.02-0.08-0.55-0.3-0.59c-0.31-0.05-0.64-0.08-0.99-0.08c-0.38,0-0.64,0.03-0.65,0.03c-1.5,0.16-1.82,1.08-1.82,1.09
  c-0.03,0.07-0.03,0.13-0.01,0.16C31.58,25.28,31.63,25.29,31.64,25.29"/>
            <Path fill="#66AED7" d="M55.73,56.31c0.01-0.11-0.03-0.22-0.11-0.29c-0.07-0.06-0.16-0.08-0.25-0.07c0.07-0.15,0.14-0.3,0.19-0.46
  c0.24-0.67,0.37-1.43,0.38-2.28c0-0.11-0.05-0.21-0.14-0.27c-0.07-0.05-0.16-0.07-0.24-0.05c0.05-0.15,0.1-0.3,0.14-0.45
  c0.18-0.69,0.23-1.46,0.15-2.3c-0.01-0.11-0.07-0.21-0.17-0.26c-0.08-0.04-0.17-0.05-0.25-0.02c0.05-0.17,0.09-0.35,0.11-0.53
  c0.11-0.7,0.08-1.48-0.07-2.31c-0.02-0.11-0.09-0.2-0.19-0.24c-0.06-0.02-0.13-0.03-0.19-0.02c0.02-0.12,0.04-0.25,0.05-0.38
  c0.08-0.7,0.02-1.48-0.18-2.3c-0.03-0.11-0.1-0.19-0.21-0.23c-0.1-0.04-0.21-0.02-0.3,0.04c0,0-0.01,0.01-0.02,0.02
  c0.02-0.19,0.02-0.39,0.02-0.59c-0.02-0.71-0.19-1.47-0.5-2.26c-0.04-0.1-0.13-0.17-0.23-0.2c-0.09-0.02-0.19,0-0.27,0.06
  c0-0.18-0.02-0.36-0.04-0.54c-0.09-0.7-0.34-1.44-0.72-2.19c-0.05-0.1-0.14-0.16-0.25-0.17c-0.1-0.01-0.19,0.02-0.26,0.09
  c-0.02-0.17-0.06-0.33-0.1-0.5c-0.18-0.69-0.5-1.39-0.98-2.1c-0.06-0.09-0.16-0.14-0.27-0.14c-0.11,0-0.21,0.06-0.27,0.15
  c0,0,0,0.01-0.01,0.02c-0.06-0.19-0.13-0.39-0.21-0.58c-0.28-0.65-0.72-1.29-1.3-1.91c-0.08-0.08-0.19-0.12-0.3-0.1
  c-0.09,0.02-0.16,0.07-0.21,0.15c-0.09-0.19-0.19-0.38-0.31-0.56c-0.38-0.59-0.9-1.15-1.56-1.66c-0.09-0.07-0.2-0.09-0.3-0.05
  c-0.09,0.03-0.16,0.1-0.19,0.18c-0.4-0.55-0.97-0.97-1.68-1.26c0.09,0.01,0.18,0.01,0.26,0.02c0.94,0.06,1.6-0.14,1.63-0.15
  c0.22-0.07,0.36-0.29,0.34-0.52c-0.03-0.23-0.22-0.41-0.45-0.42c-1-0.05-1.38-0.25-1.85-0.51c-0.05-0.03-0.1-0.05-0.14-0.08
  l2.21-0.33c0.23-0.04,0.41-0.24,0.41-0.48c0-0.24-0.18-0.44-0.41-0.47l-2.1-0.3c0.23-0.07,0.46-0.14,0.67-0.21
  c0.89-0.31,1.42-0.75,1.45-0.77c0.18-0.15,0.23-0.4,0.11-0.61c-0.12-0.2-0.36-0.29-0.58-0.22c-0.94,0.34-1.37,0.29-1.91,0.24
  c-0.05-0.01-0.1-0.01-0.15-0.02l1.91-1.15c0.2-0.12,0.29-0.38,0.2-0.6c-0.09-0.22-0.33-0.34-0.56-0.28l-2.06,0.53
  c0.19-0.15,0.37-0.31,0.54-0.46c0.7-0.63,1.03-1.24,1.04-1.26c0.11-0.21,0.06-0.46-0.13-0.6c-0.18-0.14-0.44-0.13-0.62,0.02
  c-0.74,0.68-1.15,0.8-1.67,0.95c-0.04,0.01-0.09,0.03-0.14,0.04l1.32-1.79c0.14-0.19,0.12-0.46-0.05-0.63
  c-0.17-0.17-0.44-0.19-0.62-0.04l-1.71,1.28c0.12-0.22,0.23-0.43,0.33-0.64c0.41-0.84,0.48-1.54,0.48-1.57
  c0.02-0.23-0.13-0.45-0.35-0.51c-0.23-0.06-0.46,0.05-0.56,0.26c-0.43,0.91-0.76,1.18-1.18,1.53c-0.04,0.03-0.07,0.06-0.11,0.09
  l0.54-2.16c0.06-0.23-0.06-0.47-0.28-0.56s-0.47-0.01-0.59,0.2l-1.1,1.85c0.03-0.25,0.05-0.49,0.06-0.72
  c0.05-0.94-0.15-1.61-0.15-1.63c-0.07-0.22-0.29-0.37-0.52-0.33c-0.23,0.03-0.41,0.22-0.42,0.45c-0.05,1.01-0.25,1.38-0.51,1.86
  c-0.02,0.04-0.04,0.08-0.07,0.12l-0.32-2.2c-0.03-0.23-0.24-0.41-0.47-0.41c-0.24,0-0.44,0.18-0.47,0.41l-0.29,2.09
  c-0.07-0.23-0.13-0.45-0.21-0.66c-0.3-0.89-0.74-1.43-0.76-1.45c-0.15-0.18-0.4-0.23-0.61-0.11c-0.2,0.12-0.29,0.36-0.21,0.58
  c0.34,0.95,0.29,1.37,0.24,1.92c-0.01,0.05-0.01,0.1-0.02,0.15l-1.16-1.93c-0.12-0.2-0.38-0.29-0.59-0.2
  c-0.22,0.09-0.34,0.33-0.28,0.56L32.36,20c-0.15-0.19-0.3-0.37-0.45-0.53c-0.61-0.69-1.19-1.01-1.26-1.05
  c-0.21-0.11-0.46-0.05-0.6,0.13c-0.14,0.19-0.13,0.45,0.03,0.62c0.67,0.74,0.79,1.16,0.95,1.68c0.01,0.05,0.03,0.1,0.04,0.15
  l-1.8-1.34c-0.19-0.14-0.46-0.12-0.62,0.05c-0.17,0.17-0.18,0.44-0.04,0.63l1.28,1.71c-0.21-0.12-0.42-0.23-0.62-0.32
  c-0.84-0.41-1.53-0.48-1.56-0.48c-0.23-0.02-0.44,0.13-0.51,0.35c-0.06,0.23,0.05,0.46,0.26,0.56c0.91,0.43,1.18,0.76,1.52,1.19
  c0.03,0.04,0.06,0.07,0.09,0.11l-2.16-0.54c-0.23-0.06-0.47,0.07-0.56,0.28c-0.09,0.22-0.01,0.48,0.2,0.6l1.84,1.1
  c-0.25-0.03-0.48-0.05-0.71-0.06c-0.94-0.05-1.6,0.15-1.63,0.15c-0.22,0.07-0.36,0.29-0.33,0.52c0.03,0.23,0.22,0.41,0.45,0.42
  c1,0.04,1.38,0.25,1.86,0.51c0.04,0.02,0.08,0.04,0.12,0.07l-2.2,0.33c-0.23,0.03-0.41,0.24-0.41,0.48c0,0.24,0.18,0.44,0.41,0.48
  l2.13,0.31c-0.24,0.07-0.47,0.14-0.69,0.22c-0.88,0.31-1.42,0.75-1.44,0.77c-0.18,0.15-0.23,0.41-0.11,0.61
  c0.12,0.2,0.36,0.29,0.58,0.21c0.47-0.17,0.84-0.26,1.19-0.28c-0.61,0.53-0.88,0.83-1,0.99c-0.1,0.13-0.19,0.26-0.28,0.39
  c-0.04-0.07-0.1-0.13-0.18-0.15c-0.1-0.04-0.22-0.02-0.3,0.05c-0.67,0.52-1.2,1.09-1.59,1.68c-0.12,0.18-0.22,0.37-0.31,0.55
  c-0.05-0.09-0.13-0.15-0.23-0.16c-0.11-0.02-0.22,0.02-0.29,0.1c-0.58,0.62-1.02,1.26-1.3,1.91c-0.08,0.18-0.15,0.36-0.2,0.54
  c-0.06-0.06-0.14-0.1-0.22-0.1c-0.11-0.01-0.21,0.04-0.28,0.13c-0.5,0.68-0.86,1.37-1.06,2.05c-0.06,0.19-0.1,0.38-0.13,0.56
  c-0.01-0.01-0.01-0.01-0.01-0.01c-0.07-0.09-0.17-0.13-0.28-0.12c-0.11,0.01-0.2,0.07-0.25,0.17c-0.39,0.75-0.64,1.49-0.74,2.19
  c-0.03,0.18-0.04,0.37-0.05,0.55h0c-0.08-0.08-0.19-0.11-0.3-0.08c-0.11,0.02-0.19,0.1-0.23,0.2c-0.3,0.79-0.45,1.56-0.46,2.26
  c0,0.18,0,0.36,0.02,0.54c-0.09-0.06-0.19-0.08-0.29-0.04c-0.1,0.04-0.18,0.12-0.2,0.23c-0.2,0.82-0.26,1.6-0.18,2.3
  c0.01,0.14,0.04,0.28,0.06,0.41c-0.05-0.01-0.11,0-0.16,0.02c-0.1,0.04-0.17,0.13-0.19,0.24c-0.16,0.83-0.18,1.61-0.07,2.31
  c0.03,0.18,0.07,0.37,0.11,0.54c-0.05,0-0.1,0.01-0.15,0.03c-0.1,0.05-0.16,0.14-0.18,0.25c-0.1,0.84-0.08,1.62,0.07,2.31
  c0.03,0.16,0.08,0.31,0.12,0.46c-0.08-0.02-0.16,0-0.23,0.04c-0.09,0.06-0.15,0.16-0.15,0.27c-0.01,0.85,0.09,1.61,0.32,2.29
  c0.07,0.2,0.15,0.4,0.24,0.59c-0.05-0.02-0.07-0.02-0.07-0.02c-0.11-0.03-0.22,0-0.3,0.07c-0.08,0.07-0.12,0.18-0.1,0.29
  c0.13,0.84,0.37,1.58,0.71,2.2c0.07,0.13,0.14,0.25,0.22,0.36c-0.06,0.01-0.12,0.04-0.17,0.09c-0.08,0.08-0.1,0.19-0.08,0.3
  c0.19,0.82,0.49,1.54,0.87,2.14c0.1,0.15,0.2,0.29,0.31,0.42c-0.1,0-0.19,0.05-0.24,0.13c-0.07,0.09-0.08,0.2-0.05,0.3
  c0.29,0.8,0.66,1.48,1.11,2.03c0.1,0.13,0.21,0.25,0.33,0.36c-0.09,0.02-0.16,0.07-0.21,0.15c-0.06,0.1-0.06,0.21-0.01,0.31
  c0.38,0.76,0.83,1.39,1.34,1.88c0.11,0.11,0.23,0.21,0.35,0.31c-0.08,0.03-0.15,0.09-0.19,0.17c-0.04,0.1-0.04,0.22,0.02,0.31
  c0.46,0.71,0.97,1.3,1.53,1.73c0.18,0.14,0.36,0.26,0.55,0.37c-0.06,0.02-0.09,0.03-0.1,0.03c-0.1,0.04-0.18,0.12-0.21,0.23
  c-0.02,0.11,0.01,0.22,0.08,0.3c0.58,0.61,1.18,1.09,1.78,1.43c0.49,0.28,0.99,0.47,1.47,0.56c0.4,0.08,0.82,0.08,1.16,0.02
  c1.06,0.76,2.19,1.39,3.35,1.88c0.96,0.41,1.94,0.72,2.92,0.93c0.14,0.03,0.28,0.06,0.43,0.08l0.33,0.06
  c0.22,0.07,0.41,0.12,0.55,0.14c-0.02,0.1-0.03,0.2-0.03,0.3c0,0.11,0.01,0.23,0.04,0.34c-0.35,0.35-1.57,1.42-3.31,1.64l-0.1,0.01
  l0.06,0.09c0.07,0.11,0.22,0.33,0.48,0.57l0.02,0.02l0.03-0.01c1.55-0.3,2.66-1.14,3.19-1.63c0.04,0.04,0.09,0.09,0.13,0.12
  c-0.12,0.45-0.59,1.5-2.38,1.99l-0.19,0.05l0.18,0.08c0.32,0.14,0.68,0.23,1.06,0.29l0.02,0l0.02-0.01
  c1.34-0.61,1.82-1.55,1.99-2.07c0.17,0.03,0.35,0.03,0.53,0c0.17,0.52,0.65,1.46,1.99,2.07l0.02,0.01l0.02,0
  c0.38-0.06,0.73-0.15,1.06-0.29l0.18-0.08l-0.19-0.05c-1.79-0.49-2.26-1.53-2.38-1.98c0.05-0.04,0.1-0.08,0.14-0.13
  c0.53,0.49,1.64,1.33,3.19,1.63l0.03,0.01l0.03-0.02c0.26-0.24,0.41-0.46,0.48-0.57l0.06-0.09L40.97,78
  c-1.69-0.21-2.86-1.2-3.3-1.63c0.03-0.11,0.04-0.23,0.04-0.35c0-0.1-0.01-0.21-0.03-0.31c0.18-0.04,0.35-0.08,0.51-0.13l0.38-0.07
  c0.47-0.08,0.92-0.18,1.35-0.29c0.98-0.26,1.95-0.63,2.88-1.09c1.32-0.65,2.2-1.3,2.46-1.52c0.35,0.06,0.76,0.06,1.17-0.02
  c0.48-0.09,0.98-0.28,1.47-0.56c0.6-0.34,1.2-0.82,1.78-1.43c0.08-0.08,0.11-0.19,0.08-0.3c-0.03-0.11-0.1-0.19-0.21-0.23
  c0,0-0.03-0.01-0.08-0.02c0.19-0.11,0.38-0.24,0.56-0.38c0.56-0.44,1.08-1.02,1.53-1.73c0.06-0.09,0.07-0.21,0.02-0.31
  c-0.04-0.08-0.1-0.14-0.18-0.17c0.12-0.1,0.24-0.2,0.35-0.31c0.51-0.49,0.96-1.13,1.34-1.88c0.05-0.1,0.05-0.21-0.01-0.31
  c-0.06-0.09-0.15-0.15-0.26-0.16c0.12-0.12,0.24-0.25,0.36-0.39c0.45-0.55,0.82-1.23,1.11-2.03c0.04-0.1,0.02-0.21-0.04-0.29
  c-0.06-0.09-0.15-0.14-0.25-0.14c0,0-0.01,0-0.03,0c0.11-0.13,0.21-0.26,0.3-0.4c0.39-0.59,0.7-1.31,0.9-2.13
  c0.03-0.11,0-0.22-0.08-0.3c-0.07-0.08-0.18-0.12-0.29-0.1c0.1-0.15,0.19-0.31,0.27-0.48C55.41,57.9,55.62,57.16,55.73,56.31
   M55.36,53.67L55.36,53.67c0.01,0.01,0.02,0.02,0.02,0.03c-0.04,0.58-0.15,1.11-0.32,1.58c-0.17,0.47-0.41,0.89-0.7,1.24
  c-0.35,0.41-0.7,0.62-0.84,0.7c-0.01,0-0.01,0-0.01,0c-0.01,0-0.02-0.01-0.03-0.01c-0.47-0.63-0.69-1.41-0.68-2.31
  c0-0.29,0.04-0.58,0.09-0.87c0-0.01,0.01-0.02,0.02-0.02c0.01,0,0.02,0,0.03,0.01c0.41,0.51,0.64,1.17,0.65,1.19
  c0.03,0.09,0.11,0.15,0.21,0.16c0.01,0,0.01,0,0.02,0c0.09,0,0.17-0.05,0.21-0.14c0.38-0.8,0.91-1.29,1.29-1.56
  C55.33,53.66,55.35,53.66,55.36,53.67 M55.28,50.65c0.01-0.01,0.02-0.01,0.03-0.01c0.01,0.01,0.02,0.02,0.02,0.03
  c0.01,0.58-0.04,1.12-0.16,1.6c-0.12,0.49-0.32,0.93-0.58,1.3c-0.3,0.44-0.63,0.69-0.76,0.78c0,0-0.01,0.01-0.02,0.01
  c-0.01,0-0.02,0-0.02-0.01c-0.82-0.93-0.9-2.31-0.87-3.05c0-0.01,0.01-0.02,0.02-0.03c0.01-0.01,0.03,0,0.03,0.01
  c0.44,0.48,0.73,1.05,0.74,1.08c0.04,0.09,0.13,0.14,0.22,0.13c0.1-0.01,0.18-0.07,0.21-0.16C54.45,51.49,54.93,50.96,55.28,50.65
   M54.95,47.59L54.95,47.59c0.01-0.01,0.02-0.01,0.03-0.01C55,47.59,55,47.6,55,47.61c0.07,0.58,0.07,1.12,0,1.61
  c-0.08,0.5-0.22,0.95-0.45,1.35c-0.26,0.47-0.58,0.76-0.7,0.86c0,0-0.01,0.01-0.02,0.01c-0.01,0-0.01,0-0.02-0.01
  c-0.81-0.68-1.06-2.13-1.13-2.94c0-0.01,0.01-0.03,0.02-0.03c0.01-0.01,0.02,0,0.03,0.01c0.47,0.43,0.81,0.97,0.82,0.98
  c0.05,0.08,0.14,0.12,0.24,0.11c0.09-0.02,0.17-0.08,0.19-0.18C54.21,48.51,54.63,47.93,54.95,47.59 M54.47,44.68L54.47,44.68
  c0.01-0.01,0.02-0.01,0.03-0.01c0.01,0,0.02,0.01,0.02,0.02c0.1,0.57,0.12,1.12,0.07,1.61c-0.05,0.5-0.18,0.96-0.38,1.37
  c-0.24,0.48-0.53,0.77-0.64,0.88c-0.01,0.01-0.01,0.01-0.02,0.01c-0.01,0-0.01,0-0.02-0.01c-0.68-0.58-1.01-1.43-1.16-2.04
  c-0.07-0.27-0.12-0.56-0.15-0.85c0-0.01,0.01-0.02,0.02-0.03c0.01-0.01,0.02-0.01,0.03,0c0.51,0.41,0.89,0.96,0.89,0.96
  c0.05,0.08,0.15,0.12,0.24,0.1c0.09-0.02,0.17-0.09,0.18-0.18C53.77,45.63,54.17,45.03,54.47,44.68 M38.77,60.52
  c0.03,0.09,0.1,0.16,0.18,0.21c1,0.49,1.82,1.51,2.13,1.92c0,0,0,0.01,0,0.01c-0.04,0.09-0.09,0.16-0.14,0.23
  c-0.17,0.19-0.4,0.29-0.71,0.29c-0.01,0-0.03,0-0.04,0c0,0-0.01,0-0.01-0.01c-0.1-0.23-0.29-0.5-0.56-0.82
  c-0.35-0.41-1.08-0.92-1.09-0.93c-0.16-0.11-0.39-0.08-0.5,0.09c-0.11,0.16-0.07,0.39,0.09,0.5c0.19,0.13,0.72,0.53,0.96,0.81
  c0.3,0.35,0.41,0.56,0.45,0.65c0,0,0,0.01,0,0.01c-0.04,0.08-0.11,0.2-0.21,0.3c-0.17,0.16-0.37,0.22-0.62,0.19
  c-0.01,0-0.01,0-0.01-0.01c-0.1-0.23-0.33-0.68-0.76-1.16c-0.13-0.15-0.36-0.16-0.51-0.03c-0.07,0.07-0.11,0.15-0.12,0.25
  c0,0.1,0.03,0.19,0.09,0.26c0.31,0.35,0.5,0.67,0.6,0.89c0,0.01,0,0.01,0,0.02c-0.08,0.05-0.17,0.1-0.26,0.14
  c-0.24,0.1-0.5,0.12-0.77,0.08c0,0-0.01,0-0.01-0.01c0,0,0-0.01,0-0.01c0.12-0.17,0.2-0.35,0.22-0.54c0.02-0.22-0.02-0.55-0.36-0.88
  c-0.17-0.18-0.53-0.34-1-0.25c0,0-0.01,0-0.01,0c0,0,0-0.01-0.01-0.01c-0.02-0.26-0.15-0.5-0.39-0.7c-0.36-0.32-0.79-0.4-1.26-0.26
  c-0.01,0-0.02,0-0.03,0.01l-0.01,0.01c0,0-0.01,0-0.01-0.01c-0.06-0.19-0.22-0.45-0.62-0.65c-0.34-0.17-0.72-0.2-1.1-0.07
  c0,0-0.01,0-0.01,0c-0.33-0.29-0.77-0.35-0.9-0.36c-0.53-0.07-1.25,0.19-1.7,0.63c0,0,0,0,0,0c-2.4,1.29-5.5,2.69-6.72,3.23
  c0,0,0,0,0,0c-0.01,0-0.01,0-0.01-0.01c-0.66-1.24-1.22-2.59-1.67-4c-0.13-0.4-0.25-0.8-0.35-1.21c0,0,0-0.01,0-0.01
  c0,0,0.01-0.01,0.01-0.01c3.52-0.4,6.34-0.82,8.4-1.23c2.14-0.43,3.52-0.87,4.22-1.34l0.01-0.01c0.83-0.59,1.4-0.87,2.2-0.8
  c0.25,0.02,0.47,0.05,0.67,0.08c0.01,0,0.01,0.01,0.01,0.01c0,0.01,0,0.01-0.01,0.01c-0.2,0.07-0.39,0.16-0.57,0.29
  c-0.33,0.23-0.53,0.4-0.7,0.54c-0.18,0.15-0.33,0.27-0.56,0.42c-0.16,0.1-0.37,0.21-0.58,0.31c-0.48,0.23-0.85,0.42-0.97,0.73
  l-0.01,0l0.01,0c-0.12,0.34-0.07,0.64,0.16,0.97c0.36,0.5,0.94,0.47,1.42,0.44c0.54-0.03,1.19-0.23,1.67-0.51
  c0.17-0.1,0.33-0.2,0.46-0.29c0.22-0.14,0.4-0.27,0.54-0.29c0.01,0,0.01,0,0.02-0.01c0.43-0.12,0.92-0.07,1.49,0.15
  c0.51,0.2,1.01,0.5,1.47,0.81c1.11,0.73,1.94,1.72,2.16,2c0,0,0,0.01,0,0.01c-0.02,0.12-0.07,0.3-0.21,0.43
  c-0.14,0.13-0.34,0.2-0.61,0.2c0,0-0.01,0-0.01-0.01c-0.34-0.46-1.24-1.58-2.39-2.14c-0.18-0.09-0.39-0.01-0.48,0.17
  C38.75,60.33,38.74,60.43,38.77,60.52 M36.05,64.24c-0.01,0.01-0.02,0.01-0.03,0.02l0,0c-0.15,0.12-0.62,0.41-1.01,0.41
  c-0.05,0-0.09,0-0.13-0.01c-0.08-0.02-0.19-0.05-0.3-0.18c0,0,0-0.01,0-0.01c0.18-0.4,0.6-0.67,0.97-0.89
  c0.49-0.29,0.72-0.12,0.74-0.1c0.16,0.15,0.15,0.25,0.15,0.29C36.42,63.95,36.17,64.16,36.05,64.24l-0.01-0.01L36.05,64.24z
   M31.87,62.21c0.51-0.49,0.92-0.65,1.26-0.47c0.1,0.05,0.23,0.13,0.26,0.24c0.01,0.04,0.01,0.08,0,0.12c0,0,0,0.01-0.01,0.01
  c-0.08,0.05-0.16,0.11-0.24,0.17c-0.54,0.38-0.87,0.78-0.98,1.19c0,0.01-0.01,0.01-0.01,0.01h0c-0.09-0.01-0.17-0.03-0.24-0.06
  c-0.44-0.15-0.47-0.39-0.47-0.47C31.43,62.72,31.55,62.52,31.87,62.21 M31.37,61.69c-0.25,0.24-0.51,0.53-0.61,0.92
  c0,0.01-0.01,0.01-0.01,0.01h0c-0.07,0-0.15-0.01-0.21-0.02c-0.26-0.04-0.45-0.13-0.49-0.23c-0.02-0.05-0.08-0.19,0.09-0.42
  c0.26-0.34,0.85-0.61,1.22-0.56c0.01,0,0.02,0,0.03,0c0.05,0,0.14,0.02,0.23,0.05c0.01,0,0.01,0.01,0.01,0.01c0,0.01,0,0.01,0,0.01
  C31.54,61.53,31.46,61.6,31.37,61.69 M33.57,62.87c0.66-0.47,1.01-0.62,1.35-0.33c0.1,0.09,0.15,0.17,0.14,0.24
  c-0.01,0.14-0.16,0.31-0.3,0.42c-0.42,0.29-0.7,0.61-0.86,0.98c0,0-0.01,0.01-0.01,0.01c-0.09,0.01-0.23,0.03-0.39,0.03
  c-0.18,0-0.37-0.03-0.5-0.11c-0.06-0.04-0.13-0.11-0.15-0.28C32.82,63.46,33.29,63.07,33.57,62.87 M40.9,30.82
  c-0.01-0.01-0.01-0.02-0.01-0.03c0-0.01,0.01-0.02,0.02-0.02c0.3-0.1,0.61-0.16,0.91-0.17c0.85-0.05,1.57,0.22,2.13,0.82
  c0.01,0.01,0.01,0.02,0.01,0.03c0,0.01-0.01,0.02-0.02,0.02c-0.18,0.06-0.46,0.14-0.81,0.15c-0.04,0-0.08,0-0.12,0
  C42.29,31.61,41.58,31.34,40.9,30.82 M41.9,32.03H30.51c1.82-0.91,3.73-1.38,5.7-1.38S40.09,31.12,41.9,32.03 M43.34,29.7
  c-0.26,0.1-0.66,0.24-1.11,0.33c-0.29,0.05-0.56,0.08-0.82,0.08c-0.61,0-1.14-0.15-1.57-0.46c-0.01-0.01-0.01-0.02-0.01-0.03
  c0-0.01,0.01-0.02,0.01-0.02c0.2-0.11,0.52-0.27,0.92-0.36c0.44-0.1,0.89-0.12,1.33-0.04c0.42,0.07,0.83,0.22,1.25,0.45
  c0.01,0,0.02,0.02,0.02,0.03C43.36,29.69,43.35,29.7,43.34,29.7 M40.61,28.74c-0.28,0.13-0.78,0.31-1.52,0.4
  c-0.1,0.01-0.18,0.08-0.2,0.18c-0.02,0.1,0.01,0.2,0.1,0.25c0.01,0,0.58,0.4,1,0.93c0.01,0.01,0.01,0.02,0,0.03
  c-0.01,0.01-0.02,0.02-0.03,0.02c-0.7-0.02-2.01-0.23-2.95-1.35c-0.01-0.01-0.01-0.03,0-0.04c0.15-0.14,0.41-0.34,0.81-0.49
  c0.75-0.28,1.71-0.28,2.79,0.02c0.01,0,0.02,0.01,0.02,0.03C40.63,28.72,40.62,28.73,40.61,28.74 M37.49,28.22
  c-0.25,0.2-0.7,0.47-1.43,0.7c-0.1,0.03-0.16,0.12-0.17,0.22c0,0.1,0.06,0.19,0.16,0.23c0,0,0.63,0.24,1.13,0.66
  c0.01,0.01,0.01,0.02,0.01,0.03c0,0.01-0.01,0.02-0.02,0.02c-0.21,0.02-0.42,0.03-0.62,0.03c-0.71,0-1.73-0.12-2.51-0.72
  c-0.01-0.01-0.02-0.03-0.01-0.04c0.12-0.17,0.33-0.42,0.69-0.65c0.68-0.43,1.63-0.62,2.76-0.54c0.01,0,0.02,0.01,0.03,0.02
  C37.5,28.2,37.5,28.22,37.49,28.22 M34.29,28.28c-0.18,0.25-0.56,0.63-1.29,0.99c-0.09,0.05-0.15,0.14-0.13,0.25s0.09,0.18,0.19,0.2
  c0.01,0,0.66,0.12,1.25,0.42c0.01,0,0.02,0.02,0.02,0.03c0,0.01-0.01,0.02-0.02,0.03c-0.28,0.09-0.55,0.16-0.83,0.21
  c-0.29,0.05-0.58,0.08-0.86,0.08c-0.56,0-1.06-0.1-1.5-0.31c-0.01-0.01-0.02-0.02-0.01-0.04c0.08-0.19,0.23-0.48,0.53-0.78
  c0.58-0.58,1.49-0.97,2.64-1.13c0.01,0,0.02,0,0.03,0.01C34.29,28.25,34.29,28.26,34.29,28.28 M31.29,28.81L31.29,28.81
  c-0.15,0.34-0.46,0.87-1.13,1.45c-0.08,0.07-0.1,0.17-0.07,0.26c0.03,0.09,0.12,0.15,0.22,0.15h0c0.05,0,0.31,0,0.64,0.05
  c0.24,0.03,0.47,0.08,0.67,0.14c0.01,0,0.02,0.01,0.02,0.03s-0.01,0.02-0.02,0.03c-0.26,0.13-0.53,0.25-0.8,0.34
  c-0.53,0.18-1.03,0.28-1.51,0.28c-0.32,0-0.62-0.04-0.89-0.12c-0.01,0-0.02-0.02-0.02-0.04c0.11-0.53,0.6-1.85,2.84-2.61
  c0.01,0,0.02,0,0.03,0.01C31.29,28.78,31.29,28.79,31.29,28.81 M43.25,32.8c0.62,0.4,1.22,0.85,1.8,1.35H27.37
  c0.58-0.5,1.17-0.95,1.8-1.35H43.25z M45.87,34.93c0.42,0.42,0.83,0.87,1.23,1.35h-8.61c-1.15-0.84-2.37-0.78-2.56-0.77
  c-0.16,0-1.32,0.05-2.39,0.77h-8.22c0.39-0.48,0.8-0.93,1.23-1.35H45.87z M33.38,44.94c-0.73-0.06-1.34,0.13-2.1,0.47
  c-0.01,0-0.01,0-0.01,0c0,0-0.01-0.01-0.01-0.01c0.01-0.07,0.02-0.13,0.03-0.2c0.4-2.01,1.19-3.39,1.78-4.19
  c0.44-0.6,0.85-0.97,1.05-1.15c0.06-0.04,0.12-0.09,0.19-0.15c0.17-0.15,0.2-0.4,0.06-0.58c-0.14-0.18-0.39-0.22-0.57-0.09
  c-0.01,0.01-0.08,0.06-0.2,0.16c-0.32,0.22-0.63,0.29-0.82,0.17c-0.16-0.09-0.24-0.31-0.19-0.57c0.08-0.45,0.57-1.04,0.76-1.22
  c0.01-0.01,0.01-0.02,0.02-0.02c0.99-1.18,2.58-1.2,2.6-1.2c0.01,0,0.53-0.04,1.16,0.16c0.85,0.28,1.51,0.86,1.95,1.74
  c0.63,1.23,1.1,2.47,1.45,3.8c0,0,0,0.01,0,0.01c0,0-0.01,0-0.01,0c-0.91-0.31-1.63-0.89-1.66-0.92c-0.18-0.15-0.44-0.12-0.59,0.06
  c-0.15,0.18-0.12,0.45,0.06,0.6c0.04,0.04,1.13,0.93,2.43,1.21c0.01,0,0.01,0.01,0.01,0.01c0.1,0.47,0.19,0.96,0.28,1.55
  c0,0.01,0,0.01,0,0.01c0,0-0.01,0-0.01,0c-0.43-0.23-0.95-0.37-1.37-0.49c-0.28-0.08-0.54-0.14-0.75-0.23
  c-0.89-0.36-1.66-0.96-1.67-0.97c-0.18-0.14-0.45-0.11-0.59,0.07c-0.14,0.18-0.11,0.45,0.07,0.59c0.03,0.03,0.86,0.68,1.88,1.09
  c0.25,0.1,0.54,0.18,0.84,0.26c1.14,0.3,1.68,0.55,1.7,1.15v0.01c-0.01,0.11-0.09,0.18-0.16,0.26c-0.33,0.36-1.01,0.44-1.36,0.44
  c-0.04,0-1.21,0-1.21,0c-0.21,0-1.31-0.05-2.26-0.66C35.01,45.36,34.16,45,33.38,44.94 M35.59,46.75c0,0.01-0.01,0.01-0.01,0.01
  h-3.39c-0.35,0-0.59-0.09-0.74-0.27c-0.04-0.05-0.08-0.11-0.1-0.17c0-0.01,0-0.01,0.01-0.02c1.53-0.7,2.24-0.83,4.24,0.44
  C35.59,46.74,35.59,46.74,35.59,46.75 M36.72,49.79h15.54c0.04,0.48,0.07,0.97,0.09,1.46H36.72V49.79z M36.72,49.01v-1.36h15.29
  c0.07,0.45,0.13,0.9,0.18,1.36H36.72z M41.59,46.89c0.15-0.17,0.27-0.37,0.34-0.6c0.01-0.03,0.02-0.05,0.02-0.08
  c0.05-0.21,0.07-0.44,0.05-0.68h9.57c0.11,0.45,0.2,0.9,0.29,1.35H41.59z M41.9,44.76c-0.06-0.43-0.14-0.88-0.23-1.35h9.29
  c0.04,0.11,0.08,0.23,0.11,0.34c0.11,0.33,0.21,0.67,0.3,1.01H41.9z M41.52,42.64c-0.1-0.43-0.21-0.88-0.35-1.35h8.98
  c0.19,0.44,0.38,0.89,0.55,1.35H41.52z M40.93,40.52c-0.15-0.44-0.32-0.89-0.52-1.35h8.67c0.25,0.44,0.49,0.89,0.71,1.35H40.93z
   M40.07,38.4c-0.08-0.18-0.17-0.35-0.26-0.53c-0.16-0.31-0.34-0.58-0.53-0.82h8.41c0.32,0.43,0.63,0.89,0.92,1.35H40.07z
   M32.68,37.05c-0.18,0.19-0.66,0.75-0.86,1.35h-8.02c0.29-0.47,0.6-0.92,0.92-1.35H32.68z M31.74,39.17
  c0.06,0.41,0.27,0.75,0.61,0.94c0.08,0.04,0.16,0.08,0.24,0.11c0,0,0.01,0,0.01,0.01c0,0,0,0.01,0,0.01
  c-0.07,0.09-0.14,0.18-0.22,0.29h-9.76c0.22-0.46,0.46-0.91,0.71-1.35H31.74z M31.87,41.29c-0.23,0.39-0.46,0.84-0.68,1.35h-9.47
  c0.17-0.46,0.35-0.91,0.55-1.35H31.87z M30.9,43.41c-0.14,0.41-0.27,0.87-0.37,1.35h-9.49c0.09-0.34,0.19-0.68,0.3-1.01
  c0.04-0.12,0.07-0.23,0.11-0.34H30.9z M30.41,45.53c-0.01,0.19-0.01,0.38,0.01,0.55c0,0.03,0.01,0.05,0.01,0.08
  c0.04,0.28,0.14,0.52,0.27,0.72H20.55c0.09-0.46,0.18-0.91,0.29-1.35H30.41z M35.7,47.65v1.36H20.23c0.05-0.46,0.11-0.91,0.18-1.36
  H35.7z M35.7,49.79v1.46H20.07c0.01-0.49,0.05-0.98,0.09-1.46H35.7z M35.7,52.04v3.14c0,0,0,0.01,0,0.01c0,0-0.01,0-0.01,0
  c-0.03,0-0.06,0-0.1,0c-0.87,0-1.56,0.36-2.38,0.95c-1.24,0.83-5.41,1.66-12.4,2.46c-0.01,0-0.01,0-0.01-0.01
  c-0.49-2.07-0.74-4.24-0.74-6.44c0-0.03,0-0.07,0-0.1H35.7z M40.73,58.97c-0.76-0.5-2.18-1.42-3.54-1.05
  c-0.27,0.06-0.5,0.22-0.77,0.4c-0.13,0.09-0.27,0.18-0.42,0.27C35.55,58.84,35,58.98,34.65,59c-0.41,0.02-0.67,0.03-0.79-0.14
  c-0.1-0.13-0.1-0.2-0.08-0.27c0,0,0,0,0-0.01c0.08-0.09,0.41-0.25,0.61-0.35c0.23-0.11,0.46-0.23,0.66-0.35
  c0.26-0.17,0.43-0.31,0.62-0.46c0.17-0.14,0.36-0.3,0.67-0.51c0.43-0.3,0.89-0.31,1.59-0.33c0.11,0,0.22-0.01,0.34-0.01
  c0.08,0,0.17,0,0.26-0.01c0.75-0.03,1.42,0.21,2.42,0.57c0.29,0.11,0.62,0.23,0.99,0.35c0,0,0,0,0.01,0c0.01,0,1.36,0.43,3.25,0.89
  c1.61,0.39,3.99,0.87,6.22,1.02c0,0,0.01,0,0.01,0c0,0,0,0.01,0,0.01c-0.1,0.38-0.21,0.75-0.33,1.12c-0.47,1.46-1.05,2.85-1.75,4.13
  c0,0-0.01,0.01-0.01,0.01c0,0,0,0-0.01,0c-1.09-0.45-3.8-1.63-5.59-2.96c-0.36-0.26-0.61-0.52-0.73-0.66c0,0,0,0,0,0
  c0-0.01-0.01-0.01-0.01-0.01l0-0.01c-0.04-0.05-0.06-0.07-0.06-0.08C42.55,60.5,41.77,59.65,40.73,58.97 M42.16,56.8
  c-0.36-0.12-0.69-0.24-0.97-0.35c-1.05-0.38-1.81-0.66-2.7-0.61c-0.05,0-0.1,0-0.15,0.01c0,0,0,0-0.01,0
  c-0.49-0.24-0.94-0.42-1.59-0.54c-0.01,0-0.01-0.01-0.01-0.01v-3.26h15.64c0,0.03,0,0.07,0,0.1c0,2.23-0.26,4.43-0.76,6.53
  c0,0.01-0.01,0.01-0.01,0.01C47.35,58.44,42.37,56.87,42.16,56.8 M53.55,41.73c0.01-0.01,0.02-0.01,0.03-0.01
  c0.01,0,0.02,0.01,0.02,0.02c0.18,0.55,0.28,1.09,0.29,1.59c0.02,0.5-0.05,0.98-0.19,1.41c-0.17,0.51-0.42,0.84-0.52,0.96
  c-0.01,0.01-0.01,0.01-0.02,0.01c-0.01,0-0.01,0-0.02-0.01c-0.63-0.4-1.12-1.03-1.45-1.88c-0.1-0.26-0.19-0.54-0.25-0.82
  c0-0.01,0-0.02,0.01-0.03c0.01-0.01,0.02-0.01,0.03,0c0.57,0.34,1.02,0.84,1.03,0.84c0.06,0.07,0.16,0.1,0.25,0.06
  c0.09-0.03,0.15-0.11,0.16-0.21C52.99,42.77,53.3,42.12,53.55,41.73 M51.8,41.11c0.09-0.04,0.14-0.13,0.14-0.22
  c-0.04-0.89,0.21-1.57,0.42-1.98c0.01-0.02,0.02-0.02,0.03-0.02c0.01,0,0.02,0.01,0.03,0.02c0.23,0.53,0.39,1.05,0.46,1.55
  c0.07,0.5,0.06,0.98-0.04,1.42c-0.12,0.52-0.33,0.88-0.42,1.01c0,0.01-0.01,0.01-0.02,0.01c0,0-0.01,0-0.01,0
  c-0.67-0.33-1.22-0.91-1.64-1.72c-0.13-0.25-0.24-0.52-0.33-0.79c0-0.01,0-0.02,0.01-0.03c0.01-0.01,0.02-0.01,0.03-0.01
  c0.59,0.28,1.11,0.73,1.11,0.73C51.61,41.13,51.71,41.15,51.8,41.11L51.8,41.11 M50.55,38.51c0.08-0.05,0.13-0.15,0.11-0.24
  c-0.14-0.88,0.02-1.58,0.18-2.01c0-0.01,0.01-0.02,0.03-0.02h0c0.01,0,0.02,0.01,0.03,0.01c0.29,0.5,0.51,1.01,0.64,1.49
  c0.13,0.49,0.17,0.96,0.12,1.42c-0.05,0.53-0.22,0.91-0.29,1.04c-0.01,0.01-0.02,0.02-0.03,0.02c0,0-0.01,0-0.01,0
  c-0.76-0.27-1.39-0.78-1.88-1.54c-0.16-0.24-0.3-0.5-0.41-0.78c0-0.01,0-0.02,0.01-0.03c0.01-0.01,0.02-0.01,0.03-0.01
  c0.65,0.18,1.21,0.63,1.21,0.63C50.36,38.55,50.47,38.56,50.55,38.51 M48.69,36.11c0.08,0.06,0.19,0.06,0.28,0
  c0.08-0.06,0.12-0.17,0.09-0.26c-0.24-0.79-0.2-1.52-0.13-1.99c0-0.01,0.01-0.02,0.02-0.02c0.01,0,0.02,0,0.03,0.01
  c0.36,0.44,0.65,0.9,0.85,1.34c0.21,0.46,0.32,0.92,0.35,1.38c0.03,0.51-0.06,0.9-0.12,1.08c0,0.01-0.02,0.02-0.03,0.02h-0.01
  c-0.74-0.14-1.43-0.55-2.06-1.22c-0.21-0.22-0.4-0.47-0.58-0.72c0-0.01-0.01-0.02,0-0.03c0.01-0.01,0.02-0.02,0.03-0.02
  C48.12,35.72,48.68,36.1,48.69,36.11 M46.82,33.96c0.09,0.04,0.2,0.01,0.26-0.06c0.07-0.07,0.08-0.18,0.03-0.27
  c-0.41-0.79-0.48-1.5-0.46-1.96c0-0.01,0.01-0.02,0.02-0.03c0.01-0.01,0.02,0,0.03,0.01c0.42,0.38,0.77,0.78,1.04,1.19
  c0.27,0.42,0.46,0.86,0.57,1.31c0.12,0.53,0.09,0.95,0.07,1.11c0,0.01-0.01,0.03-0.03,0.03c-0.01,0-0.03,0-0.04,0
  c-0.84,0-1.61-0.46-2.11-0.85c-0.25-0.19-0.49-0.41-0.72-0.65c-0.01-0.01-0.01-0.02-0.01-0.03c0.01-0.01,0.02-0.02,0.03-0.02
  C46.16,33.71,46.81,33.95,46.82,33.96 M46.08,32.01c0.2,0.51,0.22,0.99,0.22,1.23c0,0.02-0.01,0.03-0.03,0.03c-0.04,0-0.09,0-0.13,0
  c-1.03,0-2.24-0.7-2.86-1.12c-0.01-0.01-0.01-0.02-0.01-0.03c0-0.01,0.01-0.02,0.03-0.02c0.64-0.12,1.26,0.01,1.28,0.02
  c0.1,0.02,0.2-0.02,0.26-0.1c0.05-0.08,0.05-0.2-0.02-0.27c-0.41-0.51-0.66-1.1-0.8-1.51c0-0.01,0-0.02,0.01-0.03
  c0.01-0.01,0.02-0.01,0.03-0.01C45.06,30.53,45.75,31.14,46.08,32.01 M26.92,29.14c-0.01,0-0.01,0-0.01-0.01
  c0-0.01,0-0.01,0.01-0.02c0.21-0.11,0.43-0.2,0.65-0.28c0.61-0.21,1.19-0.35,1.48-0.42c0.65-0.15,1.11-0.43,1.13-0.45
  c0.03-0.02,0.05-0.06,0.04-0.09c-0.01-0.04-0.04-0.06-0.07-0.07l-3.44-0.5c-0.01,0-0.01-0.01-0.01-0.01c0-0.01,0-0.01,0.01-0.01
  l3.44-0.51c0.04-0.01,0.08-0.04,0.08-0.09c0-0.04-0.03-0.08-0.08-0.09c-0.01,0-0.66-0.1-1.33-0.41c-0.2-0.09-0.36-0.18-0.52-0.27
  c-0.4-0.21-0.74-0.4-1.35-0.51c-0.01,0-0.01-0.01-0.01-0.01s0.01-0.01,0.01-0.01c0.23-0.02,0.47-0.02,0.71-0.01
  c0.64,0.04,1.23,0.13,1.52,0.18c0.65,0.11,1.19,0.03,1.21,0.02c0.03-0.01,0.06-0.03,0.07-0.07c0.01-0.03-0.01-0.07-0.04-0.09
  l-2.99-1.78c-0.01,0-0.01-0.01-0.01-0.02c0-0.01,0.01-0.01,0.02-0.01l3.37,0.85c0.04,0.01,0.08-0.01,0.1-0.05
  c0.02-0.04,0-0.09-0.03-0.11c-0.01,0-0.56-0.34-1.07-0.89c-0.15-0.16-0.27-0.31-0.38-0.45c-0.28-0.35-0.53-0.65-1.06-0.99
  c-0.01,0-0.01-0.01-0.01-0.02c0-0.01,0.01-0.01,0.02-0.01c0.22,0.07,0.44,0.16,0.66,0.26c0.58,0.28,1.09,0.59,1.34,0.75
  c0.57,0.36,1.09,0.48,1.11,0.49c0.04,0.01,0.07-0.01,0.09-0.04c0.02-0.03,0.02-0.07,0-0.1l-2.08-2.79c0-0.01,0-0.01,0-0.02
  c0.01,0,0.01,0,0.02,0l2.8,2.08c0.03,0.03,0.08,0.02,0.11-0.01c0.03-0.03,0.03-0.08,0.01-0.11c0-0.01-0.39-0.53-0.65-1.23
  c-0.08-0.2-0.13-0.39-0.18-0.56c-0.13-0.43-0.24-0.81-0.6-1.32c0-0.01,0-0.01,0-0.02c0,0,0.01,0,0.02,0
  c0.18,0.15,0.35,0.32,0.51,0.5c0.43,0.48,0.78,0.97,0.95,1.21c0.38,0.55,0.82,0.87,0.84,0.88c0.03,0.02,0.07,0.02,0.1,0
  c0.03-0.02,0.04-0.06,0.04-0.09l-0.86-3.38c0-0.01,0-0.01,0.01-0.02c0.01,0,0.01,0,0.02,0.01l1.79,2.99
  c0.02,0.04,0.07,0.05,0.11,0.04s0.06-0.06,0.05-0.1c-0.01-0.03-0.16-0.66-0.13-1.39c0.01-0.22,0.03-0.41,0.05-0.59
  c0.05-0.45,0.09-0.84-0.05-1.45c0-0.01,0-0.01,0.01-0.02c0.01,0,0.01,0,0.02,0.01c0.11,0.21,0.2,0.43,0.28,0.65
  c0.21,0.61,0.35,1.19,0.41,1.48c0.14,0.64,0.41,1.09,0.44,1.14c0.02,0.03,0.06,0.05,0.09,0.04c0.03-0.01,0.06-0.04,0.07-0.07
  l0.48-3.44c0-0.01,0.01-0.01,0.01-0.01c0.01,0,0.01,0.01,0.01,0.01l0.5,3.44c0.01,0.04,0.04,0.07,0.09,0.07
  c0.04,0,0.08-0.03,0.09-0.07c0.01-0.03,0.11-0.67,0.4-1.34c0.09-0.2,0.18-0.36,0.27-0.53c0.21-0.4,0.4-0.74,0.5-1.36
  c0-0.01,0.01-0.01,0.01-0.01c0.01,0,0.01,0.01,0.01,0.01c0.02,0.23,0.02,0.47,0.01,0.71c-0.04,0.65-0.13,1.24-0.18,1.53
  c-0.12,0.66-0.03,1.2-0.02,1.22c0.01,0.04,0.03,0.06,0.07,0.07c0.04,0.01,0.07-0.01,0.09-0.04l1.78-3c0-0.01,0.01-0.01,0.02-0.01
  c0.01,0,0.01,0.01,0.01,0.02l-0.85,3.38c-0.01,0.04,0.01,0.09,0.05,0.1c0.04,0.02,0.09,0,0.11-0.04c0,0,0.34-0.57,0.88-1.08
  c0.16-0.15,0.31-0.27,0.45-0.38c0.35-0.28,0.65-0.53,0.98-1.06c0-0.01,0.01-0.01,0.02-0.01c0.01,0,0.01,0.01,0.01,0.02
  c-0.07,0.22-0.16,0.45-0.26,0.66c-0.28,0.58-0.59,1.09-0.75,1.35c-0.36,0.57-0.48,1.1-0.49,1.12c-0.01,0.04,0.01,0.07,0.04,0.09
  c0.03,0.02,0.07,0.02,0.1,0l2.78-2.09c0.01,0,0.01,0,0.02,0c0,0.01,0.01,0.01,0,0.02l-2.07,2.8c-0.03,0.03-0.02,0.08,0.01,0.11
  c0.03,0.03,0.08,0.04,0.11,0.01c0.01,0,0.53-0.39,1.23-0.66c0.2-0.08,0.38-0.13,0.56-0.18c0.43-0.13,0.8-0.24,1.31-0.6
  c0.01,0,0.01,0,0.02,0c0,0.01,0,0.01,0,0.02c-0.15,0.18-0.32,0.35-0.49,0.51c-0.48,0.43-0.96,0.78-1.21,0.95
  c-0.55,0.39-0.86,0.83-0.88,0.84c-0.02,0.03-0.02,0.07,0,0.1c0.02,0.03,0.06,0.04,0.09,0.04L45,23.62c0.01,0,0.01,0,0.01,0.01
  c0,0.01,0,0.01,0,0.02l-2.98,1.8c-0.04,0.02-0.05,0.07-0.03,0.11c0.02,0.04,0.06,0.06,0.1,0.05c0.03-0.01,0.65-0.16,1.38-0.13
  c0.22,0.01,0.41,0.03,0.59,0.05c0.45,0.05,0.83,0.09,1.44-0.05c0.01,0,0.01,0,0.01,0.01s0,0.01-0.01,0.02
  c-0.21,0.11-0.43,0.2-0.65,0.28c-0.61,0.21-1.19,0.35-1.48,0.42c-0.65,0.15-1.11,0.43-1.13,0.44c-0.03,0.02-0.05,0.06-0.04,0.09
  c0.01,0.03,0.04,0.06,0.07,0.07l3.43,0.49c0.01,0,0.01,0.01,0.01,0.01c0,0.01,0,0.01-0.01,0.01l-3.44,0.52
  c-0.04,0.01-0.07,0.04-0.07,0.09c0,0.04,0.03,0.08,0.07,0.09c0.01,0,0.65,0.1,1.33,0.41c0.2,0.09,0.36,0.18,0.52,0.27
  c0.4,0.22,0.73,0.4,1.35,0.51c0.01,0,0.01,0.01,0.01,0.01c0,0.01-0.01,0.01-0.01,0.01c-0.13,0.01-0.27,0.02-0.4,0.02
  c-0.1,0-0.2,0-0.3-0.01c-0.64-0.04-1.23-0.13-1.53-0.19c-0.03,0-0.06-0.01-0.09-0.01c0,0,0,0,0,0c-0.54-0.24-1.1-0.36-1.65-0.36
  H41.5c0,0-0.01,0-0.01,0c0,0,0-0.01,0-0.01c0-0.02,0-0.04-0.01-0.07c-0.02-0.09-0.08-0.16-0.17-0.19c-0.64-0.22-1.24-0.36-1.81-0.41
  c-0.03,0-0.06,0-0.08-0.01l-0.01,0c-0.01,0-0.03,0-0.04,0c-0.03,0-0.06,0-0.09,0l-0.02,0l-0.03,0c-0.04,0-0.09,0-0.13,0h-0.03
  c-0.26,0-0.51,0.02-0.75,0.06c-0.01,0-0.01,0-0.01,0c0,0-0.01-0.01-0.01-0.01V28c0-0.04,0-0.07-0.02-0.11
  c0-0.01-0.01-0.01-0.01-0.02c-0.04-0.08-0.11-0.13-0.19-0.14c-0.06-0.01-0.11-0.02-0.16-0.02c-0.01,0-0.03,0-0.04,0l-0.02,0
  c-0.04,0-0.07-0.01-0.11-0.01c-0.02,0-0.04,0-0.06-0.01c-0.03,0-0.06-0.01-0.1-0.01c-0.64-0.05-1.24-0.02-1.77,0.08
  c-0.15,0.03-0.29,0.07-0.43,0.11c-0.01,0-0.02,0.01-0.03,0.01c-0.02,0.01-0.05,0.01-0.07,0.02l-0.03,0.01
  c-0.03,0.01-0.06,0.02-0.09,0.03c-0.07,0.02-0.13,0.05-0.2,0.08c-0.01,0-0.01,0-0.01,0c0,0-0.01-0.01,0-0.01l0,0v0
  c0-0.01,0-0.02,0-0.02v0c0.01-0.08-0.01-0.15-0.06-0.21c-0.01-0.01-0.01-0.01-0.02-0.02l0,0c-0.05-0.04-0.12-0.06-0.18-0.06
  c-0.84,0.07-1.58,0.24-2.19,0.51c-0.21,0.09-0.4,0.19-0.58,0.31c0,0-0.01,0-0.01,0c0,0-0.01-0.01-0.01-0.01
  c0.01-0.04,0.01-0.07,0.01-0.07c0,0,0,0,0,0c0.01-0.08-0.03-0.16-0.09-0.22v0c-0.01-0.01-0.01-0.01-0.02-0.02l-0.01,0
  c-0.01-0.01-0.01-0.01-0.02-0.01l-0.01,0c-0.05-0.02-0.12-0.03-0.17-0.01c-0.82,0.23-1.52,0.54-2.09,0.93
  c-0.01,0.01-0.02,0.02-0.03,0.02l-0.02,0.01c0,0,0,0,0,0c-0.17,0.01-0.33,0.01-0.49,0.01c-0.13,0-0.55-0.04-0.59-0.05
  C27.92,29.04,27.53,29,26.92,29.14 M28.23,29.82L28.23,29.82c0.01-0.01,0.02-0.01,0.03,0c0.01,0.01,0.02,0.02,0.02,0.03
  c-0.03,0.46-0.17,1.16-0.65,1.91c-0.05,0.08-0.05,0.18,0,0.26c0.05,0.08,0.15,0.12,0.24,0.1c0.01,0,0.64-0.13,1.29-0.08
  c0.01,0,0.02,0.01,0.03,0.02c0,0.01,0,0.02-0.01,0.03c-0.55,0.44-1.65,1.18-2.83,1.18c-0.04,0-0.08,0-0.13,0
  c-0.02,0-0.03-0.01-0.03-0.03C26.17,32.68,26.31,31.21,28.23,29.82 M24.16,34.16c0.1-0.44,0.29-0.88,0.56-1.3
  c0.27-0.42,0.64-0.83,1.08-1.22c0.01-0.01,0.02-0.01,0.03-0.01c0.01,0,0.02,0.02,0.02,0.03c0.01,0.46-0.05,1.17-0.47,1.97
  c-0.04,0.09-0.03,0.19,0.03,0.27c0.06,0.07,0.16,0.1,0.26,0.07c0.01,0,0.62-0.21,1.26-0.23c0.01,0,0.02,0.01,0.03,0.02
  c0.01,0.01,0,0.02-0.01,0.03c-0.24,0.24-0.49,0.46-0.74,0.65c-0.51,0.39-1.26,0.85-1.99,0.85c-0.03,0-0.06,0-0.09,0
  c-0.01,0-0.03-0.01-0.03-0.03C24.09,35.11,24.04,34.69,24.16,34.16 M23.5,33.81L23.5,33.81c0.01-0.01,0.02-0.01,0.03-0.01
  c0.01,0,0.02,0.01,0.02,0.02c0.09,0.45,0.13,1.16-0.15,2.02c-0.03,0.1,0,0.2,0.08,0.26c0.08,0.06,0.19,0.06,0.28,0.01
  c0.01,0,0.55-0.38,1.26-0.44c0.01,0,0.02,0.01,0.03,0.02c0.01,0.01,0.01,0.02,0,0.03c-0.45,0.64-1.39,1.73-2.61,1.94h0
  c-0.01,0-0.03-0.01-0.03-0.02C22.23,37.1,21.99,35.64,23.5,33.81 M20.89,37.73c0.15-0.48,0.38-0.97,0.7-1.46
  c0.01-0.01,0.02-0.02,0.03-0.01c0.01,0,0.02,0.01,0.03,0.02c0.14,0.44,0.27,1.14,0.1,2.02c-0.02,0.1,0.03,0.21,0.12,0.26
  c0.09,0.05,0.2,0.03,0.28-0.04c0.01,0,0.52-0.5,1.23-0.6c0.01,0,0.02,0,0.03,0.01c0.01,0.01,0.01,0.02,0,0.03
  c-0.1,0.2-0.26,0.51-0.49,0.82c-0.54,0.74-1.18,1.22-1.91,1.44c0,0-0.01,0-0.01,0c-0.01,0-0.02-0.01-0.03-0.02
  c-0.07-0.14-0.22-0.53-0.25-1.06C20.68,38.69,20.75,38.22,20.89,37.73 M19.49,40.44c0.07-0.49,0.23-1.02,0.47-1.55
  c0-0.01,0.01-0.02,0.03-0.02c0.01,0,0.02,0.01,0.03,0.02c0.21,0.41,0.44,1.09,0.4,1.99c-0.01,0.09,0.05,0.18,0.13,0.22
  c0.09,0.04,0.19,0.03,0.26-0.03c0.02-0.02,0.56-0.48,1.17-0.75c0.01,0,0.02,0,0.03,0.01c0.01,0.01,0.01,0.02,0.01,0.03
  c-0.06,0.25-0.15,0.5-0.27,0.74c-0.38,0.78-0.98,1.38-1.79,1.78c0,0-0.01,0-0.01,0c-0.01,0-0.02-0.01-0.02-0.01
  c-0.11-0.16-0.3-0.51-0.4-1.01C19.42,41.42,19.41,40.94,19.49,40.44 M18.72,41.71c0-0.01,0.01-0.02,0.03-0.02
  c0.01,0,0.02,0,0.03,0.01c0.26,0.38,0.58,1.03,0.65,1.92c0.01,0.1,0.07,0.18,0.16,0.21c0.09,0.03,0.19,0,0.25-0.07
  c0-0.01,0.45-0.54,1.07-0.89c0.01-0.01,0.02-0.01,0.03,0c0.01,0.01,0.01,0.02,0.01,0.03c-0.03,0.27-0.09,0.53-0.17,0.79
  c-0.28,0.84-0.8,1.51-1.55,1.98c0,0-0.01,0.01-0.02,0.01c-0.01,0-0.02-0.01-0.02-0.01c-0.1-0.12-0.36-0.45-0.53-0.95
  c-0.15-0.43-0.22-0.9-0.21-1.4C18.46,42.8,18.55,42.27,18.72,41.71 M17.86,44.66L17.86,44.66c0-0.01,0.01-0.02,0.02-0.02
  c0.01,0,0.02,0,0.03,0.01c0.3,0.35,0.7,0.95,0.88,1.82c0.02,0.09,0.09,0.17,0.19,0.19c0.09,0.02,0.19-0.02,0.24-0.1
  c0.04-0.06,0.42-0.59,0.93-0.99c0.01-0.01,0.02-0.01,0.03,0c0.01,0.01,0.02,0.02,0.02,0.03c-0.01,0.26-0.05,0.53-0.11,0.78
  c-0.19,0.86-0.61,1.58-1.24,2.14c-0.01,0.01-0.01,0.01-0.02,0.01c-0.01,0-0.01,0-0.02-0.01c-0.14-0.13-0.41-0.42-0.64-0.87
  c-0.2-0.41-0.33-0.87-0.38-1.37C17.74,45.77,17.76,45.23,17.86,44.66 M17.42,47.61c0-0.01,0.01-0.02,0.02-0.03
  c0.01,0,0.02,0,0.03,0.01c0.32,0.34,0.74,0.92,0.96,1.78c0.03,0.1,0.11,0.17,0.21,0.18c0.1,0.01,0.19-0.04,0.24-0.14
  c0.01-0.02,0.29-0.59,0.78-1.03c0.01-0.01,0.02-0.01,0.03-0.01c0.01,0,0.02,0.02,0.02,0.03c0,0.3-0.02,0.6-0.07,0.89
  c-0.15,0.9-0.5,1.62-1.05,2.12c-0.01,0.01-0.01,0.01-0.02,0.01c-0.01,0-0.01,0-0.02-0.01c-0.12-0.1-0.42-0.38-0.68-0.85
  c-0.22-0.4-0.37-0.85-0.44-1.35C17.35,48.73,17.35,48.18,17.42,47.61 M17.17,50.71L17.17,50.71c0-0.01,0.01-0.02,0.02-0.03
  c0.01-0.01,0.02,0,0.03,0.01c0.06,0.06,0.13,0.12,0.19,0.19c0.27,0.3,0.65,0.8,0.89,1.53c0.03,0.1,0.12,0.16,0.23,0.16
  c0.01,0,0.01,0,0.02,0c0.11-0.01,0.2-0.09,0.22-0.2c0-0.01,0.11-0.64,0.64-1.12c0.01-0.01,0.02-0.01,0.03-0.01
  c0.01,0,0.02,0.01,0.02,0.03c0.06,0.35,0.1,0.89,0,1.47c-0.12,0.69-0.41,1.27-0.86,1.71c-0.01,0.01-0.01,0.01-0.02,0.01
  s-0.01,0-0.02-0.01C18.09,54.11,17.03,53.08,17.17,50.71 M17.06,53.71c0.01-0.01,0.02,0,0.03,0c0.07,0.05,0.14,0.11,0.21,0.17
  c0.3,0.27,0.73,0.73,1.04,1.43c0.04,0.09,0.12,0.14,0.22,0.14l0,0.01l0-0.01c0.09,0,0.18-0.06,0.22-0.15
  c0.01-0.03,0.28-0.68,0.72-1.19c0.01-0.01,0.02-0.01,0.03-0.01c0.01,0,0.02,0.01,0.02,0.02c0.14,0.64,0.23,1.89-0.71,3.17
  c-0.01,0.01-0.01,0.01-0.02,0.01c-0.01,0-0.01,0-0.02,0c-0.49-0.29-1.65-1.21-1.75-3.57C17.05,53.72,17.05,53.71,17.06,53.71
   M17.21,56.85L17.21,56.85c0-0.01,0-0.02,0.01-0.03c0.01-0.01,0.02-0.01,0.03,0c0.41,0.21,1.01,0.62,1.51,1.36
  c0.05,0.08,0.15,0.12,0.24,0.1c0.09-0.02,0.17-0.09,0.19-0.18c0,0,0,0,0,0c0.01-0.04,0.17-0.74,0.51-1.32
  c0-0.01,0.02-0.02,0.02-0.02h0c0.01,0,0.02,0.01,0.03,0.02c0.12,0.26,0.21,0.53,0.27,0.8c0.18,0.85,0.04,1.69-0.42,2.47
  c-0.01,0.01-0.01,0.02-0.03,0.02c0,0-0.01,0-0.01,0c-0.15-0.05-0.53-0.22-0.94-0.58c-0.34-0.3-0.64-0.68-0.87-1.12
  C17.52,57.93,17.34,57.42,17.21,56.85 M17.92,59.76L17.92,59.76c0-0.01,0-0.02,0.01-0.03c0.01-0.01,0.02-0.01,0.03-0.01
  c0.08,0.03,0.16,0.07,0.24,0.11c0.36,0.18,0.89,0.53,1.37,1.14c0.06,0.08,0.16,0.11,0.25,0.08c0.09-0.02,0.16-0.1,0.17-0.2
  c0-0.03,0.11-0.71,0.39-1.3c0.01-0.01,0.01-0.02,0.03-0.02s0.02,0.01,0.03,0.02c0.29,0.65,0.7,1.92,0.12,3.22
  c-0.01,0.01-0.02,0.02-0.03,0.02c0,0-0.01,0-0.01,0C19.96,62.64,18.6,62.03,17.92,59.76 M19.66,64.07
  c-0.31-0.39-0.59-0.85-0.82-1.39c-0.01-0.01,0-0.02,0-0.03c0.01-0.01,0.02-0.01,0.03-0.01c0.08,0.02,0.17,0.05,0.25,0.08
  c0.38,0.14,0.94,0.43,1.49,0.97c0.07,0.07,0.17,0.09,0.26,0.05c0.09-0.04,0.15-0.12,0.15-0.22c0-0.01,0.02-0.69,0.23-1.32
  c0-0.01,0.01-0.02,0.03-0.02c0.01,0,0.02,0.01,0.03,0.02c0.14,0.25,0.26,0.51,0.36,0.77c0.31,0.85,0.36,1.65,0.13,2.39
  c0,0.01-0.02,0.02-0.03,0.02h-0.01c-0.15-0.03-0.56-0.12-1.02-0.39C20.34,64.78,19.98,64.46,19.66,64.07 M20.09,65.45
  c-0.01-0.01,0-0.02,0-0.03c0.01-0.01,0.02-0.02,0.03-0.01c0.45,0.08,1.15,0.29,1.85,0.85c0.08,0.06,0.18,0.07,0.26,0.02
  c0.08-0.05,0.13-0.14,0.12-0.24c0-0.03-0.07-0.65,0.07-1.3c0-0.01,0.01-0.02,0.02-0.02c0.01,0,0.03,0,0.03,0.01
  c0.17,0.24,0.31,0.49,0.44,0.75c0.28,0.56,0.58,1.42,0.42,2.31c0,0.01-0.02,0.03-0.03,0.03c-0.19-0.01-0.59-0.06-1.06-0.27
  c-0.42-0.18-0.81-0.46-1.18-0.81C20.71,66.38,20.38,65.95,20.09,65.45 M22.74,69.22c-0.39-0.31-0.77-0.71-1.11-1.18
  c-0.01-0.01-0.01-0.02,0-0.03c0.01-0.01,0.02-0.02,0.03-0.02c0.46,0.03,1.17,0.17,1.93,0.65c0.08,0.05,0.19,0.05,0.27-0.01
  c0.08-0.06,0.11-0.16,0.09-0.25c0-0.01-0.15-0.63-0.08-1.29c0-0.01,0.01-0.02,0.02-0.03c0.01,0,0.03,0,0.03,0.01
  c0.48,0.58,1.27,1.73,1.19,2.95c0,0.02-0.01,0.03-0.03,0.03c-0.04,0-0.08,0-0.12,0c-0.22,0-0.56-0.03-0.97-0.16
  C23.56,69.76,23.14,69.53,22.74,69.22 M27.05,72.07c-0.07,0.01-0.2,0.03-0.39,0.03c-0.19,0-0.4-0.02-0.6-0.06
  c-0.84-0.17-1.7-0.67-2.56-1.48c-0.01-0.01-0.01-0.02-0.01-0.03c0-0.01,0.01-0.02,0.02-0.02c0.46-0.06,1.18-0.06,2.02,0.27
  c0.09,0.03,0.19,0.01,0.26-0.06c0.07-0.07,0.09-0.17,0.05-0.26c0-0.01-0.25-0.61-0.31-1.28c0-0.01,0.01-0.02,0.02-0.03
  c0.01-0.01,0.02,0,0.03,0c0.58,0.49,1.56,1.52,1.49,2.87C27.07,72.06,27.06,72.07,27.05,72.07 M32.76,74.57
  c-0.67-0.18-1.34-0.41-1.98-0.69c-1.11-0.47-2.19-1.08-3.21-1.8c0,0,0-0.01,0-0.01c0.02-0.4-0.04-0.81-0.17-1.21
  c0-0.01,0-0.01,0.01-0.02c0,0,0.01,0,0.01,0c0.79,0.64,1.47,1.16,2.23,1.59c0.87,0.49,1.79,0.88,2.74,1.17v0l0.23,0.07
  c-0.02,0.34,0.06,0.64,0.24,0.92L32.76,74.57z M34.32,73.83c-0.12,0.33-0.1,0.67,0.07,1.01c0.01,0.01,0,0.03-0.01,0.04
  c-0.01,0.01-0.02,0.01-0.03,0.01c0,0-0.01,0-0.01,0c-0.42-0.15-0.73-0.34-0.91-0.56c-0.16-0.2-0.23-0.42-0.2-0.69
  c0.02-0.2,0.1-0.34,0.26-0.44c0.26-0.17,0.73-0.23,1.36-0.17c0.01,0,0.03,0.01,0.03,0.03c0,0.02,0,0.03-0.01,0.04
  C34.61,73.29,34.43,73.54,34.32,73.83 M36.21,76.84c-0.45,0-0.82-0.37-0.82-0.82c0-0.45,0.37-0.82,0.82-0.82
  c0.45,0,0.82,0.37,0.82,0.82C37.03,76.48,36.66,76.84,36.21,76.84 M37.22,74.94c-0.01,0.02-0.04,0.02-0.05,0
  c-0.26-0.23-0.6-0.36-0.95-0.36c-0.35,0-0.69,0.13-0.96,0.37c-0.01,0.01-0.02,0.01-0.03,0.01c-0.01,0-0.02,0-0.03-0.01
  c-0.21-0.23-0.43-0.57-0.31-0.9c0.27-0.73,1.28-0.74,1.31-0.74c0.07,0,0.31,0.01,0.57,0.1c0.38,0.12,0.63,0.34,0.74,0.64
  C37.64,74.38,37.42,74.72,37.22,74.94 M38.99,74.34c-0.18,0.23-0.49,0.41-0.91,0.56c-0.01,0-0.01,0-0.01,0
  c-0.01,0-0.03-0.01-0.03-0.01c-0.01-0.01-0.01-0.03-0.01-0.04c0.17-0.35,0.19-0.69,0.07-1.01c-0.11-0.29-0.29-0.54-0.54-0.72
  c-0.01-0.01-0.02-0.03-0.01-0.04c0-0.02,0.02-0.03,0.03-0.03c0.44-0.04,1.02-0.05,1.35,0.17c0.15,0.1,0.24,0.24,0.26,0.44
  C39.22,73.91,39.15,74.14,38.99,74.34 M44.87,72.07c0,0,0,0.01,0,0.01c-0.23,0.18-1.09,0.83-2.37,1.46
  c-0.9,0.44-1.82,0.79-2.76,1.04l-0.18,0.04c0.19-0.28,0.28-0.59,0.26-0.94l0.27-0.08v0c0.93-0.29,1.83-0.67,2.69-1.15
  c0.82-0.46,1.56-1.04,2.25-1.61c0,0,0.01-0.01,0.02,0c0,0,0.01,0.01,0,0.01C44.91,71.25,44.85,71.66,44.87,72.07 M42.47,71.95
  c-0.88,0.49-1.79,0.88-2.71,1.15l-0.09,0.03c-0.09-0.18-0.23-0.32-0.4-0.44c-0.88-0.58-2.56-0.16-3.05-0.02c-0.01,0-0.01,0-0.02,0
  c-0.49-0.14-2.17-0.56-3.05,0.02c-0.17,0.11-0.31,0.26-0.4,0.43l-0.15-0.04c-0.91-0.28-1.8-0.66-2.65-1.14
  c-1.92-1.08-3.65-2.62-5.14-4.59c-0.51-0.68-1-1.42-1.44-2.18c0,0,0-0.01,0-0.01c0,0,0-0.01,0.01-0.01c1.02-0.45,3.64-1.64,5.91-2.8
  c0,0,0.01,0,0.01,0c0,0,0.01,0.01,0.01,0.01c0.01,0.1,0.04,0.19,0.08,0.29c0.19,0.44,0.68,0.6,1.05,0.66
  c0.11,0.02,0.23,0.03,0.36,0.03c0.01,0,0.01,0,0.01,0.01c0.14,0.36,0.46,0.62,0.91,0.77c0.15,0.05,0.32,0.08,0.49,0.1
  c0.01,0,0.01,0,0.01,0.01c0.08,0.2,0.21,0.36,0.39,0.49c0.44,0.3,1.06,0.25,1.39,0.2c0,0,0.01,0,0.01,0.01
  c0.2,0.24,0.44,0.39,0.73,0.45c0.28,0.06,0.6,0.02,0.94-0.1c0,0,0.01,0,0.01,0c0,0,0.01,0.01,0.01,0.01v3.98
  c0,0.28,0.23,0.51,0.51,0.51c0.28,0,0.51-0.23,0.51-0.51V65.1c0,0,0-0.01,0.01-0.01c0,0,0.01,0,0.01,0c0.55,0.11,0.98,0.01,1.25-0.1
  c0.24-0.1,0.43-0.22,0.54-0.31c0,0,0.01,0,0.01,0c0.51,0.09,0.97-0.05,1.31-0.4c0.11-0.11,0.2-0.23,0.28-0.37
  c0,0,0.01-0.01,0.01-0.01c0.04,0,0.07,0,0.1,0c0.65,0,1.04-0.29,1.25-0.53c0.11-0.12,0.19-0.26,0.26-0.41c0,0,0.01-0.01,0.01-0.01
  c0.43-0.02,0.78-0.15,1.04-0.4c0.12-0.11,0.21-0.25,0.28-0.4c0,0,0.01-0.01,0.01-0.01c0,0,0.01,0,0.01,0
  c1.82,1.42,4.7,2.68,5.86,3.16c0,0,0.01,0,0.01,0.01c0,0,0,0.01,0,0.01c-0.42,0.71-0.88,1.4-1.36,2.04
  C46.12,69.33,44.39,70.87,42.47,71.95 M48.94,70.57L48.94,70.57c-1.07,1.01-1.98,1.36-2.56,1.47c-0.2,0.04-0.4,0.06-0.6,0.06
  c-0.17,0-0.31-0.02-0.39-0.03c-0.01,0-0.03-0.01-0.03-0.03c-0.03-0.77,0.26-1.52,0.87-2.23c0.19-0.22,0.41-0.43,0.64-0.62
  c0.01-0.01,0.02-0.01,0.03,0c0.01,0.01,0.02,0.02,0.02,0.03c-0.07,0.64-0.32,1.25-0.32,1.26c-0.04,0.09-0.02,0.19,0.05,0.26
  c0.07,0.07,0.17,0.09,0.26,0.06c0.83-0.33,1.56-0.33,2.02-0.27c0.01,0,0.02,0.01,0.02,0.02C48.95,70.55,48.94,70.56,48.94,70.57
   M50.82,68.04c-0.34,0.47-0.72,0.86-1.11,1.17c-0.4,0.31-0.82,0.54-1.25,0.69c-0.41,0.13-0.75,0.16-0.97,0.16c-0.04,0-0.08,0-0.12,0
  c-0.01,0-0.03-0.01-0.03-0.03c-0.05-0.74,0.17-1.51,0.66-2.28c0.15-0.24,0.33-0.47,0.52-0.69c0.01-0.01,0.02-0.01,0.03-0.01
  c0.01,0,0.02,0.01,0.02,0.03c0.06,0.63-0.06,1.25-0.07,1.32c-0.02,0.09,0.02,0.19,0.1,0.24c0.08,0.06,0.18,0.06,0.26,0
  c0.75-0.48,1.46-0.62,1.93-0.65c0.01,0,0.02,0.01,0.03,0.02C50.83,68.02,50.83,68.03,50.82,68.04 M52.37,65.45
  c-0.29,0.5-0.62,0.93-0.98,1.28c-0.36,0.35-0.76,0.63-1.18,0.81c-0.49,0.22-0.9,0.26-1.06,0.27c-0.02,0-0.03-0.01-0.03-0.03
  c-0.13-0.73,0.01-1.52,0.42-2.33c0.13-0.25,0.27-0.5,0.44-0.74c0.01-0.01,0.02-0.01,0.03-0.01c0.01,0,0.02,0.01,0.02,0.02
  c0.13,0.64,0.07,1.31,0.07,1.32c-0.01,0.1,0.04,0.19,0.12,0.23c0.08,0.05,0.19,0.04,0.26-0.02c0.7-0.56,1.39-0.77,1.85-0.85
  c0.01,0,0.02,0,0.03,0.01C52.38,65.42,52.38,65.44,52.37,65.45 M53.62,62.6L53.62,62.6c-0.23,0.55-0.52,1.03-0.84,1.43
  c-0.32,0.39-0.68,0.71-1.07,0.94c-0.44,0.26-0.83,0.36-1.02,0.39h0c-0.01,0-0.02-0.01-0.03-0.02c-0.22-0.74-0.17-1.55,0.14-2.4
  c0.09-0.25,0.21-0.51,0.35-0.75c0-0.01,0.02-0.02,0.03-0.02c0.01,0,0.02,0.01,0.03,0.02c0.2,0.63,0.23,1.3,0.23,1.31
  c0,0.1,0.07,0.18,0.15,0.21c0.09,0.03,0.19,0.01,0.26-0.06c0,0,0,0,0,0c0.55-0.61,1.11-0.89,1.48-1.01
  c0.09-0.03,0.18-0.06,0.27-0.08c0.01,0,0.02,0,0.03,0.01C53.62,62.58,53.62,62.59,53.62,62.6 M54.52,59.74L54.52,59.74
  c-0.18,0.55-0.41,1.04-0.68,1.46c-0.28,0.42-0.61,0.77-0.97,1.04c-0.43,0.32-0.83,0.45-0.98,0.49c0,0,0,0,0,0
  c-0.02,0-0.03-0.01-0.03-0.02c-0.35-0.86-0.25-1.79-0.1-2.41c0.07-0.28,0.16-0.56,0.27-0.84c0.01-0.01,0.02-0.02,0.03-0.02
  c0.01,0,0.02,0.01,0.03,0.02c0.26,0.61,0.36,1.31,0.36,1.34c0.01,0.09,0.08,0.17,0.17,0.2c0.09,0.03,0.19-0.01,0.25-0.08
  c0.56-0.69,1.19-1.05,1.62-1.22c0.01-0.01,0.02,0,0.03,0.01C54.52,59.72,54.52,59.73,54.52,59.74 M54.61,58.26
  c-0.22,0.45-0.5,0.84-0.84,1.15c-0.37,0.35-0.73,0.53-0.91,0.6c0,0-0.01,0-0.01,0c-0.01,0-0.02-0.01-0.03-0.02
  c-0.38-0.69-0.52-1.5-0.41-2.43c0.03-0.28,0.09-0.57,0.17-0.85c0-0.01,0.01-0.02,0.03-0.02c0.01,0,0.02,0.01,0.03,0.02
  c0.34,0.58,0.52,1.29,0.53,1.32c0.02,0.09,0.1,0.16,0.19,0.18c0.09,0.02,0.19-0.03,0.24-0.11c0.47-0.76,1.06-1.19,1.46-1.41
  c0.01-0.01,0.02-0.01,0.03,0c0.01,0.01,0.01,0.02,0.01,0.03C55,57.3,54.83,57.82,54.61,58.26"/>
            <Path fill="#66AED7" d="M81.18,53.53l-1.56-4.77c-0.05-0.16-0.21-0.28-0.38-0.28h-6.64c-0.17,0-0.33,0.11-0.38,0.28l-1.56,4.77
  c-0.05,0.16-0.21,0.28-0.38,0.28h-2.43c-0.27,0-0.46-0.27-0.38-0.53l5.96-17.7c0.06-0.16,0.21-0.27,0.38-0.27h4.25
  c0.17,0,0.32,0.11,0.38,0.27l5.95,17.7c0.09,0.26-0.11,0.53-0.38,0.53h-2.46C81.38,53.8,81.23,53.69,81.18,53.53 M73.72,45.8h4.39
  c0.27,0,0.46-0.26,0.38-0.52l-2.2-6.72c-0.12-0.37-0.64-0.37-0.76,0l-2.19,6.72C73.25,45.54,73.44,45.8,73.72,45.8"/>
            <Path fill="#66AED7" d="M86.82,40.17h1.95c0.2,0,0.37,0.15,0.4,0.34l0.2,1.43h0.18c0.4-0.64,0.93-1.12,1.58-1.45
  c0.65-0.33,1.37-0.49,2.16-0.49c0.24,0,0.49,0.01,0.74,0.04c0.2,0.02,0.35,0.2,0.35,0.4v2.17c0,0.23-0.2,0.41-0.43,0.4
  c-0.25-0.02-0.53-0.03-0.85-0.03c-0.65,0-1.29,0.13-1.92,0.4c-0.58,0.25-1.04,0.59-1.39,1.02c-0.06,0.07-0.09,0.16-0.09,0.26v8.74
  c0,0.22-0.18,0.4-0.4,0.4h-2.48c-0.22,0-0.4-0.18-0.4-0.4V40.57C86.43,40.35,86.6,40.17,86.82,40.17"/>
            <Path fill="#66AED7" d="M98.34,59.41c-0.65-0.08-1.27-0.2-1.85-0.35c-0.18-0.04-0.3-0.21-0.3-0.39v-1.77c0-0.26,0.25-0.44,0.5-0.38
  c1.27,0.33,2.49,0.49,3.64,0.49c0.93,0,1.69-0.12,2.27-0.36c0.58-0.24,1.01-0.62,1.29-1.14c0.28-0.52,0.42-1.22,0.42-2.07v-1.08
  h-0.16c-0.43,0.49-0.94,0.88-1.56,1.15c-0.61,0.28-1.3,0.41-2.07,0.41c-0.97,0-1.86-0.23-2.65-0.71s-1.42-1.2-1.9-2.2
  c-0.48-0.99-0.71-2.24-0.71-3.74c0-2.4,0.62-4.21,1.87-5.45c1.25-1.23,3.11-1.85,5.57-1.86c0.82,0,1.66,0.06,2.54,0.19
  c0.76,0.11,1.44,0.25,2.06,0.44c0.17,0.05,0.28,0.21,0.28,0.38v11.88c0,1.58-0.25,2.85-0.77,3.84c-0.51,0.99-1.29,1.71-2.32,2.18
  c-1.03,0.46-2.34,0.69-3.94,0.69C99.84,59.55,99.1,59.5,98.34,59.41 M103.15,50.95c0.41-0.16,0.76-0.4,1.06-0.7
  c0.07-0.07,0.11-0.18,0.11-0.28v-6.94c0-0.19-0.14-0.36-0.33-0.4c-0.52-0.1-1.04-0.15-1.55-0.15c-1.29,0-2.26,0.36-2.9,1.08
  c-0.65,0.72-0.97,1.86-0.97,3.42c0,1.56,0.27,2.66,0.81,3.29c0.54,0.64,1.32,0.96,2.33,0.96C102.21,51.23,102.69,51.14,103.15,50.95
  "/>
            <Path fill="#66AED7" d="M121.51,47.97h-7.61c-0.24,0-0.42,0.21-0.4,0.45c0.07,0.68,0.23,1.23,0.47,1.66c0.29,0.52,0.74,0.9,1.35,1.13
  c0.61,0.23,1.42,0.35,2.44,0.35c0.87,0,1.85-0.12,2.93-0.36c0.25-0.05,0.49,0.13,0.49,0.39v1.67c0,0.19-0.13,0.35-0.31,0.39
  c-1.2,0.27-2.39,0.41-3.56,0.41c-1.62,0-2.96-0.25-4.01-0.74c-1.04-0.49-1.83-1.26-2.34-2.29c-0.52-1.04-0.77-2.39-0.77-4.04
  c0-1.52,0.24-2.81,0.71-3.86c0.47-1.05,1.16-1.84,2.06-2.37c0.9-0.53,1.99-0.79,3.26-0.79c1.86,0,3.27,0.6,4.24,1.79
  c0.97,1.2,1.45,2.97,1.45,5.33v0.49C121.91,47.79,121.73,47.97,121.51,47.97 M114.19,42.99c-0.41,0.54-0.65,1.4-0.71,2.6
  c-0.01,0.23,0.17,0.42,0.4,0.42h4.56c0.23,0,0.41-0.19,0.4-0.42c-0.06-1.19-0.29-2.06-0.68-2.6c-0.44-0.6-1.09-0.9-1.96-0.9
  C115.32,42.09,114.65,42.39,114.19,42.99"/>
            <Path fill="#66AED7" d="M124.75,40.17h1.97c0.2,0,0.36,0.14,0.39,0.34l0.17,1.1h0.18c0.52-0.53,1.13-0.94,1.83-1.22
  c0.7-0.28,1.46-0.42,2.26-0.42c1.41,0,2.52,0.41,3.34,1.24c0.82,0.83,1.22,2.14,1.22,3.93v8.27c0,0.22-0.18,0.4-0.4,0.4h-2.48
  c-0.22,0-0.4-0.18-0.4-0.4v-8.09c0-0.91-0.19-1.55-0.57-1.94c-0.38-0.39-0.94-0.58-1.68-0.58c-0.55,0-1.09,0.11-1.62,0.34
  c-0.49,0.21-0.9,0.51-1.24,0.92c-0.06,0.07-0.09,0.17-0.09,0.26v9.09c0,0.22-0.18,0.4-0.4,0.4h-2.48c-0.22,0-0.4-0.18-0.4-0.4V40.57
  C124.35,40.35,124.53,40.17,124.75,40.17"/>
            <Path fill="#66AED7" d="M147.37,51.63v1.83c0,0.19-0.13,0.36-0.32,0.4c-0.69,0.14-1.37,0.21-2.04,0.21c-3.23,0-4.85-1.63-4.85-4.89
  v-5.99c0-0.22-0.18-0.4-0.4-0.4h-1.55c-0.22,0-0.4-0.18-0.4-0.4v-1.82c0-0.22,0.18-0.4,0.4-0.4h1.6c0.2,0,0.37-0.15,0.4-0.35
  l0.49-4.16c0.02-0.2,0.19-0.35,0.4-0.35h1.95c0.22,0,0.4,0.18,0.4,0.4v4.07c0,0.22,0.18,0.4,0.4,0.4h3.01c0.22,0,0.4,0.18,0.4,0.4
  v1.82c0,0.22-0.18,0.4-0.4,0.4h-3.01c-0.22,0-0.4,0.18-0.4,0.4v5.46c0,0.67,0.09,1.2,0.26,1.59c0.17,0.39,0.43,0.67,0.78,0.84
  c0.35,0.17,0.81,0.26,1.39,0.26c0.3,0,0.65-0.03,1.06-0.1C147.15,51.19,147.37,51.38,147.37,51.63"/>
            <Path fill="#66AED7" d="M149.76,37.38c-0.35-0.3-0.52-0.74-0.52-1.32c0-0.57,0.17-1.02,0.52-1.32c0.34-0.31,0.86-0.46,1.56-0.46
  c0.69,0,1.21,0.15,1.56,0.46c0.35,0.31,0.52,0.75,0.52,1.32c0,0.57-0.17,1.01-0.52,1.32c-0.35,0.3-0.87,0.46-1.56,0.46
  C150.62,37.83,150.1,37.68,149.76,37.38 M149.67,53.4V40.57c0-0.22,0.18-0.4,0.4-0.4h2.49c0.22,0,0.4,0.18,0.4,0.4V53.4
  c0,0.22-0.18,0.4-0.4,0.4h-2.49C149.84,53.8,149.67,53.62,149.67,53.4"/>
            <Path fill="#66AED7" d="M156.03,40.17h1.97c0.2,0,0.36,0.14,0.39,0.34l0.17,1.1h0.18c0.52-0.53,1.13-0.94,1.83-1.22
  c0.7-0.28,1.46-0.42,2.26-0.42c1.41,0,2.52,0.41,3.34,1.24c0.82,0.83,1.22,2.14,1.22,3.93v8.27c0,0.22-0.18,0.4-0.4,0.4h-2.48
  c-0.22,0-0.4-0.18-0.4-0.4v-8.09c0-0.91-0.19-1.55-0.57-1.94c-0.38-0.39-0.94-0.58-1.67-0.58c-0.55,0-1.09,0.11-1.62,0.34
  c-0.49,0.21-0.9,0.51-1.24,0.92c-0.06,0.07-0.09,0.17-0.09,0.26v9.09c0,0.22-0.18,0.4-0.4,0.4h-2.48c-0.22,0-0.4-0.18-0.4-0.4V40.57
  C155.63,40.35,155.81,40.17,156.03,40.17"/>
            <Path fill="#66AED7" d="M178.43,40.48c0.86,0.34,1.5,0.91,1.92,1.71c0.42,0.79,0.63,1.87,0.63,3.22v8c0,0.22-0.18,0.4-0.4,0.4h-1.97
  c-0.2,0-0.36-0.14-0.39-0.34l-0.17-1.08h-0.17c-0.41,0.54-0.94,0.95-1.58,1.23c-0.65,0.28-1.36,0.42-2.14,0.42
  c-0.89,0-1.66-0.16-2.31-0.48c-0.65-0.32-1.15-0.76-1.5-1.34c-0.34-0.58-0.52-1.26-0.52-2.04c0-1.27,0.43-2.24,1.3-2.94
  c0.87-0.69,2.24-1.11,4.11-1.26l2.55-0.24v-0.54c0-0.69-0.11-1.24-0.33-1.63c-0.22-0.4-0.57-0.68-1.04-0.84
  c-0.47-0.17-1.1-0.25-1.89-0.25c-0.56,0-1.16,0.05-1.81,0.14c-0.47,0.07-0.92,0.16-1.37,0.28c-0.26,0.07-0.51-0.11-0.51-0.38v-1.68
  c0-0.18,0.11-0.34,0.29-0.39c0.54-0.15,1.13-0.27,1.78-0.35c0.76-0.1,1.48-0.15,2.17-0.15C176.45,39.96,177.57,40.13,178.43,40.48
   M176.56,51.44c0.41-0.16,0.77-0.41,1.1-0.75c0.07-0.07,0.11-0.18,0.11-0.29v-2.3c0-0.23-0.2-0.42-0.43-0.4l-1.8,0.16
  c-0.86,0.08-1.49,0.29-1.88,0.62c-0.4,0.33-0.59,0.79-0.59,1.38c0,0.6,0.18,1.06,0.53,1.37c0.35,0.32,0.87,0.47,1.56,0.47
  C175.64,51.72,176.11,51.62,176.56,51.44"/>


          </Svg>
          <Text >2021: Año de Martín Miguel de Güemes</Text>
        </View>
        <View style={styles.sectionContentHead} >
          <View style={styles.sectionContentHeadColumn3}  >
            <Text style={styles.sectionH2}  >Constancia de Inscripción</Text>
            <Text style={{ fontSize: '10pt', marginBottom: 20 }}  >Registro Nacional de Constructores y de Firmas Consultoras de Obras Públicas.</Text>
          </View>
          <View style={styles.sectionContentHeadColumn2}  >

            <Text style={styles.sectionH2}  >Fecha de emisión</Text>
            <Text  >{moment().format('DD/MM/YYYY')}</Text>

          </View>

        </View>
        <View style={styles.sectionContentTitle} >
          <Text  >Datos de la empresa</Text>
        </View>
        <View style={styles.sectionContentHead} >
          <View style={styles.sectionContentHeadColumn3}  >
            <Text style={styles.sectionEtiqueta}  >{props.certificado.tramite.razonSocial}</Text>
            <Text  >Registrado como:<Text style={styles.sectionEtiqueta}>{props.certificado.tramite.tipoEmpresa}</Text>  </Text>
            <Text  >Estado:  <Text style={styles.sectionEtiqueta}>{`${props.certificado.tramite.categoria} - ${props.certificado.tramite.status}`}</Text>  </Text>
            <Text  >Cuit:  <Text style={styles.sectionEtiqueta}>{props.certificado.tramite.cuit}</Text>  </Text>
            <Text  >Tipo de Tramite:  <Text style={styles.sectionEtiqueta}>{props.certificado.tramite.subCategoria}</Text>  </Text>
            
          </View>
          <View style={styles.sectionContentHeadColumn2}>
            <Text style={styles.sectionH2}>Fecha de vigencia</Text>
            <Text style={styles.sectionH2}>{getVigenciaCertificado(props.certificado.tramite)}</Text>
          </View>
          
        </View>
        <View style={styles.sectionContent100}>
          <Text>{getEstadoText()}</Text>
        </View>


        <View style={styles.sectionContentTitle} >
          <Text  >Capacidades</Text>
        </View>
        <View style={styles.sectionContentCapacidad} >
          <View style={styles.sectionContentCapacidadColumn}  >
            <Text  >Capacidad económico financiera de contratación referencial:</Text>
            <Text style={styles.sectionEtiqueta}>{numeral(props.certificado.capacidadFinanciera).format('$0,0.00')}</Text>
          </View>
          <View style={styles.sectionContentCapacidadColumnBorder}  >
            <Text  >Capacidad económico financiera de ejecución referencial:</Text>
            <Text style={styles.sectionEtiqueta}>{numeral(props.certificado.capacidadEjecucion).format('$0,0.00')}</Text>
          </View>
        </View>

        <View style={styles.sectionContentTitle} >
          <Text  >Especialidades</Text>
        </View>

        <View style={styles.sectionContentCapacidad} >
          <View style={styles.sectionContentEspecialidadColumn}  >
            <Text  >Tipo:</Text>
            <Text style={styles.sectionEtiqueta}>{_.uniq(especialidades.filter(e => e !== '')).join(', ')}</Text>
          </View>
        </View>

        <View style={styles.sectionContentCapacidad} >
          <View style={styles.sectionContentEspecialidadColumn}  >
            <Text  >Tipo:</Text>
            <Text style={styles.sectionEtiqueta}>{_.uniq(especialidades.filter(e => e !== '')).join(', ')}</Text>
          </View>
        </View>


        <View style={styles.sectionContentTitle} >
          <Text  >Compromisos a la fecha</Text>
        </View>

        <View>
          
        
        
        </View>
    

        <View style={styles.sectionContentTable} >

          <View style={styles.sectionContentTableColumnBorder}  >

            <Text style={styles.sectionEtiquetaTable}>Estado</Text>
            {props.certificado.tramite.ddjjObras.filter(o => o.status && o.status === 'APROBADA' || o.status && o.status === 'SUPERVIZADA').filter((o: DDJJObra) => _.includes(['Preadjudicada', 'Adjudicada', 'Ejecucion'], o.datosObra && o.datosObra[0].estado)).map((o: DDJJObra) => 
            <Text style={styles.sectiontable}  >  {o.datosObra[0].estado}</Text>)}
          </View>

          <View style={styles.sectionContentTableColumnBorder3}  >

            <Text style={styles.sectionEtiquetaTable}>Fecha de Adj.</Text>
            {props.certificado.tramite.ddjjObras.filter(o =>
              o.status && o.status === 'APROBADA' || o.status && o.status === 'SUPERVIZADA').filter(
                (o: DDJJObra) => _.includes(['Preadjudicada', 'Adjudicada', 'Ejecucion'],
                  o.datosObra && o.datosObra[0].estado)).map((o: DDJJObra) => 
                  <Text style={styles.sectiontable}   >
                    {o.datosObra[0].fechaAdjudicacion}</Text>)}



          </View>



          <View style={styles.sectionContentTableColumnBorder3}  >

          <Text style={styles.sectionEtiquetaTable}>Comitente</Text>

            {props.certificado.tramite.ddjjObras.filter(o =>o.status && o.status === 'APROBADA' || o.status && o.status === 'SUPERVIZADA').filter((o: DDJJObra) => _.includes(['Preadjudicada', 'Adjudicada', 'Ejecucion'],o.datosObra ? o.datosObra[0].estado : '')).map((o: DDJJObra) =>
             <Text style={styles.sectiontable} >{o.razonSocialComitente}</Text>)}
          </View>
          <View style={styles.sectionContentTableColumnBorder3}  >

            <Text style={styles.sectionEtiquetaTable}>Denominación</Text>

            {props.certificado.tramite.ddjjObras.filter(o => 
            o.status && o.status === 'APROBADA'
              || o.status && o.status === 'SUPERVIZADA').filter((o: DDJJObra) =>
                _.includes(['Preadjudicada', 'Adjudicada', 'Ejecucion'],
                  o.datosObra ? o.datosObra[0].estado : '')).map((o: DDJJObra) => 
                  <Text style={styles.sectiontable} >{o.denominacion}</Text>)}


          </View>

          <View style={styles.sectionContentTableColumnBorder3}  >
            <Text style={styles.sectionEtiquetaTable}>Monto Vigente</Text>
            {props.certificado.tramite.ddjjObras.filter(o => o.status && o.status === 'APROBADA'
              || o.status && o.status === 'SUPERVIZADA').filter((o: DDJJObra) => _.includes(
                ['Preadjudicada', 'Adjudicada', 'Ejecucion'], 
                o.datosObra && o.datosObra[0].estado)).map((o , record: DDJJObra) =>
                <Text style={styles.sectiontable}>
                 
                   {numeral(record.montoInicial + 
                    (record.redeterminaciones && 
                    record.redeterminaciones.length !== 0 ? 
                    record.redeterminaciones.map(r => r.monto).reduce((acc, val) => acc += val) : 0) +
                     (record.ampliaciones && record.ampliaciones.length !== 0 ? record.ampliaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0))
                     .format('$0,0.00')}</Text>)}
          </View>
          <View style={styles.sectionContentTableColumnBorder3}  >
            <Text style={styles.sectionEtiquetaTable}>Saldo</Text>
            {props.certificado.tramite.ddjjObras.filter(o => o.status && o.status === 'APROBADA'
              || o.status && o.status === 'SUPERVIZADA').filter((o: DDJJObra) => _.includes(
                ['Preadjudicada', 'Adjudicada', 'Ejecucion'],
                o.datosObra && o.datosObra[0].estado)).map((o: DDJJObra) => 
                <Text style={styles.sectiontable} >{numeral(calcularSaldoObra(o)).format('$0,0.00')}</Text>)}

          </View>



        </View>


        <View style={styles.sectionFooter} >
          <Text style={styles.sectionFooterBold}>EL ORGANISMO CONTRATANTE PODRÁ CONSULTAR ESTA INFORMACIÓN EN LA PLATAFORMA CONTRAT.AR (HTTPS://CONTRATAR.GOB.AR/)
          </Text>
        </View>
        <View style={styles.sectionFooter} >
          <Text style={styles.sectionFooterBold}>ONC |
            <Text style={styles.sectionFooterRegular}>OFICINA NACIONAL DE CONTRATACIONES </Text>
          </Text>
        </View>


      </Page>
    </Document>
  );





}



