const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: './',
      filename: 'js/bundle.js'
  },

  module:{
    rules:[
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: 'css-loader'
        })    
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 500,
              name: 'img/[name].[hash:7].[ext]',
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
            attrs: ['img:src']
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
      template:'./index.html',//模板文件
      filename:'index.html',//目标文件
      inject:true,//资源加入到底部
      hash:true//加入版本号
    })
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
}