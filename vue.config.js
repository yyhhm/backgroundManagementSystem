module.exports = {
    // lintOnSave: false,
    devServer: {
        port: 8081,
        proxy: {
            '/admin': {
                target: 'http://localhost:8089',
            },
            '/image': {
                target: 'http://localhost:8089',
            },
        },
    },
}
