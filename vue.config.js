module.exports = {
    devServer: {
        port: 9998,
        proxy: {
            '/api':{
                target:'http://localhost:8887',
                changeOrigin:true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
