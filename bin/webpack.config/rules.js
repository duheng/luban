const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { useCache, cacheDirectory } = require('../utils/buildCache');
const devMode = process.env.NODE_ENV !== "production";

const postCssLoader = () => {
  return {
    loader: require.resolve("postcss-loader"),
    options: {
      ident: "postcss",
      plugins: [
        require(require.resolve("autoprefixer"))({
          overrideBrowserslist: [
            "ie >= 10",
            "> 1%",
            "iOS 9",
            "last 3 iOS versions",
          ],
        }),
      ],
    },
  };
};

const chunkantdAction = () => {
  const chunk = [
    [
      require.resolve('babel-plugin-import'),
      {
        "libraryName":  "antd",
        "libraryDirectory": "es",
        "style": "less"
      },
    ],
    [
      require.resolve('babel-plugin-import'),
      {
        "libraryName": "@ant-design",
        "libraryDirectory": "icons",
        "camel2DashComponentName": false,  // default: true
      },
      "@ant-design/icons"
    ]
  ]
  return chunk
}

const loadBabelConfig = (chunkantd) => {
  const __config = path.resolve(__dirname, ".babelrc.js")
  let babelConfig = require(__config)
  if(chunkantd) {
    babelConfig.plugins.push(...chunkantdAction())
  }
  return babelConfig
}
const common_css_rule = [
  {
    loader: devMode
      ? require.resolve("style-loader")
      : MiniCssExtractPlugin.loader, // 将 JS 字符串生成为 style 节点
  },
  {
    loader: require.resolve("css-loader"),
  },
];
const __exclude =  /node_modules|dll|.luban-cache/ 
const rules = {
 
  js: (config) => {
    return {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: __exclude ,
      use: [
        {
          loader: require.resolve("thread-loader"),
          // options: {
          //   workers: 4
          // }
        },
        useCache &&
        process.env.NODE_ENV && {
          loader: require.resolve('cache-loader-hash'),
          options: {
            mode: 'hash',
            cacheDirectory: `${cacheDirectory}/${process.env.NODE_ENV}`,
          },
        },
        {
          loader: require.resolve("babel-loader"),
          options: {
            babelrc: false,
            compact: false,
            ...loadBabelConfig(!!config.chunkantd)
          },
        },
      ].filter(Boolean),
    };
  },
  css: () => {
    let loaders = {
      test: /\.css$/,
      use: [...common_css_rule, postCssLoader()].filter(Boolean),
    };
    return loaders;
  },
  less: () => {
    return {
      test: /\.less$/,
      exclude: __exclude ,
      use: [
        ...common_css_rule,
        {
          loader: require.resolve("less-loader"),
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      ].filter(Boolean),
    };
  },
  scss: () => {
    return {
      test: /\.(sa|sc)ss$/,
      exclude: __exclude ,
      use: [
        ...common_css_rule,
        {
          loader: require.resolve("sass-loader"), // 将 Sass 编译成 CSS
        },
      ].filter(Boolean),
    };
  },
  image: (config) => {
    return {
      test: /\.(jpe?g|png|gif|ico)$/,
      loader: require.resolve("url-loader"),
      options: {
        limit: config.base64_image_limit, // 20k以内的图片用base64，可配置
        outputPath: config.assets + '/image/',
        name: '[name]@[hash:8].[ext]',
      },
    };
  },
  svg: (config) => {
    return {
      test: /\.svg/,
      use: [
        {
          loader: require.resolve("file-loader"),
          options: {
            outputPath: config.assets + '/svg/',
            name: '[name]@[hash:8].[ext]',
          }
        }
      ],
    };
  },
   media: (config) => {
    return {
      test: /\.(eot|woff|otf|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            outputPath: config.assets + '/other/',
            name: '[name]@[hash:8].[ext]',
          },
        },
        {
          loader: require.resolve("file-loader"),
          options: {
            outputPath: config.assets + '/other/',
            name: '[name]@[hash:8].[ext]',
          }
        }
      ],
    };
  },

};

const vue = () => {
  return {
    test: /\.vue$/,
    exclude: __exclude ,
    use: {
      loader: require.resolve("vue-loader"),
    },
  };
}

module.exports = (config) => {
  let rule = [];
  for (let key in rules) {
    rule.push(rules[key](config));
  }
 
  if(config.platform == 'vue') {
    rule.push(vue())
  }

  return {
    rules: rule,
  };
};
