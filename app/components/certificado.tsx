import { Button, Empty, Modal, Progress, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import numeral from 'numeral'
import { calcularSaldoObra, generarCertificado, getCertificados, getCodigoObra, getToken } from '../services/business'
import { PDFDownloadLink } from '@react-pdf/renderer';
import _ from 'lodash'
import CertificadoPDF from './certificadoPDF'
import { nanoid } from 'nanoid';
import { CalculadoraCapacidad } from 'rnc-main-lib'
import moment from 'moment';
import axios from 'axios';


export interface CertificadoProps {
  razonSocial?: string
  personeria?: string
  cuit?: string
  tipoEmpresa?: string,
  capacidadContratacion?: number,
  capacidadEjecucion?: number,
  obras?: Array<DDJJObra>,
  porcentajesEspecialidades?: Array<any>,
  tramite?:TramiteAlta,
  token?: string
}

let columns = [
  {
    title: 'Fecha Adj.',
    render: (text,record: DDJJObra)  => <div> {record.datosObra[0].fechaAdjudicacion}</div>,
    key: 'id',
  },
  {
    title: 'Estado',
    render: (text,record: DDJJObra)  => <div> {record.datosObra[0].estado}</div>,
    key: 'id',
  },
  {
    title: 'Comitente',
    dataIndex: 'comitente',
    render: (text, record: DDJJObra) => <div>{record.razonSocialComitente}</div>,
  },
  {
    title: 'Denominación',
    dataIndex: 'denominacion',
    key: 'denominacion',
  },
  
  {
    title: 'Monto Vigente',
    dataIndex: 'Monto Vigente',
    render: (text, record: DDJJObra) => <div>{numeral(record.montoInicial + (record.redeterminaciones.length !== 0 ? record.redeterminaciones.map(r => r.monto).reduce((acc, val) => acc += val) : 0) + (record.ampliaciones.length !== 0 ? record.ampliaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0)).format('$0,0.00')}</div>,

  },
  //{
  //  title: 'Certificado a la fecha',
  //  dataIndex: 'certificado',
  //  render: (text, record: DDJJObra) => <div>{numeral(record.certificaciones.length !== 0 ? record.certificaciones.map(r => r.monto).reduce((acc, val) => acc += val, 0) : 0).format('$0,0.00')}</div>,
  //}, 
  {

    title: 'Saldo',
    dataIndex: 'saldo',
    render: (text, record: DDJJObra) => <div>{numeral(calcularSaldoObra(record)).format('$0,0.00')}</div>
  }
]



export const Certificado: React.FC<CertificadoProps> = ({
	razonSocial="",
  personeria="", 
  cuit="", 
  tipoEmpresa="", 
  capacidadContratacion=0, 
  capacidadEjecucion=0,
  obras= [],
  porcentajesEspecialidades= [],
  tramite=null,
  token=null
}) => {

  const [certificado, setCertificado] = useState<CertificadoCapacidad>(null)
  const [showCertificado, setShowCertificado] = useState(false)

  const generar = async () => {
    const result = await axios.post('/api/certificado/preview',tramite,{
      headers:{
        Authorization: `Bearer ` + getToken()
      }
    })

    return result.data
  }

  useEffect(() => {
    (async () => {
  
      if (!tramite && !certificado) {
        const certificados: Array<CertificadoCapacidad> = await getCertificados(cuit, token)
        setCertificado(_.last(certificados))
      } else if (tramite) {

        const certGen = await generar()
        setCertificado(certGen)
      }
    })()
  }, [])




  return <div>
    
    {certificado && <Modal title="Previsualizar"
      visible={showCertificado}
      onOk={() => setShowCertificado(false)}
      footer={[
        <Button onClick={() => setShowCertificado(false)}>Cerrar</Button>,
        <Button type="primary" style={{color: '#fff' }}> {
          <span>
            {
            <PDFDownloadLink document={<CertificadoPDF certificado={certificado} />} fileName="certificado.pdf">
            
              {({ blob, url, loading, error }) =>{
                console.log(certificado)
                return loading ? 'Loading document...' : 'Descargar Certificado'
              }
                
              }
             
            </PDFDownloadLink>
            }
          </span>
          }</Button>
      ]}
      onCancel={() => setShowCertificado(false)}
      width={1000}>
      <div className="text-3xl font-bold  text-black-700 pb-4 ">{certificado.tramite.razonSocial}</div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 ">
        <div className="grid grid-cols-2 gap-4 border px-4 py-4" >
          <div>
            <div className="text-sm  text-muted-700 ">Tipo de entidad</div>
            <div className="text-2xl font-bold  text-black-700 ">{certificado.tramite.personeria}</div>
          </div>
          <div>
            <div className="text-sm  text-muted-700 ">CUIT</div>
            <div className="text-2xl font-bold  text-black-700 ">{cuit}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 border gap-4 px-4 py-4">
          <div>
            <div className="text-base font-semibold tracking-wider ">Registrado como {certificado.tramite.tipoEmpresa}</div>
          </div>

        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4 ">
        <div className="grid grid-cols-2 gap-4 border px-4 py-4" >
          <div>
            <div className="text-sm  text-muted-700 ">Capacidad Económico Financiera de Contratación Referencial</div>
            <div className="text-xl font-bold  text-black-700 ">{certificado.capacidadFinanciera >= 0 ? numeral(certificado.capacidadFinanciera).format('$0,0.00') : '---'}</div>
          </div>
          <div>
            <div className="text-sm  text-muted-700 ">Capacidad Económico Financiera de Ejecución Referencial</div>
            <div className="text-xl font-bold  text-black-700 ">{numeral(certificado.capacidadEjecucion).format('$0,0.00')}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 border gap-4 px-4 py-4 text-center">
          {[].map((especialidad: any) => <div key={getCodigoObra()}>
            <div className="text-base font-semibold tracking-wider "><Progress type="circle" width={80} percent={especialidad.Porcentaje} /></div>
            <div className="text-sm  text-muted-700 ">{especialidad.DescripcionEspecialidad}</div>
          </div>)}


        </div>
      </div>
      <div className="text-xl font-bold mt-4 mb-4">Compromisos: </div>
      <Table dataSource={certificado.tramite.ddjjObras.filter(o => o.status && o.status === 'APROBADA' || o.status === 'SUPERVIZADA').filter( (o:DDJJObra) => _.includes(['Preadjudicada','Adjudicada','Ejecucion'],o.datosObra[0].estado))} columns={columns} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>, }} />





    </Modal>}
    <Button loading={!certificado} onClick={() => setShowCertificado(true)} >Ver Certificado</Button>
    <style>
      {
        `
        a{color:#fff }
        `
      }
    </style>
  </div>
}

