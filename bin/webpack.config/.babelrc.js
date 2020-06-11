const path = require('path')

module.exports = function (api) {
     api.cache(false)
    const presents = [
        [
            require.resolve('@babel/preset-env'),
            {
                'targets': {
                    'browsers': '> 0.5%, not dead'
                },
                'useBuiltIns': 'entry',
                'corejs': 2,
                'modules': false
            }
        ],
        require.resolve('@babel/preset-react'),
        require.resolve('@babel/preset-typescript')
    ]
    const plugins =  [
         // 装饰器
        [
            require.resolve("@babel/plugin-proposal-decorators"), { "legacy": true }
        ],
        // 可选链式调用
        require.resolve('@babel/plugin-proposal-optional-chaining'),
        // 解析类的属性
        require.resolve('@babel/plugin-proposal-class-properties'),
    ]
    return {
        presets: presents,
        plugins: plugins,
        ignore: ['node_modules','bower_components']
    }
}
