import '!style-loader!css-loader!sass-loader!../src/index.scss';
import { withScreenshot } from 'storycap';

export const decorators = [
  withScreenshot,
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  screenshot: {

  },
}

