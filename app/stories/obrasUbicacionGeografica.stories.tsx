import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { ObrasUbicacionGeograficaProps, ObrasUbicacionGeografica } from '../components/obrasUbicacionGeografica'
import '../public/style/main.css'
import 'antd/dist/antd.css'

import { Provider } from 'react-redux'
import withReduxStore from '../redux/lib/with-redux-store'
import createStore from '../redux/store'
const reduxStore = createStore()

export default {
	title: 'Obras/SeccionUbicacionGeografica',
	component: ObrasUbicacionGeografica,
} as Meta;

const Template: Story<ObrasUbicacionGeograficaProps> = (args) => <Provider store={reduxStore}><ObrasUbicacionGeografica {...args} /></Provider>

export const General = Template.bind({});