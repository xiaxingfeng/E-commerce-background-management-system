module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8888/api/private/v1',
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}