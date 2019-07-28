const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')

const distFolder = path.join(__dirname, 'dist')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
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
    extensions: ['.js', '.json', '.css', '.png']
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