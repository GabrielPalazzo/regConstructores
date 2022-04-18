import { UPDATE_REVISION_TRAMITE, INIT_REVISION, LOAD_REVISION } from "../reducers/revisionTramite"
import _ from 'lodash'
import { getUsuario, saveTramiteService } from "../../services/business"

export const cargarRevision = (revision) => async (dispatch, getState) => {
  return dispatch({
    type: LOAD_REVISION,
    revision
  })
}

export const cargarUltimaRevisionAbierta = (tramite: TramiteAlta) => async (dispatch, getState) => {
  //const tramite: TramiteAlta = getState().appStatus.tramiteAlta
  return dispatch({
    type: LOAD_REVISION,
    revision: tramite.revisiones ? _.last(tramite.revisiones) : null
  })
}


export const InitRevisionTramite = () => async (dispatch, getState) => {
  const tramite: TramiteAlta = getState().appStatus.tramiteAlta
  let revision: RevisionTramite = {
    creator: getUsuario().userData(),
    status: 'ABIERTA',
    version: 1,
    reviews: []
  }
  if (!tramite.revisiones)
    tramite.revisiones = []

  else {
    if (tramite.revisiones.filter(r => r && r.status === 'ABIERTA').length === 0) {
      tramite.revisiones.push(revision)
      saveTramiteService(tramite)
    }
    else
      revision = _.last(tramite.revisiones.filter(r =>  r && r.status === 'ABIERTA'))
  }

  return dispatch({
    type: INIT_REVISION,
    revision
  })
}

export const updateRevisionTramite = (revision) => async (dispatch, getState) => {
  return dispatch({
    type: UPDATE_REVISION_TRAMITE,
    revision
  })
}