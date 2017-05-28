import React from 'react';
import { render } from 'react-dom';


import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
injectTapEventPlugin();

import App from './app';

require('./style.scss');

const Entry = () => {
  return (
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  );
};

render(
  <Entry />,
  document.getElementById('root')
);
