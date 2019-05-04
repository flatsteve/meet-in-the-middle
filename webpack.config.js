const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, args) => {
  return {
    output: {
      path: __dirname + "/dist"
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
        },
        {
          test: /\.scss$/,
          use: [
            // fallback to style-loader in development
            args.mode === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader"
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css"
      }),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        favicon: "./src/images/favicon.png"
      })
    ]
  };
};
