const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');

module.exports = async () => {
  const compiler = webpack(config);

  const server = new WebpackDevServer({
    port: 9000,       // Порт для сервера
    static: './dist',
    compress: true,  // Включаем сжатие ресурсов
    hot: false,
    liveReload: false,
  }, compiler);

  await server.start();

  // Для Jest
  global.__SERVER__ = server;
};