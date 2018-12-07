import React from 'react';
import ReactDOM from 'react-dom';
import {
  createRenderer,
  Provider,
  ThemeProvider,
} from '@mentimeter/ragnar-react';
import { designSystemConfig } from '@mentimeter/ragnar-dsc';
import * as fonts from '@mentimeter/ragnar-fonts';
import { reset, setup } from '@mentimeter/ragnar-reset';
import App from './App';

const renderer = createRenderer();
renderer.renderStatic(reset(setup(`body, #root`)));

Object.keys(fonts).forEach(key => {
  renderer.renderFont('Gilroy', fonts[key].files, fonts[key].style);
});

ReactDOM.render(
  <Provider renderer={renderer}>
    <ThemeProvider theme={designSystemConfig}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
