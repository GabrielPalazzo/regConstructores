import '../public/style/main.css'
import 'antd/dist/antd.css'
import withReduxStore from '../redux/lib/with-redux-store'
import { Provider } from 'react-redux'
import Mantenimiento from '../components/mantenimiento'
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';



function MyApp({ Component, pageProps, reduxStore }) {
  return <div>
     <ConfigProvider locale={esES}>
    <head>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
    </head>
    <Provider store={reduxStore}>
      {process.env.MODO==='MANTENIMIENTO' ? <Mantenimiento /> : <Component {...pageProps} /> }
    </Provider>
    </ConfigProvider>
  </div>
}

export default withReduxStore(MyApp)
