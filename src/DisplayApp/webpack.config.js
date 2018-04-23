var webpack = require('webpack');
var path = require('path');
var extractTextPlugin = require("extract-text-webpack-plugin");
var optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = ({ BUILD }) => {
	const entryApp = [
		path.join(__dirname, './src')
	];
	if (!BUILD) {
		entryApp.push(
			'webpack-dev-server/client?http://localhost:3000',
			'webpack/hot/dev-server'
		);
	}

	const plugins = [
		new copyWebpackPlugin([
			{
				context: path.join(__dirname, './src/fonts'),
				from: '**/*',
				to: path.join(__dirname, './dist/fonts')
			},
			{
				context: path.join(__dirname, './src/json'),
				from: '**/*',
				to: path.join(__dirname, './dist/json')
			}
		]),
		new extractTextPlugin({
			filename: 'main.css',
			disable: false,
			allChunks: true
		}),
		new webpack.NoEmitOnErrorsPlugin()
	];
	if (!BUILD) {
		plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	return {
		target: 'electron-renderer',
		devtool: 'cheap-source-map', // the best source map for dev. may want to change for production, or remove
		devServer: {
			contentBase: path.join(__dirname, './'),
			port: 3000,
			hot: true,
			historyApiFallback: true // show index.html for 404s
		},
		entry: {
			app: entryApp
		},
		output: {
			path: path.join(__dirname, './dist'),
			publicPath: 'dist',
			filename: '[name].bundle.js'
		},
		node: {
			Buffer: false // this helps with stylelint
		},
		resolve: {
			modules: [
				path.join(__dirname, '../node_modules'),
				path.join(__dirname, './src')
			],
			extensions: ['.js', '.jsx', '.scss', '.css']
		},
		module: {
			loaders: [
				{
					test: /\.jsx?/,
					exclude: /(node_modules)/,
					use: ['babel-loader', 'eslint-loader']
				},
				{
					test: /\.scss$/,
					use: ['css-hot-loader'].concat(extractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									sourceMap: true,
									importLoaders: 1
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									sourceMap: true,
									plugins: () => [
										require('postcss-cssnext'),
										require('postcss-reporter')({ clearMessages: true })
									]
								}
							},
							{
								loader: 'sass-loader',
								options: {
									outputStyle: "expanded",
									outFile: 'main.css',
									sourceMap: true,
									sourceMapContents: true
								}
							}
						]
					}))
				},
				{   // compile css in the same way, without the sass loader
					test: /\.css/,
					use: ['css-hot-loader'].concat(extractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									sourceMap: true,
									importLoaders: 1
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									plugins: () => [
										require('postcss-cssnext'),
										require('postcss-reporter')({ clearMessages: true })
									]
								}
							},
						]
					}))
				}
			]
		},
		plugins: plugins
	}
};
