import React, { useEffect, useState } from 'react';
import { HeaderPrincipal } from '../components/header'
import { NavigationStep } from '../components/steps'
import { Input, Table, Space, Steps, Card, Select, Radio, Button, Modal, Checkbox, Alert, Empty,Popconfirm, message } from 'antd';
import LikeDislike from '../components/like_dislike'

import { Router, useRouter } from 'next/router'
import DatePicker from '../components/datePicker'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { InputText } from '../components/input_text'
import InputTextModal from '../components/input_text_modal'
import SelectMultiple from '../components/select_multiple'
import SelectSimple from '../components/select'
import Switch from '../components/switch'
import RadioGroup from '../components/radioGroup'
import SelectModal from '../components/select_modal'
import { useSelector, useDispatch } from 'react-redux'
import { saveTramite } from '../redux/actions/main'
import { getEmptyTramiteAlta, getReviewAbierta, getTramiteByCUIT, getUsuario, isConstructora, isInReview, isPersonaFisica, isTramiteEditable, allowGuardar } from '../services/business';
import { Loading } from '../components/loading';
import generateCalendar from 'antd/lib/calendar/generateCalendar';
import { TomarTramite } from '../components/tomarTramite';
import { updateRevisionTramite } from '../redux/actions/revisionTramite';
import { userInfo } from 'os';

import dynamic from 'next/dynamic'
const Upload = dynamic(() => import('../components/upload'))

function confirm(e) {
  console.log(e);
  message.success('Se elimino correctamente');
}

function cancel(e) {
  console.log(e);
  message.error('Ha cancelado la operacion');
}


const { Option } = Select;



const renderNoData = () => {
  return (<div>
    <div className="mt-4">
      <Card >
        <div className="text-sm text-center">No hay Autoridades Cargadas</div>
        <div className="text-primary-700 text-sm text-center mt-2 font-bold flex justify-center">Cargue uno presionando Agregar
      <svg width="70" height="31" viewBox="0 0 70 31" fill="none" xmlns="http://www.w3.org/2000/svg" className="pl-2">
            <path d="M30.8624 25.6685L31.1624 26.6225L30.8624 25.6685ZM69.9995 2.03192C70.0171 1.47992 69.5839 1.01814 69.0319 1.00051L60.0365 0.713215C59.4845 0.695585 59.0227 1.12878 59.0051 1.68078C58.9875 2.23279 59.4207 2.69457 59.9727 2.7122L67.9686 2.96757L67.7132 10.9635C67.6956 11.5155 68.1288 11.9773 68.6808 11.9949C69.2328 12.0125 69.6946 11.5793 69.7122 11.0273L69.9995 2.03192ZM1 29.8452C0.886109 30.8387 0.886455 30.8388 0.886848 30.8388C0.88704 30.8388 0.887479 30.8389 0.887865 30.8389C0.888635 30.839 0.889592 30.8391 0.890733 30.8392C0.893015 30.8395 0.896038 30.8398 0.899799 30.8402C0.907319 30.8411 0.917788 30.8422 0.931181 30.8436C0.957967 30.8464 0.996449 30.8503 1.04643 30.855C1.14638 30.8645 1.29231 30.8773 1.48262 30.8914C1.86323 30.9197 2.42138 30.9531 3.14418 30.9753C4.58971 31.0198 6.69421 31.0195 9.35444 30.8432C14.6748 30.4906 22.2199 29.4339 31.1624 26.6225L30.5625 24.7146C21.7905 27.4724 14.4045 28.5041 9.22219 28.8476C6.63111 29.0193 4.59145 29.0189 3.20566 28.9763C2.51279 28.955 1.98348 28.9231 1.63055 28.8969C1.45408 28.8838 1.32173 28.8722 1.23508 28.864C1.19176 28.8599 1.15986 28.8566 1.1396 28.8545C1.12946 28.8534 1.12224 28.8526 1.11795 28.8522C1.1158 28.8519 1.11439 28.8518 1.11371 28.8517C1.11337 28.8517 1.11322 28.8517 1.11325 28.8517C1.11326 28.8517 1.11342 28.8517 1.11343 28.8517C1.11364 28.8517 1.11389 28.8517 1 29.8452ZM31.1624 26.6225C49.0798 20.9894 57.7588 13.9165 69.6842 2.72932L68.3158 1.27068C56.4952 12.3597 48.0739 19.2091 30.5625 24.7146L31.1624 26.6225Z" fill="#0072BB" />
          </svg></div>
      </Card>
    </div>
  </div>)
}


export default (props) => {

  const router = useRouter()

  const [visible, setVisible] = useState<boolean>(false)

  const [tipoEmpresa, setTipoEmpresa] = useState(null)
  const [personeria, setPersoneria] = useState(null)
  const [waitingType, setWaitingType] = useState<'sync' | 'waiting'>('waiting')

  //const tramiteSesion: TramiteAlta = useSelector(state => state.appStatus.tramiteAlta) || getEmptyTramiteAlta()
  const [tramite, setTramite] = useState<TramiteAlta>(useSelector(state => state.appStatus.tramiteAlta) || getEmptyTramiteAlta())
  const statusGeneralTramite = useSelector(state => state.appStatus.resultadoAnalisisTramiteGeneral)
  const tipoAccion: string = useSelector(state => state.appStatus.tipoAccion)
  const [nombre, setNombre] = useState(' ')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [propuestaElectronica, setPropuestaElectronica] = useState('')
  const [cuit, setCuit] = useState('')
  const [nroDocumentoApoderado, setNroDocumentoApoderado] = useState('')
  const [tipoApoderado, setTipoApoderado] = useState('')
  const [tipoDocumentoApoderado, setTipoDocumentoApoderado] = useState('')
  const [cuitApoderado, setCuitApoderado] = useState('')
  const [emailApoderado, setEmailApoderado] = useState('')
  const [fotosDNIApoderado, setFotosDNIApoderado] = useState([])
  const [actaAutoridadesApoderado, setActaAutoridadesApoderado] = useState([])
  const [esAdministradorLegitimado, setEsAdministradorLegitimado] = useState(false)
  const dispatch = useDispatch()
  const paso = useSelector(state => state.appStatus.paso)
  const [isLoading, setIsLoading] = useState(false)
  const [aplicaDecretoDocientosDos, setAplicaDecretoDoscientosDos] = useState(false)
  const [usuario, setUsuario] = useState(null)

  const [decretoRazonSocial, setDecretoRazonSocial] = useState('')
  const [decretoCuit, setDecretoCuit] = useState('')
  const [decretoTipoFuncionarios, setDecretoTipoFuncionarios] = useState('')
  const [decretoTipoVinculo, setDecretoTipoVinculo] = useState('')
  const [decretoObservaciones, setDecretoObservaciones] = useState('')
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  const [aceptaTerminosYCondiciones, setAceptTerminosYCondiciones] = useState(false)

  useEffect(() => {
    if (!tramite.cuit && !tipoAccion)
      router.push('/')

    setUsuario(getUsuario())

    if (isInReview(tramite)) {
      dispatch(updateRevisionTramite(getReviewAbierta(Object.assign({},tramite))))
    }
  }, [])

  const showModal = () => {
    setVisible(true)
  }

  const handleSaveApoderado = () => {
    if (!apellido.trim()) {
      setError('El Apellido  es requerido')
      setShowError(true)
      return
    }
    if (!nombre.trim()) {
      setError('El nombre  es requerido')
      setShowError(true)
      return
    }
    if (!emailApoderado.trim()) {
      setError('El email  es requerido')
      setShowError(true)
      return
    }
    if (emailApoderado.trim() && !/\S+@\S+\.\S+/.test(emailApoderado.trim())) {
      setError('El campo Email se debe ser xxxxx@jjjj.jjj')
      setShowError(true)
      return
    }
    if (!tipoDocumentoApoderado.trim()) {
      setError('El tipo de Documento  es requerido')
      setShowError(true)
      return
    }
    if (!nroDocumentoApoderado.trim()) {
      setError('El numero de documento  es requerido')
      setShowError(true)
      return
    }
   
    if (!tipoApoderado.trim()) {
      setError('El Tipo de apoderado es requerido')
      setShowError(true)
      return
    }
    tramite.apoderados.push({
      imagenesDni: [],
      apellido,
      nombre,
      email: emailApoderado,
      cuit: cuitApoderado,
      nroDocumento: nroDocumentoApoderado,
      tipoDocumento: tipoDocumentoApoderado,
      tipoApoderado,
      esAdministrador: esAdministradorLegitimado,
      fotosDNI: fotosDNIApoderado,
      actaAutoridades: actaAutoridadesApoderado
    })
    save()
    setVisible(false)
    clearState()
  }

  const clearState = () => {
    setNombre('')
    setApellido('')
    setTipoDocumentoApoderado('')
    setTipoApoderado('')
    setNroDocumentoApoderado('')
    setCuitApoderado('')
    setEmailApoderado('')
  }

  const handleCancel = e => {
    setVisible(false)
  }

  const save = async () => {
    setWaitingType('sync')
    setIsLoading(true)
    if (tramite._id) {
      await dispatch(saveTramite(tramite))
    } else {
      if (!(await getTramiteByCUIT(tramite.cuit)))
        await dispatch(saveTramite(tramite))
    }
    setIsLoading(false)


  }


  const removeApoderadoFromList = (record: Apoderado) => {
    tramite.apoderados = tramite.apoderados.filter((a: Apoderado) => a.cuit !== record.cuit)
    save()
  }



  const columns = [
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (tramite && tramite.status === 'BORRADOR' ? 
      <Popconfirm
      title="Esta seguro que lo  desea Eliminar ?"
      onConfirm={() => removeApoderadoFromList(record)}
      onCancel={cancel}
      okText="Si, Eliminar"
      cancelText="Cancelar"
    > <div ><DeleteOutlined /></div></Popconfirm> : <Space size="middle">
        <LikeDislike />
      </Space>),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombreApoderado'
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
    },
    {
      title: 'CUIT',
      dataIndex: 'cuit',
      key: 'cuit',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tipo Usuario',
      dataIndex: 'tipoApoderado',
      key: 'tipoApoderado',
    },
    {
      title: 'Es Adminsitrador Leg.',
      dataIndex: 'esAdministrador',
      key: 'esAdministrador',
      render: text => <div>{text ? 'Si' : 'No'}</div>
    }


  ]

  const addPersonasAlDecreto = () => {
    if (!tramite.datosDecretoDoscientosDos)
      tramite.datosDecretoDoscientosDos = []

    tramite.aplicaDecretoDoscientosDos = true
    if (!decretoTipoFuncionarios.trim()) {
      setError('El Tipo de Funcionarios es obligatorio ')
      setShowError(true)
      return
    }
    if (!decretoTipoVinculo.trim()) {
      setError('El Tipo de Vinculo es obligatorio  ')
      setShowError(true)
      return
    }
    tramite.datosDecretoDoscientosDos.push({
      razonSocial: decretoRazonSocial,
      cuit: decretoCuit,
      observaciones: decretoObservaciones,
      tipoFuncionario: decretoTipoFuncionarios,
      tipoVinculo: decretoTipoVinculo,
    })
    setTramite(tramite)
    save()
  }

  const updateObjTramite = () => {
    setTramite(Object.assign({}, tramite))
  }

  const renderApoderadosSection = () => {
    return (<div>
      {showError ? <div className="mb-4">
        <Alert
          message=''
          description={error}
          type="error"
          showIcon
          closable
          afterClose={() => setShowError(false)}
        /></div> : ''}
      <div className="grid grid-cols-2 gap-4 ">
        <div className="pb-6" >
          <InputTextModal
            label="Nombre"
            labelRequired="*"
            placeholder="Ingrese su nombre de Pila"
            value={nombre}
            bindFunction={setNombre}
            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >
          <InputTextModal
            label="Apellido"
            labelRequired="*"
            value={apellido}
            bindFunction={setApellido}
            labelMessageError=""
            required />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 ">

        <div className="pb-6" >
          <SelectModal
            title="Tipo de documento"
            value={tipoDocumentoApoderado}
            bindFunction={setTipoDocumentoApoderado}
            defaultOption="Seleccione el tipo de Doc"
            labelRequired="*"
            labelMessageError=""
            required
            option={tipoDocumento.map(u => (
              <Option value={u.value}>{u.label}</Option>

            ))} />
        </div>
        <div className="pb-6" >
          <InputTextModal
            label="Nº de Documento"
            labelRequired="*"
            placeholder="Ingrese su numero de documento sin deja espacios"
            value={nroDocumentoApoderado}
            bindFunction={setNroDocumentoApoderado}
            labelMessageError=""
            required />

        </div>
        
        <div className="pb-6 col-span-2" >
          <InputTextModal
            label="CUIT / CUIL"
            labelRequired="*"
            type="number"  
						min="0" 
            placeholder="Ingrese el numero de cuit/cuil sin guiones ni espacio"
            value={cuitApoderado}
            bindFunction={setCuitApoderado}
            labelMessageError=""
            required />
        </div>

      </div>
      <div className="grid grid-cols-2 gap-4 ">
        <div className="pb-6" >
          <InputTextModal
            label="Email"
            labelRequired="*"
            placeholder="Ingrese su email personal"
            value={emailApoderado}
            bindFunction={setEmailApoderado}
            labelMessageError=""
            required />

        </div>
        {tramite.personeria === 'PF' ? <div>
        <div className="pb-6" >
          <RadioGroup
            label="¿Qué tipo de persona desea dar de alta? "
            labelRequired="*"
            value={tipoApoderado}
            bindFunction={setTipoApoderado}
            labelMessageError=""
            radioOptions={tipoPersonaPF.map(u => (
              <Radio value={u.value} >
                {u.label}
              </Radio>
            ))
            }

          />
        </div>
        </div>:<div>
        <div className="pb-6" >
          <RadioGroup
            label="¿Qué tipo de persona desea dar de alta? "
            labelRequired="*"
            value={tipoApoderado}
            bindFunction={setTipoApoderado}
            labelMessageError=""
            radioOptions={tipoPersona.map(u => (
              <Radio value={u.value} >
                {u.label}
              </Radio>
            ))
            }

          />
        </div>
        </div>}
        {tipoApoderado === 'Administrativo/Gestor' ? '' :

          <div className="pb-6" >
            <Switch
              value={esAdministradorLegitimado}
              onChange={setEsAdministradorLegitimado}
              label="Administrador Legitimado"
              labelRequired="*"
              SwitchLabel1="Si"
              SwitchLabel2="No"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
            />
          </div>
        }

      </div>

      <div className="grid grid-cols-3 gap-4 ">
        <div className="pb-6" >
          <Upload
            label="Adjunte fotos de frente y dorso del DNI"
            labelRequired="*"
            labelMessageError=""
            defaultValue={[]}
            onOnLoad={(file) => {
              fotosDNIApoderado.push(file)
              setFotosDNIApoderado(Object.assign([],fotosDNIApoderado))
            }}
            onRemove={ fileToRemove => {
              setFotosDNIApoderado(Object.assign([],fotosDNIApoderado.filter(f => f.cid!==fileToRemove.cid)))
            }}
          />
        </div>
        {tipoApoderado === 'Administrativo/Gestor' ? '' :
          <div className="pb-6" >
            <Upload
              label={tipoApoderado === 'Apoderado' ? 'Adjunte el Poder' : ' Acta de designación de autoridades'}
              labelRequired="*"
              labelMessageError=""
              defaultValue={[]}
              onOnLoad={(file) => {
                actaAutoridadesApoderado.push(file)
                setActaAutoridadesApoderado(Object.assign([],actaAutoridadesApoderado))
              }}
              onRemove={ fileToRemove => {
                setActaAutoridadesApoderado(Object.assign([],actaAutoridadesApoderado.filter(f => f.cid!==fileToRemove.cid)))
              }}
            />
          </div>
        }
        {!esAdministradorLegitimado ?
          '' : <div className="pb-6" >
            <Upload
              label="Adjuntar Acta de Adm. Legitimado"
              labelRequired="*"
              labelMessageError=""
              defaultValue={[]}
              onOnLoad={() => null}
              onRemove={() => null}
            />
          </div>}
      </div>
      <div>
        <Checkbox onChange={e => setAceptTerminosYCondiciones(e.target.checked)}>Declaro bajo juramento que la informacion consignada precedentemente y la documentacion presentada reviste caracter de declaracion jurada
      asi mismo me responsabilizo de su veracidad y me comprometo a facilitar su veracidad</Checkbox>
      </div>
    </div>)
  }

  if ((isLoading) || (!usuario))
    return <Loading message="" type={waitingType} />

  const showSaveButton = () => {
    if (!allowGuardar(tramite))
      return <div></div>

    return <div className=" mt-6 pt-6 text-center">
      <Button type="primary" onClick={async () => {
        await save()
        router.push('/domicilio')
      }} > Guardar y Seguir</Button>
    </div>
  }

  return (<div className="">
    <HeaderPrincipal tramite={tramite} onExit={() => router.push('/')} onSave={() => {
      save()
      router.push('/')
    }} />
    <div className="border-gray-200 border-b-2 px-20">
      <NavigationStep
        generalStatus={statusGeneralTramite}
        completaBalanceYObras={isConstructora(tramite)}
        current={0} />
    </div>

    <div className="px-20 mx-20 py-6 ">

      <div className="flex justify-between text-2xl font-bold py-4">
        <div>Datos de la empresa</div>
        {usuario.isBackOffice() ? <div>
          <TomarTramite user={usuario.userData()} />
        </div> : ''}
      </div>
      <div className="grid grid-cols-2 gap-4 ">
        <div >
          <SelectSimple
            value={tramite.personeria}
            bindFunction={(value) => {
              tramite.personeria = value
              updateObjTramite()
            }}
            title="Tipo de personeria"
            defaultOption="Seleccione el tipo de personeria"
            labelRequired="*"
            labelMessageError=""
            required
            option={tipoPersoneria.map(u => (
              <Option value={u.value}>{u.label}</Option>
            ))} />

        </div>
        <div >
          <SelectMultiple
            labelRequired="*"
            value={tramite.tipoEmpresa}
            bindFunction={(value) => {
              tramite.tipoEmpresa = value
              updateObjTramite()
            }}
            title="Seleccione el tipo de empresa"
            labelObservation=""
            labeltooltip=""
            labelMessageError=""
            placeholder="Tipo de Empresa (Constructora, Proveedora, Consultora)"
            required
            options={tipoEmpresas.map(u => (
              <Option value={u.value} label={u.label}>
                <div className="demo-option-label-item">
                  {u.option}
                </div>
              </Option>
            ))

            } />

        </div>

        {isPersonaFisica(tramite) ? <div className="flex">
          <div className="w-full mr-2" >
            <InputText
              attributeName="NombrePersonaFisica"
              label="Nombre"
              labelRequired="*"
              placeHolder="Nombre"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
              value={tramite.nombreTitular}
              bindFunction={(value) => {
                tramite.nombreTitular = value
                tramite.razonSocial = `${tramite.apellidoTitular} ${tramite.nombreTitular}`
                updateObjTramite()
              }}
            />
          </div>
          <div className="w-full mr-2" >
            <InputText
              label="Apellido"
              attributeName="ApellidoPersonaFisica"
              labelRequired="*"
              placeHolder="Apellido"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
              value={tramite.apellidoTitular}
              bindFunction={(value) => {
                tramite.apellidoTitular = value
                tramite.razonSocial = `${tramite.apellidoTitular} ${tramite.nombreTitular}`
                updateObjTramite()
              }}
            />
          </div>

        </div>
          : <div >
            <InputText
              attributeName="razonSocial"
              label="Razón Social"
              labelRequired="*"
              placeHolder="Constructora del oeste"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
              value={tramite.razonSocial}
              bindFunction={(value) => {
                tramite.razonSocial = value
                updateObjTramite()
              }}
              required />


          </div>
        }

        <div >
          <InputText
            label="CUIT"
            attributeName="cuit"
            labelRequired="*"
            type="number"  
					  disabled={tramite._id ? true : false}
            value={tramite.cuit}
            bindFunction={(value) => {
              tramite.cuit = value
              setTramite(Object.assign({}, tramite))
            }}

            placeHolder="Ingrese el numero de cuit sin guiones"
            labelObservation=""
            labeltooltip=""
            labelMessageError=""
            required />

        </div>
        <div >
          <InputText
            attributeName="nroDeLegajo"
            label="Nro de Legajo"
            value={tramite.nroLegajo}
            bindFunction={(value) => {
              tramite.nroLegajo = value
              updateObjTramite()
            }}
            placeHolder="Ingrese número de legajo de antigua inscripción en RNCOP"
            labelObservation=""
            labeltooltip=""
            labelMessageError=""
          />

        </div>
        {/* <div className="flex">
          <div className="w-full" >
            <InputText
              label="IERIC"
              labelRequired="*"
              placeHolder="IERIC"
              value={tramite.ieric}
              bindFunction={(value) => {
                tramite.ieric = value
                updateObjTramite()
              }}
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
            />
          </div>
          <div className="w-full ml-4" >
            <DatePicker
              value={tramite.vtoIeric}
              bindFunction={(value) => {
                tramite.vtoIeric = value
                updateObjTramite()
              }}
              label="Vencimiento IERIC"
              labelRequired="*"
              placeholder="dd/mm/aaaa"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
            />
          </div>
        </div>*/}

        {/* {isConstructora(tramite) ? <div >
          <Upload
            label="Adjunte certificado IERIC"
            labelRequired="*"
            labelMessageError="" />

       </div> : ''}*/}

        <div >
          <Upload
            {...props}
            label="Adjunte Constancia de Inscripción en AFIP"
            labelRequired="*"
            defaultValue={tramite.inscripcionAFIPConstancia}
            onOnLoad={(files) => {
              if (!tramite.inscripcionAFIPConstancia)
                tramite.inscripcionAFIPConstancia=[]
              tramite.inscripcionAFIPConstancia.push(files)
              save()
            }}
            onRemove={ fileToRemove => {
              tramite.inscripcionAFIPConstancia = tramite.inscripcionAFIPConstancia.filter( f => f.cid !== fileToRemove.cid)
              save()
            }}
            labelMessageError="" />

        </div>
      {/*   {isPersonaFisica(tramite) ? '' :
          <div >
            <Upload
              label="Adjunte comprobante de Incripcion"
              labelRequired="*"
              labelMessageError="" />

          </div>
        }

*/}
      </div>
      {isPersonaFisica(tramite) ? <div>
        <div className="grid grid-cols-1 gap-4 ">
          <div className="mt-4" >
            <Switch
              value={tramite.esCasadoTitular}
              onChange={value => {
                tramite.esCasadoTitular = value
                setTramite(Object.assign({}, tramite))
              }}
              label="Estado civil casado?"
              labelRequired="*"
              SwitchLabel1="Si"
              SwitchLabel2="No"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
            />
          </div>
        </div>
      </div> : ''}
      {isPersonaFisica(tramite) && tramite.esCasadoTitular ? <div>
        <div className="text-2xl font-bold py-4"> Datos del Conyuge</div>
        <div className="grid grid-cols-2 gap-4 ">
          <div className="" >
            <InputText
              attributeName="NombreConyuge"
              label="Nombre"
              labelRequired="*"
              placeHolder="Nombre"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
              value={tramite.nombreConyuge}
              bindFunction={(value) => {
                tramite.nombreConyuge = value
                setTramite(Object.assign({}, tramite))
              }}
            />
          </div>
          <div className="" >
            <InputText
              attributeName="apellidoConyuge"
              label="Apellido"
              labelRequired="*"
              placeHolder="Apellido"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
              value={tramite.apellidoConyuge}
              bindFunction={(value) => {
                tramite.apellidoConyuge = value
                setTramite(Object.assign({}, tramite))
              }}
            />
          </div>
          <div className="pb-6" >
            <SelectModal
              title="Tipo de documento"
              defaultOption="Seleccione el tipo de Doc"
              labelRequired="*"
              value={tramite.tipoDocumentoConyuge}
              bindFunction={value => {
                console.log(value)
                tramite.tipoDocumentoConyuge = value
                setTramite(Object.assign({}, tramite))
              }}
              labelMessageError=""
              required
              option={tipoDocumento.map(u => (
                <Option value={u.value}>{u.label}</Option>

              ))} />
          </div>
          <div className="pb-6" >
            <InputTextModal
              label="Nº de Documento"
              labelRequired="*"
              placeholder="Ingrese su numero de documento sin deja espacios"
              value={tramite.documentoConyugue}
              bindFunction={value => {
                tramite.documentoConyugue = value
                setTramite(Object.assign({}, tramite))
              }}
              labelMessageError=""
              required />

          </div>
          <div >
            <Upload
              {...props}
              label="Adjunte Frente y Dorso del DNI"
              labelRequired="*"
              labelMessageError="" />

          </div>
        </div>
      </div> : ''}
      <div className="mt-6">
        <div className="flex  content-center ">
          <div className="text-2xl font-bold py-4 w-3/4"> {isPersonaFisica ? 'Apoderados / Usuarios' : 'Apoderados y/o Representantes legales'}</div>
          {isTramiteEditable(tramite) ? <div className=" w-1/4 text-right content-center mt-4 ">
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}> Agregar</Button>
          </div> : ''}

        </div>

        <Modal
          title="Datos del Usuario"
          visible={visible}
          onOk={handleSaveApoderado}
          footer={[
            <Button onClick={handleCancel}>Cancelar</Button>,
            <Button type="primary" onClick={handleSaveApoderado} disabled={!aceptaTerminosYCondiciones}>Agregar</Button>
          ]}
          okText="Guardar"
          onCancel={handleCancel}
          cancelText="Cancelar"
          width={1000}
        >
          {renderApoderadosSection()}
        </Modal>

        <Table columns={columns} 
        dataSource={tramite.apoderados} 
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay Apoderados y/o Usuarios </span>}></Empty>,}}  />
      </div>

      <div className=" content-center  rounded-lg border mt-8 px-4 py-4">
        <div className="flex  content-center ">
          <div className="text-2xl font-bold py-4 w-3/4">  INFORMACIÓN DECRETO 202/2017</div>
        </div>
        <div className="grid grid-cols-2 gap-4 ">
          <div >
            <InputText
              label="Declarante"
              attributeName="declarante"
              value={`${usuario.userData().GivenName} ${usuario.userData().Surname}`}
              disabled={true}
              labelRequired="*"
              placeHolder="Constructora del oeste"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
              bindFunction={() => null}
              required />
          </div>
        </div>

        <div className="rounded-lg border  px-4 py-4 bg-gray-300">
          <p>Artículo 1.- Toda persona que se presente en un procedimiento de contratación pública o de otorgamiento de una licencia, permiso, autorización, habilitación o derecho real sobre un bien de dominio público o privado del Estado, llevado a cabo por cualquiera de los organismos y entidades del Sector Público Nacional comprendidas en el artículo 8 de la Ley N° 24156, debe presentar una “Declaración Jurada de Intereses” en la que deberá declarar si se encuentra o no alcanzada por alguno de los siguientes supuestos de vinculación, respecto del Presidente y Vicepresidente de la Nación, Jefe de Gabinete de Ministros y demás Ministros y autoridades de igual rango en el Poder Ejecutivo Nacional, aunque estos no tuvieran competencia para decidir sobre la contratación o acto de que se trata:
              <br /> a - Parentesco por consanguinidad dentro del cuarto grado y segundo de afinidad
              <br /> b - Sociedad o comunidad,
              <br /> c - Pleito pendiente,
              <br />d - Ser deudor o acreedor,
              <br /> e - Haber recibido beneficios de importancia,
              <br /> f - Amistad pública que se manifieste por gran familiaridad y frecuencia en el trato.
              <br />En caso de que el declarante sea una persona jurídica, deberá consignarse cualquiera de los vínculos anteriores, existentes en forma actual o dentro del último año calendario, entre los funcionarios alcanzados y los representantes legales, sociedades controlantes o controladas o con interés directo en los resultados económicos o financieros, director, socio o accionista que posea participación, por cualquier título, idónea para formar la voluntad social o que ejerza una influencia dominante como consecuencia de acciones, cuotas o partes de interés poseídas.
              <br />Para el caso de sociedades sujetas al régimen de oferta pública conforme a la Ley N° 26831 la vinculación se entenderá referida a cualquier accionista o socio que posea más del CINCO POR CIENTO (5%) del capital social.
              <br />Artículo 2.- Deberá presentarse idéntica declaración y en los mismos supuestos previstos en el artículo 1º, cuando la vinculación exista en relación al funcionario de rango inferior a ministro que tenga competencia o capacidad para decidir sobre la contratación o acto que interese al declarante.</p>
        </div>

        <div className="grid grid-cols-1  mt-2 ">
          <div className="mt-4" >
            <Switch
              label="La persona jurídica declarante tiene vinculación con los funcionarios enunciados en los art 1 y 2 del Decreto 202/2017"
              labelRequired="*"
              SwitchLabel1="Si"
              SwitchLabel2="No"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
              value={tramite.aplicaDecretoDoscientosDos}
              onChange={value => {
                tramite.aplicaDecretoDoscientosDos = value
                setTramite(Object.assign({}, tramite))
              }}
            />
          </div>
        </div>
        {!tramite.aplicaDecretoDoscientosDos ? '' : <div>

          {showError ? <div className="mb-4">
            <Alert
              message=''
              description={error}
              type="error"
              showIcon
              closable
              afterClose={() => setShowError(false)}
            /></div> : ''}

          <div className="text-xl font-bold py-4 w-3/4">  Vínculos a Declarar</div>

          <div className="grid grid-cols-2  gap-4 mt-2 ">
            <div >
              <SelectSimple
                value={decretoTipoFuncionarios}
                bindFunction={setDecretoTipoFuncionarios}
                title="¿Con cuál funcionario?"
                defaultOption="Seleccione el tipo de personeria"
                labelRequired="*"
                labelMessageError=""
                required
                option={tipoFuncionarios.map(u => (
                  <Option value={u.value}>{u.label}</Option>
                ))} />

            </div>
            <div className="flex" >
              <div className="w-full mr-2">
              <SelectSimple
                value={decretoTipoVinculo}
                bindFunction={setDecretoTipoVinculo}
                title="Tipo de vínculo"
                defaultOption="Seleccione el tipo de vinculo"
                labelRequired="*"
                labelMessageError=""
                required
                option={tipoVinculo.map(u => (
                  <Option value={u.value}>{u.label}</Option>
                ))} />
                </div>
                 <div className="  mt-8 ">
              <Button type="primary" onClick={addPersonasAlDecreto} > Agregar</Button>
            </div>

            </div>

           
          </div>
          <Table columns={columnsDecreto} 
          dataSource={tramite.datosDecretoDoscientosDos} 
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información disponible</span>}></Empty>,}} />

        </div>}
      </div>


      {showSaveButton()}
    </div>

  </div>
  )
}






const tipoPersona = [
  {
    label: 'Apoderado',
    value: 'Apoderado',
    
  },
  {
    label: 'Representante Legal',
    value: 'Rep Legal',
    parent: 'PF'
  },

  {
    label: 'Administrativo/Gestor',
    value: 'Administrativo/Gestor',
  }

]
const tipoPersonaPF = [
  {
    label: 'Apoderado',
    value: 'Apoderado',
    
  },
  {
    label: 'Titular',
    value: 'Titular',
    parent: 'PF'
  },

  {
    label: 'Administrativo/Gestor',
    value: 'Administrativo/Gestor',
  }

]

const tipoPersoneria = [
  {
    label: 'Persona Fisica',
    value: 'PF',
  },
  {
    label: 'Sociedad Anonima',
    value: 'SA',
  },
  {
    label: 'Sociedad Responsabilidad Limitada',
    value: 'SRL',
  },
  {
    label: 'Cooperativa',
    value: 'Cooperativa',
  },
  {
    label: 'UTE',
    value: 'UTE',
  },
  {
    label: 'Personeria Juridica extranjera con sucursal en el Pais',
    value: 'PJESP',
  },
  {
    label: 'Otras Formas Societarias',
    value: 'OFS',
  },


]
const tipoDocumento = [
  {
    label: 'DU',
    value: 'DU',
  },
  {
    label: 'Pasaporte',
    value: 'Pasaporte',
  },
  {
    label: 'Cedula de indentidad',
    value: 'CD',
  },


]

const tipoEmpresas = [
  {
    label: 'Constructora',
    value: 'CONSTRUCTORA',
    option: 'Constructora',
  },
  {
    label: 'Proveedora',
    value: 'PROVEEDORA',
    option: 'Proveedora',
  },
  {
    label: 'Consultora',
    value: 'CONSULTORA',
    option: 'Consultora',
  },

]
const tipoFuncionarios = [
  {
    label: 'Presidente',
    value: 'Presidente',
  },
  {
    label: 'Vicepresidente',
    value: 'Vicepresidente',
  },
  {
    label: 'Jefe de Gabinete de Ministros ',
    value: 'JefeGabinete',
  },
  {
    label: 'Ministros',
    value: 'Ministros',
  },
  {
    label: 'Autoridad con rango de ministro en el Poder Ejecutivo Nacional',
    value: 'AutoridadPE',
  },
  {
    label: 'Autoridad con rango inferior a Ministro con capacidad para decidir',
    value: 'Autoridad',
  },
]

const tipoVinculo = [
  {
    label: 'Sociedad o comunidad',
    value: 'sociedad',
  },
  {
    label: 'Parentesco por consanguinidad dentro del cuarto grado y segundo deafinidad',
    value: 'Parentesco',
  },
  {
    label: 'Pleito pendiente ',
    value: 'Pleito',
  },
  {
    label: 'Ser deudor',
    value: 'SerDeudor',
  },
  {
    label: 'Ser acreedor',
    value: 'Acreedor',
  },
  {
    label: 'Haber recibido beneficios de importancia de parte del funcionario',
    value: 'BeneficiosFuncionario',
  },
]



const columnsDecreto = [

 
  {
    title: 'Vinculo',
    dataIndex: 'tipoVinculo',
    key: 'tipoVinculo',
  },
  {
    title: 'Funcionario',
    dataIndex: 'tipoFuncionario',
    key: 'tipoFuncionario',
  }, {
    title: 'Observaciones',
    dataIndex: 'observaciones',
    key: 'decretoObervaciones',
  }


];
