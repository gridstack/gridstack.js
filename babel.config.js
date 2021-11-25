module.exports = function (api) {
    api.cache(true);
    const presets = [
      [
        '@babel/preset-env',
        {
          modules: "commonjs",
          corejs : {
            version : "3",
            proposals : true
          },
          useBuiltIns: 'usage',
          targets: {
            browsers: [
              "edge >= 16",
              "safari >= 9",
              "firefox >= 57",
              "ie >= 11",
              "ios >= 9",
              "chrome >= 49"
            ]
          }
        }
      ]
    ];
    const plugins= [
        ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ];
    return {
      presets,
      plugins
    }
  }