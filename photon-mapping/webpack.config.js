const path=require('path');
module.exports={
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'./dist/'),
        filename:'bundle.js'
    },
    module:{},
    plugins:[],
    mode: 'development',
    devServer:{
        static: './dist',
        compress: true,
        port:1551,
        hot:true,
    },
    cache:false
}