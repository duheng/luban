const path = require('path');

module.exports = function (api) {
  api.cache(true);
  const presents = [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          browsers: '> 0.5%, not dead',
        },
        modules: false, // 推荐
        useBuiltIns: 'usage', // 推荐
        corejs: 3,
      },
    ],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ];
  const plugins = [
    // 装饰器
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    // 可选链式调用
    require.resolve('@babel/plugin-proposal-optional-chaining'),
    // 解析类的属性
    require.resolve('@babel/plugin-proposal-class-properties'),
    // Polyfills the runtime needed for async/await and generators
    require.resolve('@babel/plugin-transform-modules-commonjs'),
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-transform-remove-strict-mode'),
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        corejs: 3,
        helpers: true,
      },
    ],
    [
      require.resolve('babel-plugin-import'),
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
    [
      require.resolve('babel-plugin-import'),
      {
        libraryName: '@ant-design',
        libraryDirectory: 'icons',
        camel2DashComponentName: false, // default: true
      },
      '@ant-design/icons',
    ],
  ];
  return {
    presets: presents,
    plugins: plugins,
    sourceType: 'unambiguous', // 解决ES6和CommonJS模块导出的问题: https://babeljs.io/docs/en/options#sourcetype
    ignore: ['node_modules', 'bower_components'],
  };
};
