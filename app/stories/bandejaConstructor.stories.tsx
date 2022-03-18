import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import {BandejaConstructor, BandejaConstructorProps} from '../components/bandejaConstructor'
import '../public/style/main.css'
import 'antd/dist/antd.css'

import { Provider } from 'react-redux'
import withReduxStore from '../redux/lib/with-redux-store'
import createStore from '../redux/store'

export default {
  title: 'Example/Bandeja Constructor',
  component: BandejaConstructor,
} as Meta;

const reduxStore = createStore()

const Template: Story<BandejaConstructorProps> = (args) => <Provider store={reduxStore}><BandejaConstructor {...args} /></Provider>

export const General = Template.bind({});
