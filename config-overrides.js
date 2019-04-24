/* config-overrides.js */

module.exports = function override(config, env) {

    config.module.rules.push(
        {
            test: /\.js$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['transform-custom-element-classes', '@babel/plugin-syntax-dynamic-import']
                    },
                }
            ],
        }
    )

    //do stuff with the webpack config...
    return config;
}