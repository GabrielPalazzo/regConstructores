import React, { useEffect, useState } from 'react';
import { Tabs, Collapse, Menu, Dropdown, Comment, Avatar, Form, Button, List, Input, Tooltip, Card, Tag } from 'antd';
import { ArrowRightOutlined, DownCircleOutlined, CloudDownloadOutlined, LockFilled, UnlockFilled } from '@ant-design/icons';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { closeSession, getObservacionesTecnicoRaw, getReviewAbierta, getUsuario } from '../../services/business';
import { Loading } from '../../components/loading'
import { getTramitesParaVerificar } from '../../services/business'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { setTramiteView } from '../../redux/actions/main';
import { SET_TRAMITE_NUEVO, SET_TRAMITE_VIEW } from '../../redux/reducers/main';
import { cargarUltimaRevisionAbierta } from '../../redux/actions/revisionTramite';

const { TabPane } = Tabs;
const Panel = Collapse.Panel;
const { TextArea } = Input;

function callback(key) {
  console.log(key);
}

const customPanelStyle = {
  background: '#fafafa',
  borderRadius: 10,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
};




export default () => {

  const [showing, setShowing] = useState(false)
  const [comments, setComments]   = useState(false)
  const [value, setValue]   = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  
  const [usuario, setUsuario] = useState<Usuario>(null)
  const [tramites, setTramites] = useState<Array<TramiteAlta>>(null)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      setUsuario(getUsuario().userData())
      setTramites((await getTramitesParaVerificar()).filter((t: TramiteAlta) => t.status === 'SUBSANADO'
        || t.status === 'A SUPERVISAR'
        || t.status === 'BORRADOR'
        || t.status === 'PENDIENTE DE APROBACION'
        || t.status === 'PENDIENTE DE REVISION'
        || t.status === 'SUBSANADO EN REVISION'
        || t.status === 'EN REVISION'))
    })()
  }, [])

  if ((!usuario) || (!tramites))
    return <Loading message="wait" type="waiting" />


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


  const getDefaultTabActive = () => {
    if (getUsuario().isControlador())
      return "3"

    if (getUsuario().isSupervisor())
      return '4'

    if (getUsuario().isAprobador())
      return '5'
  }

  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
      itemLayout="horizontal"
    />
  );


  

  const Editor = ({ }) => (
    <>
      <Form.Item>
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item className="m-auto text-center">
      <Button htmlType="submit"  className="text-center mr-4">
      Liberar
        </Button>
        <Button htmlType="submit" type="primary" className="text-center">
          Enviar al Constructor
        </Button>
      </Form.Item>
    </>
  );

  return (

    <div>
      <div className="py-2 flex justify-between content-center border-gray-200 border-b-2">
        <div className="px-4 pt-4 py-2">
          <img src="../../img/logo.png" style={{ width: '150px' }} />
        </div>
        <div className="text-sm font-bold text-info-700 pr-6 text-right pt-2">
          <Dropdown overlay={menu} trigger={['click']}>
            <div onClick={e => e.preventDefault()}>
              <Avatar style={{ color: '#fff', backgroundColor: '#50B7B2' }} >{usuario.GivenName.substring(0, 1)}</Avatar>
            </div>
          </Dropdown>


        </div>
      </div>
      <div className="px-20 py-6  m-auto mt-6">
        <div className="text-2xl font-bold py-4 text-center"> Aprobar trámite</div>


        <div className="w-2/4 m-auto">
        
          <Comment
            author={`${usuario.GivenName} ${usuario.Surname} -  SUPERVISOR` }
            avatar={
              <Avatar style={{ color: '#fff', backgroundColor: '#50B7B2' }} >{usuario.GivenName.substring(0, 1)}</Avatar>

            }
            content={
              <Editor />
            }
            datetime={
              <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment().fromNow()}</span>
              </Tooltip>
            }
          />
        </div>



      </div>


    </div>
  )
}
