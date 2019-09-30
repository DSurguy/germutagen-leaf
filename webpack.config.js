const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const distFolder = path.join(__dirname, 'dist')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        type: 'javascript/auto',
        test: /\.(json)$/, //Yes, we import json files as direct references because GAMES
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.css', '.png'],
    plugins: [new TsconfigPathsPlugin()]
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: distFolder,
    compress: true,
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
    new CopyPlugin([
      {
        context: './src/assets',
        from: '**/*',
        to: 'assets'
      }
    ])
  ]
};