import {
    createStore, applyMiddleware, combineReducers, bindActionCreators,
  } from 'redux'
  import { composeWithDevTools } from 'redux-devtools-extension'
  import thunkMiddleware from 'redux-thunk'


import {initialStateReducer,SET_PASOS} from './reducers/main'
import {initialStateReducer as initialStateReducerRevisionTramites} from './reducers/revisionTramite'

export const initialState = {
  appStatus: {
    tipoAccion: null,
    tramiteAlta: null,
    resultadoAnalisisTramiteGeneral:["wait","wait","wait","wait","wait"],
    paso: SET_PASOS.SET_PASO_INSCRIPCION
  },
  revisionTramites:null
}

const reducers = combineReducers({
  appStatus: initialStateReducer,
  revisionTramites: initialStateReducerRevisionTramites
})

export type RootState = ReturnType<typeof reducers>

export default () => createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
)
