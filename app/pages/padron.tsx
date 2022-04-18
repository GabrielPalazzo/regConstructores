import React, { useEffect, useState } from 'react'
import { closeSession, getCertificados, getToken, getTramiteByCUIT, getUsuario, migrarCertificados, migrarEmpresa } from '../services/business'
import { useRouter } from 'next/router'
import { Avatar, Dropdown, Menu, Input, Table, Button, Modal } from 'antd'
import numeral from 'numeral'
import {Certificado} from '../components/certificado'
import { Loading } from '../components/loading'
import { useDispatch } from 'react-redux'
import { setTramiteView } from '../redux/actions/main'
import { cargarUltimaRevisionAbierta } from '../redux/actions/revisionTramite'



const { Search } = Input
const { TextArea } = Input

export default () => {

  const dispatch = useDispatch()
  const [textToSearch, setTextToSearch] = useState('')
  const [certificados, setCertificados] = useState([])
  const [showModalMigrador, setShowModalMigrador] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [key, setKey] = useState('')
  const [idProveedor, setIdProveedor] = useState('')
  const [isMigratingData, setIsMigratingData] = useState(false)
  const [allowed,setAllowed] = useState(false)
  const [certificado, setCertificado] = useState<CertificadoCapacidad>(null)
  const router = useRouter()

  useEffect(() => {
    const usuario = getUsuario().userData()

    if (!getUsuario() || !getUsuario().isBackOffice() )
      router.push('/login')
    else
      setAllowed(true)
  },[])

  const cerrarSesion = () => {
    closeSession()
    router.push('/login')
  }


  const menu = (
    <Menu>
      <Menu.Item>
        <div onClick={cerrarSesion}>
          Cerra sesión
          </div>
      </Menu.Item>

    </Menu>
  );


  const showTramite = async (cuit) => {
    const tramite = await getTramiteByCUIT(cuit) 
    dispatch(setTramiteView(tramite))
    dispatch(cargarUltimaRevisionAbierta(tramite))
    router.push('/informacion_basica')

  }

  const columns = [
    {
      title: 'Certificado',
      key: 'Certificado',
      render: (text, record) => <div><Certificado
        cuit={record.tramite.cuit}
        token={getToken()}
      /></div>
    }, 
    {
      title: 'Ficha',
      key: 'Ficha',
      render: (text, record) => <div><Button onClick={() => showTramite(record.tramite.cuit)}>Ver Ficha</Button></div>
    },
    {
      title: 'Razon Social',
      render: (text, record) => <div>{record.tramite.razonSocial}</div>,
      key: 'razonSocial',
    },
    {
      title: 'Tipo de Personeria',
      render: (text, record) => <div>{record.tramite.personeria}</div>,
      key: 'TipoPersoneria',
    },
    {
      title: 'Nro Cuit',
      render: (text, record) => <div>{record.tramite.cuit}</div>,
      key: 'NumeroCUIT',
    },
    {
      title: 'Capacidad de Contratacion',
      render: (text, record) => <div>{numeral(record.capacidadFinanciera).format('$0,0.00')}</div>,
      key: 'CapacidadContratacion',
    },
    {
      title: 'Capacidad de Ejecucion',
      render: (text, record) => <div>{numeral(record.capacidadEjecucion).format('$0,0.00')}</div>,
      key: 'CapacidadEjecucion',
    }



  ]

  const handleMigrarEmpresa = async () => {
    try {
      setIsMigratingData(true)
      await migrarEmpresa(idProveedor, key)
      setIsMigratingData(false)
    } catch (err) {
      alert(err)
      setIsMigratingData(false)
    }
  }
  if (isMigratingData)
    return <Loading message="Aguarde un instante por favor" type="sync" />


  if (!allowed) return <Loading  message='Aguarde un instante...' type='waiting'/>

  return <div>

    <Modal title="Basic Modal"
      visible={showModalMigrador}
      onOk={() => {
        setIsMigratingData(true)
        migrarCertificados(key).then(
          result => setIsMigratingData(false)
        )
      }}
      footer={[
        <Button onClick={() => setShowModalMigrador(false)} >Cancelar</Button>,
        <Button loading={isMigratingData} onClick={handleMigrarEmpresa}>Migrar</Button>
      ]}
      onCancel={() => setShowModalMigrador(false)}>

      <div>Id Proveedor a migrar</div>
      <Input value={idProveedor} onChange={e => setIdProveedor(e.target.value)}></Input>
    </Modal>


    <div className="py-2 flex justify-between content-center border-gray-200 border-b-2">
      <div className="px-4 pt-4 py-2">
        <Logo />
      </div>
      <div className="text-sm font-bold text-info-700 pr-6 text-right pt-2">
        <Dropdown overlay={menu} trigger={['click']}>
          <div onClick={e => e.preventDefault()}>
            {/*<Avatar style={{ color: '#fff', backgroundColor: '#50B7B2' }} >{usuario.GivenName.substring(0, 1)}</Avatar> */}
          </div>
        </Dropdown>

      </div>
    </div>

    <div className="w-1/2 p-4">
      <div className="text-2xl font-bold py-4"> Consulta de certificados otorgados</div>
      <div className="flex items-center">
        <Search
          placeholder="Ingrese el nombre de la empresa o CUIT"
          allowClear
          enterButton="Buscar"
          size="large"
          loading={isSearching}
          value={textToSearch}
          onChange={(e) => setTextToSearch(e.target.value)}
         
          onSearch={async () => {
            
            setIsSearching(true)
            setCertificados(await getCertificados(textToSearch, getToken()))
            setIsSearching(false)
            
          }}
        />



        <div className="px-8">
          <Button onClick={() => setShowModalMigrador(true)} danger >Migrar Empresas</Button>
        </div>


      </div>


    </div>
    <div className="p-4">
      <Table dataSource={certificados} columns={columns} />
    </div>


  </div>
}



const Logo = () => (
  <svg width="111" height="27" viewBox="0 0 111 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0)">
      <path d="M1.77992 17.7992C0.602434 16.5943 0 14.7323 0 12.2404C0 9.74851 0.629818 7.88644 1.91684 6.68157C3.20385 5.4767 5.06592 4.87427 7.50304 4.87427C8.59838 4.87427 9.63895 4.9838 10.5974 5.20287V7.94121C9.63895 7.74952 8.76268 7.66737 7.94118 7.66737C6.92799 7.66737 6.07911 7.83167 5.44929 8.13289C4.79209 8.43411 4.32657 8.92701 3.99797 9.58421C3.69675 10.2414 3.53245 11.1177 3.53245 12.213C3.53245 13.856 3.86106 15.0335 4.51826 15.7728C5.17546 16.4848 6.18864 16.8408 7.55781 16.8408C7.99594 16.8408 8.46146 16.786 8.95436 16.7039C9.44726 16.6217 9.99493 16.4848 10.5974 16.3205V19.0589C9.47465 19.4148 8.29716 19.6065 7.03753 19.6065C4.73732 19.6339 2.98479 19.0315 1.77992 17.7992Z" fill="#0072BB" />
      <path d="M13.6643 17.7992C12.4868 16.567 11.9117 14.7323 11.9117 12.2678C11.9117 9.80327 12.4868 7.9412 13.6369 6.70895C14.787 5.4767 16.43 4.87427 18.5659 4.87427C20.6744 4.87427 22.3174 5.4767 23.4675 6.70895C24.6176 7.9412 25.1927 9.77589 25.1927 12.2404C25.1927 13.8834 24.9188 15.2526 24.3986 16.3479C23.8509 17.4432 23.0842 18.2647 22.0984 18.8124C21.1126 19.3601 19.9077 19.6339 18.5385 19.6339C16.4848 19.6339 14.8418 19.0315 13.6643 17.7992ZM20.9483 15.9098C21.4959 15.1978 21.7424 13.9929 21.7424 12.2678C21.7424 10.5426 21.4685 9.31037 20.9483 8.57102C20.4006 7.85905 19.6065 7.50307 18.5659 7.50307C17.498 7.50307 16.7038 7.85905 16.1835 8.57102C15.6359 9.28299 15.3894 10.4879 15.3894 12.213C15.3894 13.3905 15.5263 14.3215 15.7728 15.0335C16.0192 15.7455 16.3752 16.2384 16.8408 16.5396C17.3063 16.8408 17.8813 16.9777 18.5933 16.9777C19.6065 16.9777 20.4006 16.6217 20.9483 15.9098Z" fill="#0072BB" />
      <path d="M27.7941 5.09333H30.642L30.8885 6.59942H31.0801C31.6278 6.05175 32.2576 5.61362 32.997 5.3124C33.7363 5.01118 34.5304 4.87427 35.3519 4.87427C36.8306 4.87427 37.9807 5.3124 38.857 6.18867C39.7059 7.06494 40.144 8.43411 40.144 10.2962V19.3875H36.6937V10.4879C36.6937 9.52944 36.502 8.84486 36.0913 8.46149C35.6805 8.05074 35.1055 7.85906 34.3388 7.85906C33.7637 7.85906 33.1887 7.96859 32.641 8.21504C32.0933 8.46149 31.6278 8.81747 31.2444 9.28299V19.3875H27.8215V5.09333H27.7941Z" fill="#0072BB" />
      <path d="M51.782 16.5943V19.3327C50.9605 19.5243 50.139 19.6339 49.3175 19.6339C45.9219 19.6339 44.2516 17.9361 44.2516 14.5132V7.83164H41.787V5.09331H44.2516L44.8266 0H47.6471V5.09331H51.6451V7.83164H47.6471V13.9655C47.6471 14.6501 47.7292 15.2252 47.9209 15.6359C48.1126 16.0467 48.3591 16.3479 48.7424 16.5122C49.0984 16.7039 49.5913 16.786 50.1937 16.786C50.6045 16.786 51.1522 16.7312 51.782 16.5943Z" fill="#0072BB" />
      <path d="M53.7262 5.09326H56.5467L56.8205 6.95532H57.0122C57.423 6.27074 57.9706 5.77784 58.6552 5.44924C59.3398 5.12064 60.1065 4.92896 60.9006 4.92896C61.284 4.92896 61.6674 4.95634 62.0508 5.0111V8.13281C61.7221 8.07804 61.2566 8.05066 60.709 8.05066C60.0244 8.05066 59.3672 8.18758 58.71 8.46141C58.0528 8.73524 57.5325 9.14599 57.1491 9.63889V19.36H53.7262V5.09326Z" fill="#0072BB" />
      <path d="M71.5528 5.42197C72.4564 5.77796 73.1136 6.38039 73.5517 7.20189C73.9899 8.02339 74.209 9.14611 74.209 10.57V19.3601H71.3611L71.1146 17.8814H70.9229C70.4848 18.4565 69.9371 18.8672 69.2799 19.1684C68.5954 19.4696 67.856 19.6066 67.0345 19.6066C66.1035 19.6066 65.282 19.4423 64.6248 19.1137C63.9402 18.7851 63.4199 18.3195 63.0639 17.7171C62.7079 17.1147 62.5162 16.4027 62.5162 15.5812C62.5162 14.2668 62.9818 13.2262 63.8854 12.5143C64.7891 11.8023 66.2404 11.3368 68.1846 11.1999L70.8682 10.9534V10.3784C70.8682 9.6664 70.7586 9.09135 70.5122 8.68059C70.2931 8.26984 69.9098 7.96863 69.4169 7.80433C68.924 7.64003 68.2668 7.53049 67.4452 7.53049C66.8702 7.53049 66.2404 7.58526 65.5558 7.66741C64.8712 7.77694 64.214 7.91386 63.5842 8.10554V5.47674C64.2414 5.28506 64.9534 5.12076 65.7475 5.01122C66.5416 4.90169 67.3083 4.84692 68.0203 4.84692C69.499 4.87431 70.6491 5.03861 71.5528 5.42197ZM69.6085 16.8956C70.0741 16.7039 70.5122 16.4027 70.8956 15.992V12.9524L68.5406 13.1715C67.6369 13.2536 66.9797 13.4727 66.569 13.8287C66.1582 14.1847 65.9392 14.6502 65.9392 15.28C65.9392 15.9098 66.1308 16.3753 66.4868 16.7313C66.8702 17.0599 67.3905 17.2242 68.1298 17.2242C68.6501 17.1968 69.1156 17.0873 69.6085 16.8956Z" fill="#0072BB" />
      <path d="M85.9017 16.5943V19.3327C85.0802 19.5243 84.2587 19.6339 83.4372 19.6339C80.0416 19.6339 78.3712 17.9361 78.3712 14.5132V7.83164H75.9067V5.09331H78.3712L78.9463 0H81.7668V5.09331H85.7647V7.83164H81.7668V13.9655C81.7668 14.6501 81.8489 15.2252 82.0406 15.6359C82.2323 16.0467 82.4787 16.3479 82.8621 16.5122C83.2181 16.7039 83.711 16.786 84.3134 16.786C84.7242 16.786 85.2445 16.7312 85.9017 16.5943Z" fill="#0072BB" />
      <path d="M96.1156 5.42197C97.0193 5.77796 97.6765 6.38039 98.1146 7.20189C98.5527 8.02339 98.7718 9.14611 98.7718 10.57V19.3601H95.9239L95.6775 17.8814H95.4858C95.0477 18.4565 94.5 18.8672 93.8428 19.1684C93.1582 19.4696 92.4189 19.6066 91.5974 19.6066C90.6663 19.6066 89.8448 19.4423 89.1876 19.1137C88.503 18.7851 87.9828 18.3195 87.6268 17.7171C87.2708 17.1147 87.0791 16.4027 87.0791 15.5812C87.0791 14.2668 87.5446 13.2262 88.4483 12.5143C89.3519 11.8023 90.8032 11.3368 92.7475 11.1999L95.431 10.9534V10.3784C95.431 9.6664 95.3215 9.09135 95.075 8.68059C94.856 8.26984 94.4726 7.96863 93.9797 7.80433C93.4868 7.64003 92.8296 7.53049 92.0081 7.53049C91.4331 7.53049 90.8032 7.58526 90.1187 7.66741C89.4341 7.74956 88.7769 7.91386 88.1471 8.10554V5.47674C88.8043 5.28506 89.5162 5.12076 90.3103 5.01122C91.1045 4.90169 91.8712 4.84692 92.5832 4.84692C94.0345 4.87431 95.212 5.03861 96.1156 5.42197ZM94.1714 16.8956C94.6369 16.7039 95.075 16.4027 95.4584 15.992V12.9524L93.1034 13.1441C92.1998 13.2262 91.5426 13.4453 91.1318 13.8013C90.7211 14.1573 90.502 14.6228 90.502 15.2526C90.502 15.8824 90.6937 16.3479 91.0497 16.7039C91.4331 17.0325 91.9533 17.1968 92.6927 17.1968C93.1856 17.1968 93.6785 17.0873 94.1714 16.8956Z" fill="#0072BB" />
      <path d="M101.948 5.09326H104.769L105.043 6.95532H105.234C105.645 6.27074 106.193 5.77784 106.877 5.44924C107.562 5.12064 108.329 4.92896 109.123 4.92896C109.506 4.92896 109.889 4.95634 110.273 5.0111V8.13281C109.944 8.07804 109.479 8.05066 108.931 8.05066C108.246 8.05066 107.589 8.18758 106.932 8.46141C106.275 8.73524 105.755 9.14599 105.371 9.63889V19.36H101.948V5.09326Z" fill="#0072BB" />
      <path d="M108.986 26.9999H88.3661C87.5446 26.9999 86.8874 26.3427 86.8874 25.5212C86.8874 24.6997 87.5446 24.0425 88.3661 24.0425H108.986C109.807 24.0425 110.464 24.6997 110.464 25.5212C110.464 26.3427 109.807 26.9999 108.986 26.9999Z" fill="#0072BB" />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="110.465" height="27" fill="white" />
      </clipPath>
    </defs>
  </svg>

)