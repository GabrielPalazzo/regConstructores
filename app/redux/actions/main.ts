
import { SAVE_TRAMITE, SET_TRAMITE_NUEVO, SET_UPDATE_BORRADOR, SET_STATUS_GENERAL_TRAMITE, SET_TRAMITE_VIEW, LOCK_TRAMITE, UNLOCK_TRAMITE } from '../reducers/main'
import { getEmptyTramiteAlta, getUsuario, saveTramiteService } from '../../services/business'

export const setActionType = (tipoAccion: string) => async (dispatch, getState) => {
  return dispatch({
    type: tipoAccion,
    tramiteAlta: {
      ...getEmptyTramiteAlta(),
      status: 'BORRADOR',
    },
    tipoAccion
  })
}

export const setTramiteView = (tramite: TramiteAlta) => async (dispatch, getState) => {
  return dispatch({
    type: SET_TRAMITE_VIEW,
    tramite
  })
}

export const lockTramite = (tramite: TramiteAlta) => async (dispatch, getState) => {
  saveTramiteService(tramite)
  return dispatch({
    type: LOCK_TRAMITE,
    tramite
  })
}

export const unLockTramite = (tramite: TramiteAlta) => async (dispatch, getState) => {
  saveTramiteService(tramite)
  return dispatch({
    type: UNLOCK_TRAMITE,
    tramite
  })
}

export const setPaso = (paso: string) => async (dispatch, getState) => {
  return dispatch({
    type: paso,
    paso
  })
}
function isNullOrUndefined<T>(object: T | undefined | null): object is T {
  return <T>object !== undefined && <T>object !== null;
}
/**
 * Se almacena un objeto TramiteAlta con todas sus revisiones aprobadas.
 * @param tramite Tramite de Alta para confirmar y generar certificado.
 * @returns Retorna el TramiteAlta actualizado.
 */
export const saveTramite = (tramite: TramiteAlta) => async (dispatch, getState) => {


  if (tramite == null) {    
    const tramiteAnterior: TramiteAlta = getState().appStatus.tramiteAlta;
    const tanterior = await saveTramiteService(tramiteAnterior);    
    throw new Error('No es posible generar el Certificado de Capacidad');
  };

  const revisionTramite = getState().revisionTramites.revision
  if (tramite.revisiones) {
    tramite.revisiones[0] = revisionTramite
  }

  const t = await saveTramiteService(tramite)
  return dispatch({
    type: SAVE_TRAMITE,
    tramite: t
  })
}

export const setStatusGeneralTramite = (status: Array<string>) => async (dispatch, getState) => {
  return dispatch({
    type: SET_STATUS_GENERAL_TRAMITE,
    status
  })
}

export const setUpdateBorrador = (tramite: TramiteAlta) => async (dispatch, getState) => {
  const t = await saveTramiteService(tramite)
  return dispatch({
    type: SET_UPDATE_BORRADOR,
    tipoAccion: 'UPDATE_BORRADOR',
    tramite: t
  })
}
