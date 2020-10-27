var webpack = require('webpack');

module.exports = env => ({
    mode: "development",
    devtool: "source-map",
    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "source-map-loader"
            },
            {
                test: /\.css?$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader'
              },
              {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader'
              },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODEOS_ENDPOINT': env.NODEOS_ENDPOINT
            }
        }),
    ],

    devServer: {
        overlay: true,
        host: '0.0.0.0',
        sockPort: 443,
        allowedHosts: ['localhost', '.gitpod.io'],
    }
});