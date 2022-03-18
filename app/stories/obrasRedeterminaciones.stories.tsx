import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { ObrasRedeterminacionesProps, ObrasRedeterminaciones } from '../components/obraRedeterminaciones'
import '../public/style/main.css'
import 'antd/dist/antd.css'

import { Provider } from 'react-redux'
import withReduxStore from '../redux/lib/with-redux-store'
import createStore from '../redux/store'
const reduxStore = createStore()

export default {
	title: 'Obras/SeccionRedeterminaciones',
	component: ObrasRedeterminaciones,
} as Meta;

const Template: Story<ObrasRedeterminacionesProps> = (args) => <Provider store={reduxStore}><ObrasRedeterminaciones {...args} /></Provider>

export const General = Template.bind({});