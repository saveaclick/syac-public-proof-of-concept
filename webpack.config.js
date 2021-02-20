const path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
        fallback:{ "querystring": require.resolve("querystring-es3"),
        "url": require.resolve("url/"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/") 
     },
     extensions: ['.ts', '.js'],
     
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist')
    }
}