const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
  entry:{
    move: './src/move.js',
  },
  output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: argv.mode === 'production' ? "../" : "/",
      filename: 'js/[name].js'
  },

  module:{
    rules:[
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: 'css-loader',
            publicPath: '../',
        })    
      },

      {
        test: /\.(mp(3|4))$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'media/[name].[ext]',
          }
        }
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 500,
              name: 'img/[name].[ext]',
            }
          }
        ]
      },

      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
            attrs: ['img:src', 'audio:src', 'video:src']
          }
        }
      }
      
    ]
  },

  plugins:[
    //独立打包css
    new ExtractTextPlugin('css/[name].css'),

    //对html模板进行处理，生成对应的html,引入需要的资源模块
    new HtmlWebpackPlugin({
      template:'./move.html',//模板文件
      filename:'move.html',//目标文件
      inject:true,//资源加入到底部
      hash:true,//加入版本号
      chunks:['move'],
    }),
  ],

  //本地服务器配置
  devServer: {
    contentBase: "./",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true, //实时刷新
    open: true //是否运行成功后直接打开页面
  },

  //不显示警告
  performance: {
    hints: false
  }
})