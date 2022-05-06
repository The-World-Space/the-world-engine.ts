const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
//const propertiesRenameTransformer = require('ts-transformer-properties-rename').default;
const minifyPrivatesTransformer = require('ts-transformer-minify-privates').default;
const TerserPlugin = require("terser-webpack-plugin");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    entry: "./test/test_project/index.ts",
    output: {
        path: path.join(__dirname, "/testbundle"),
        filename: "[name].bundle.js",
        assetModuleFilename: "images/[name][ext]",
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: false,
                    output: {
                        beautify: true,
                    },
                    mangle: {
                        keep_fnames: true,
                        keep_classnames: true,
                        properties: {
                            regex: /^_private_/,
                        }
                    },
                    nameCache: { }
                }
            }),
        ],
    //   splitChunks: {
    //     chunks: "all",
    //   },
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    getCustomTransformers: program => ({
                        before: [
                            minifyPrivatesTransformer(program),
                            //propertiesRenameTransformer(program, { entrySourceFiles: ["./index.ts"] })
                        ]
                    })
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: "asset",
            }
        ],
    },
    resolve: {
        modules: [path.join(__dirname, "src"), "node_modules"],
        extensions: [".ts", ".js"],
        alias: {
            "src": path.join(__dirname, "src")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./test/test_project/index.html",
        }),
        new ESLintPlugin({
            extensions: "ts",
        }),
        //new BundleAnalyzerPlugin(),
    ],
    devServer: {
        host: "0.0.0.0",
        port: 20310,
        allowedHosts: [
            "nonamehome.iptime.org",
        ],
        client: {
            logging: "none",
        },
    },
    mode: "development",
};
