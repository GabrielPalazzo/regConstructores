import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet,Svg,Path,Line} from '@react-pdf/renderer';
import CertificadoPDF from '../components/certificadoPDF';
import { getCertificados } from '../services/business';
import _ from 'lodash'

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
    margin:20,
  },
  sectionFooterBold: {
    fontWeight:'bold',
  },
  sectionFooterRegular: {
    fontWeight:'light',
  },
  textsize10:{
    fontSize:'10px'
  },

  sectionHeader: {
    color: '#5b5b5f',
    fontSize: '9px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    textAlign:'center',
    margin:40,
  },
  sectionContentHead: {
    marginLeft: 10,
    marginRight: 10,
    marginTop:10,
    color: '#5b5b5f',
    fontSize: '10px',
    
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionContentHead2: {
    margin:10,
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
    paddingLeft:20,
    paddingRight:40,
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1
  },
  sectionContentCapacidadColumnBorder: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    borderLeft: '1px solid #5b5b5f',
    paddingLeft:20
  },
  sectionContentCapacidadColumnBorder2: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    borderLeft: '1px solid #5b5b5f',
    textAlign:'center'
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
    paddingLeft:20
  },

  sectionContentTitle: {
    padding: 5,
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: '#00bbeb'
  },
  sectionContent100: {
    padding:10,
    marginBottom:10,
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
    fontWeight: 'bold',
    textTransform: 'uppercase'
},
sectionEtiquetaTable: {
  color: '#5b5b5f',
  fontSize: '10px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  borderBottom: '1px solid #5b5b5f',
  padding:5,
  height:'50px'
},
  sectionContentTable: {
    color: '#5b5b5f',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  sectionContentTableColumnBorder: {
    color: '#949397',
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    border: '1px solid #5b5b5f',
  },
});

// Create Document Component
export default () => {
  const [certificado, setCertificado] = useState<CertificadoCapacidad>(null)
  
  useEffect(() => {
    (async () => {
      const certificados: Array<CertificadoCapacidad> = await getCertificados('33709773769')
      setCertificado(_.last(certificados))
    })()
  },[])

  if (!certificado) return <div>Loading....</div>

  return <CertificadoPDF certificado = {certificado} />
}

