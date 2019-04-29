module.exports = {
  output: {
    path: __dirname
  },
  devServer: {
    open: true,
    hotOnly: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
