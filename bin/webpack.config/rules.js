const path = require('path')

const postCssLoader = () => {
    return {
        loader: require.resolve('postcss-loader'),
        options: {
            ident: 'postcss',
            plugins: [require(require.resolve('autoprefixer'))({
                overrideBrowserslist: [
                    'ie >= 9',
                    '> 1%',
                    'iOS 7',
                    'last 3 iOS versions'
                ]
            })]
        }
    }
}

const rules = {
  js: () => {
    return {
            test: /\.(js|jsx|ts|tsx)$/,
            use: [
                {
                    loader: require.resolve('thread-loader')
                },
                {
                    loader: require.resolve('babel-loader'),
                    options: {
                        babelrc: false,
                        configFile: path.resolve(__dirname, '.babelrc.js')
                    }
                }
            ].filter(Boolean)
        }
  },
  css: () => {
  	let loaders = {
            test: /\.css$/,
            use: [
	            require.resolve('style-loader'),
	            require.resolve('css-loader'),
	            postCssLoader()
	        ].filter(Boolean)
        }
    return loaders
  },
  less: () => {
  	return {
	    test: /\.less$/,
	    use: [
	        {
	           loader: require.resolve('less-loader')
	        }
	    ].filter(Boolean)
    }
  },
  scss: () => {
  	return {
	    test: /\.scss$/,
	    use: [
        {
          loader: "style-loader" // 将 JS 字符串生成为 style 节点
        }, {
            loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
        }, {
            loader: "sass-loader" // 将 Sass 编译成 CSS
        }
	    ].filter(Boolean)
    }
  }

}


module.exports = () => {
	let rule = []
	for(let key in rules) {
		rule.push(rules[key]())
	}
	return {
    rules:rule
  }
}
