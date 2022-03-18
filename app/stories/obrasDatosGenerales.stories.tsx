import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { ObrasDatosGeneralesProps, ObrasDatosGenerales } from '../components/obraDatosGenerales'
import '../public/style/main.css'
import 'antd/dist/antd.css'

import { Provider,useSelector } from 'react-redux'
import withReduxStore from '../redux/lib/with-redux-store'
import createStore from '../redux/store'
import { getEmptyTramiteAlta } from '../services/business';


const reduxStore = createStore()

export default {
	title: 'Obras/SeccionDatosGenerales',
	component: ObrasDatosGenerales,
} as Meta;
const Template: Story<ObrasDatosGeneralesProps> = (args) => <Provider store={reduxStore}><ObrasDatosGenerales {...args} /></Provider>

export const General = Template.bind({});