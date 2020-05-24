module.exports = function (api) {
    api.cache(true)
    const presents = [[
        require.resolve('@babel/preset-env'),
        {
            'targets': {
                'browsers': '> 0.5%, not dead'
            },
            'useBuiltIns': 'entry',
            'corejs': 2,
            'modules': false
        }
    ], require.resolve('@babel/preset-react'), require.resolve('@babel/preset-typescript')]
    const plugins =  [
        [require.resolve("@babel/plugin-proposal-decorators"), { "legacy": true }],
        require.resolve('@babel/plugin-proposal-optional-chaining'), 
        require.resolve('@babel/plugin-proposal-class-properties')
    ]
    return {
        presets: presents,
        plugins: plugins,
        ignore: ['node_modules']
    }
}
