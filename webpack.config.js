const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const PUBLIC_PATH = "https://flatsteve.github.io/meet-in-the-middle/";

module.exports = (env, args) => {
  return {
    output: {
      path: __dirname + "/dist",
      filename: "[name].js",
      sourceMapFilename: "[name].js.map"
    },
    devtool: "source-map",
    devServer: {
      open: true,
      hotOnly: true,
      port: 9000
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
            // Fallback to style-loader in development
            args.mode === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "images"
              }
            }
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
      }),
      new CopyWebpackPlugin([
        { from: "./src/images/pwa-icons", to: "images/icons" },
        { from: "./src/manifest.json", to: "manifest.json" },
        { from: "./src/sitemap.xml", to: "sitemap.xml" }
      ]),
      new SWPrecacheWebpackPlugin({
        cacheId: "meet-in-the-middle",
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: "service-worker.js",
        minify: true,
        navigateFallback: PUBLIC_PATH + "index.html",
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
      })
    ]
  };
};
