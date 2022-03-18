import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Page, PageProps } from './Page';
import {Loading, LoadingProps} from '../components/loading'
import '../public/style/main.css'
import 'antd/dist/antd.css'

export default {
  title: 'Example/Loading',
  component: Loading,
} as Meta;

const Template: Story<LoadingProps> = (args) => <Loading {...args} />;

export const General = Template.bind({});
