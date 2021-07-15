const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CWD = process.cwd();

const devMode = process.env.NODE_ENV !== "production";
//const devMode = true
//process.env.NODE_ENV = 'development'
const postCssLoader = () => {
  return {
    loader: require.resolve("postcss-loader"),
    options: {
      ident: "postcss",
      plugins: [
        require(require.resolve("autoprefixer"))({
          overrideBrowserslist: [
            "ie >= 9",
            "> 1%",
            "iOS 7",
            "last 3 iOS versions",
          ],
        }),
      ],
    },
  };
};

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

const rules = {
  js: () => {
    return {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve("thread-loader"),
          // options: {
          //   workers: 4
          // }
        },
        {
          loader: require.resolve("cache-loader-hash"),
          options: {
            mode:'hash',
            cacheDirectory: path.resolve(CWD, ".cache-loader"),
          },
        },
        {
          loader: require.resolve("babel-loader"),
          options: {
            babelrc: false,
            compact: false,
            configFile: path.resolve(__dirname, ".babelrc.js"),
          },
        },
      ].filter(Boolean),
    };
  },
  vue: () => {
    return {
      test: /\.vue$/,
      exclude: /node_modules/,
      use: {
        loader: require.resolve("vue-loader"),
      },
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
      exclude: /node_modules/,
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
      exclude: /node_modules/,
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
        name: `${path.resolve(CWD, config.base)}/${config.assets}/images/[name]-[hash:8].[ext]`,
      },
    };
  },
   media: () => {
    return {
      test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            name: "[name]-[hash:8].[ext]",
          },
        },
        {
          loader: require.resolve("file-loader"),
          options: {
             name: '[name][hash:8].[ext]'
          }
        }
      ],
    };
  },

};

module.exports = (config) => {
  let rule = [];
  for (let key in rules) {
    rule.push(rules[key](config));
  }
  return {
    rules: rule,
  };
};
