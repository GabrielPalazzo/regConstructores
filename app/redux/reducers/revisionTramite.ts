import { LOCK_TRAMITE } from "./main"

export const UPDATE_REVISION_TRAMITE = 'UPDATE_REVISION_TRAMITE'
export const INIT_REVISION ='INIT_REVISION'
export const LOAD_REVISION ='LOAD_REVISION'

export const initialStateReducer = (state, action) => {
  switch (action.type) {
    case INIT_REVISION:
      return {...state,revision:action.revision}
    case LOAD_REVISION:
      return {...state,revision:action.revision}
    case UPDATE_REVISION_TRAMITE:
      return {...state,revision: action.revision}
    default:
      return {...state}
  }
}