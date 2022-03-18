import React, { useEffect } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import {TomarTramiteProps,TomarTramite} from '../components/tomarTramite'
import '../public/style/main.css'
import 'antd/dist/antd.css'

import { Provider } from 'react-redux'
import withReduxStore from '../redux/lib/with-redux-store'
import createStore from '../redux/store'
import {useDispatch} from 'react-redux'
import { setTramiteView } from '../redux/actions/main';
const reduxStore = createStore()

export default {
  title: 'General/Tomar Tramite',
  component: TomarTramite,
} as Meta;

const Template: Story<TomarTramiteProps> = (args) => {
  
  return <Provider store={reduxStore}><TomarTramite {...args} /></Provider>
}

export const General = Template.bind({});