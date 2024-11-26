import type { Preview } from "@storybook/react";
import { Provider } from 'react-redux';

import '../src/index.scss'

import { store } from '../src/store'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        theme: /(light|dark)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, { parameters }) => {
      const { theme } = parameters;
      switch (theme) {
        case 'dark':
          return (
              <div id="app" className="color-theme--dark"><Story /></div>
          );
        case 'light':
        default:
          return (
              <div id="app" className="color-theme--light"><Story /></div>
          );
      }
    },
    (Story, { parameters }) => {
      const { redux } = parameters;

      if (redux) {
        return  (
            <Provider store={store}>
              <Story/>
            </Provider>
        )
      } else {
        return <Story/>;
      }
    },

  ],
};

export default preview;
