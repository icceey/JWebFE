
module.exports = {
    devServer: {
        // port: 80,
        proxy: {
            '/api': {
                target: require('./src/util/constants.js').SERVER,
                changeOrigin: true,
                // ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}