import React, { useEffect } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { InputText, IProps } from '../components/input_text'
import '../public/style/main.css'
import 'antd/dist/antd.css'

import { Provider } from 'react-redux'
import withReduxStore from '../redux/lib/with-redux-store'
import createStore from '../redux/store'
import { useDispatch } from 'react-redux'
import { setTramiteView } from '../redux/actions/main';
const reduxStore = createStore()

export default {
    title: 'General/Input Text',
    component: InputText,
} as Meta;




const Template: Story<IProps> = (args) => {
  
  return <Provider store={reduxStore}><InputText {...args} /></Provider>
}

export const General = Template.bind({});


