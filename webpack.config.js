const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src')
}

const dir = path.resolve(__dirname, '.');

const commonConfig = {
    entry: './src/js/app.js',
    output: {
    filename: 'js/[name].[chunkhash:8].js',
    path: dir + '/public/',
    assetModuleFilename: 'img/[name][ext]'
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        filename: dir + '/public/index.html',
        template: dir + '/src/index.html'
    })
  ]
};

const productionConfig = {

    optimization: {
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true
            }
          }
        }
      },

    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
          {
            test: /\.html$/i,
            loader: "html-loader",
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              "postcss-loader",
              "sass-loader"
            ],
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource'
         },
        ]
      },

      plugins: [
        new MiniCssExtractPlugin({
        filename: 'css/[name].[chunkhash:8].css',
        chunkFilename: "[id].css"
        }),

        new PurgecssPlugin({
          paths: glob.sync(`${PATHS.src}/**/*`,
          { nodir: true }),
          safelist: ['::placeholder']
        }),
    ],
};

const developmentConfig = {
    devtool: 'source-map',
    devServer: {
        devMiddleware: {
            index: true,
            writeToDisk: true,
          },
        client: {
            logging: 'none',
        },
        open: true,

    },
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              "style-loader",
              "css-loader",
              "sass-loader",
            ],
          },
          {
            test: /\.html$/i,
            loader: "html-loader",
          },
        ],
      },
};

module.exports = (env, args) => {
  switch(args.mode) {
    case 'development':
        return merge(commonConfig, developmentConfig);
    case 'production':
        return merge(commonConfig, productionConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
}