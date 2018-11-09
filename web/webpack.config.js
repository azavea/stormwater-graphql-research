const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const APP_NAME = 'react-leaflet-sandbox';

module.exports = ({ production }) => {
    const environmentPlugins = !!production ? [
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
        }),
        new SWPrecacheWebpackPlugin({
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'serviceWorker.js',
            logger(message) {
                console.log(message);
            },
            minify: true,
            navigateFallback: '/index.html',
            staticFileGlobsIgnorePatterns: [
                    /\.map$/,
                    /asset-manifest\.json$/,
            ],
        }),
        new webpack.EnvironmentPlugin({
            APP_NAME,
            NODE_ENV: 'production',
        }),
        new UglifyJsPlugin(),
    ] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
        }),
        new webpack.EnvironmentPlugin({
            APP_NAME,
            NODE_ENV: 'development',
        }),
    ];

    return {
        entry: [
            './src/main.jsx',
        ],
        mode: !!production ? 'production' : 'development',
        output: {
            path: !!production ? path.resolve('./dist') : __dirname,
            publicPath: '/',
            filename: 'react.leaflet.sandbox.[hash].js',
        },
        plugins: environmentPlugins.concat([
            new webpack.LoaderOptionsPlugin({
                test: /\.jsx?$/,
                options: {
                    eslint: {
                        configFile: '.eslintrc',
                    },
                },
            }),
            new HtmlWebpackPlugin({
                title: APP_NAME,
                template: 'index.html',
            }),
        ]),
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options:
                    {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                        ],
                        plugins: [
                            'react-hot-loader/babel',
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-syntax-object-rest-spread',
                        ],
                    },
                },
                {
                    test: /\.(jpg|png|svg|ttf|eot|woff|woff2)$/,
                    use: 'url-loader',
                },
                {
                    test: /leaflet.css$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                        {
                            loader: 'resolve-url-loader',

                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                    ]
                },
                {
                    test: /\.scss$/,
                    exclude: (/node_modules/),
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.jsx?/,
                    exclude: [/node_modules/, /\.json$/],
                    loader: 'eslint-loader',
                },
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto",
                },
                {
                    test: require.resolve('leaflet'),
                    use: [
                        {
                            loader: 'expose-loader',
                            query: 'leaflet'
                        },
                        {
                            loader: 'expose-loader',
                            query: 'L'
                        }
                    ]
                },
            ],
        },
        watchOptions: {
            poll: 1000,
            ignored: /node_modules/,
        },
        devServer: {
            hot: true,
            watchOptions: {
                poll: 1000,
                ignored: /node_modules/,
            },
            disableHostCheck: true,
            host: '0.0.0.0',
            clientLogLevel: 'warning',
        },
        resolve: {
            extensions: ['.mjs', '.js', '.jsx'],
        },
    };
};
