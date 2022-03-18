import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import {HeaderPrincipal, HeaderPrincipalProps} from '../components/header'
import '../public/style/main.css'
import 'antd/dist/antd.css'

import { Provider } from 'react-redux'
import withReduxStore from '../redux/lib/with-redux-store'
import createStore from '../redux/store'

export default {
  title: 'Example/Header Principal',
  component: HeaderPrincipal,
} as Meta;

const reduxStore = createStore()

const Template: Story<HeaderPrincipalProps> = (args) => <Provider store={reduxStore}><HeaderPrincipal {...args} /></Provider>

export const General = Template.bind({});
