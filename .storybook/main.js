const custom = require('../webpack.config.dev.js');

module.exports = {
    "stories": [
        "../src/**/*.stories.tsx",
    ],
    "addons": [
      "@storybook/addon-interactions",
      "@storybook/addon-essentials",
      "@storybook/addon-postcss",
      "@storybook/addon-links",
      "storycap",
    ],
    "framework": "@storybook/react",
    "webpackFinal": async config => {
        return {
            ...config,
            module: {
                ...config.module,
                rules: custom.module.rules,
            }
        };
    },
    "core": {
        builder: "webpack5",
    }
};
