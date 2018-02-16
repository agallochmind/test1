var webpack             = require('webpack');
var path                = require('path');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');
// 环境变量, dev, (test), online
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev'; 
//返回html文件对应的参数
var geHtmlWebpackPluginParams = function(name){
	return{
			//目标文件
		    filename        : 'view/'+name+'.html',
		    //源文件
            template        : './src/view/'+name+'.html',
           // favicon         : './favicon.ico',
            inject          : true,
            hash            : true,
            //将common和【name】文件夹下的文件打包到对应的html文件中
            chunks          : ['common', name],
            //chunksSortMode  : 'dependency',
            /*minify          : {
                removeComments: true,
                collapseWhitespace: false
            }*/
	};
};
//webpack配置
var config = {
  entry: {
  	//公共部分
  	'common' : ['./src/page/common/common.js'],
  	'index' : ['./src/page/index/index.js'],
  	'login' : ['./src/page/login/login.js'],
  },
  output: {
  	//目标文件存放路径
  	path: path.resolve(__dirname, './dist'),
    //访问路径,为了能够在开发模式下浏览器实时刷新
    publicPath: '/dist',
    //[name].js为目标文件名（根据入口文件名命名目标文件名）
    filename: 'js/[name].js'
  },
  //外部依赖的声明
  externals:{
        '$'         :'window.jQuery',
        'jquery'    :'window.jQuery'
  },
  module: {
        // noParse: [],
        loaders: [
        	{test: /\.css$/, 
        	loader: ExtractTextPlugin.extract({
                use: 'css-loader',
                fallback : 'style-loader'
        	})
        	},
        ]
  },  
  plugins: [
  	//提出公共部分
  	new webpack.optimize.CommonsChunkPlugin({
        name : 'common',
        filename : 'js/base.js'
    }),
    //css单独处理插件
    new ExtractTextPlugin('css/[name].css'),
    //html加载插件
    new HtmlWebpackPlugin(geHtmlWebpackPluginParams('index')),
  	new HtmlWebpackPlugin(geHtmlWebpackPluginParams('login')),
  ]
};

// 开发环境下，使用devServer热加载
if(WEBPACK_ENV === 'dev'){
    config.entry.app.push('webpack-dev-server/client?http://localhost:8086');
}
module.exports = config;