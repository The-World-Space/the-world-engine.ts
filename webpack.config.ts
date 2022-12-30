/* eslint-disable @typescript-eslint/naming-convention */
import ESLintPlugin from "eslint-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import minifyPrivatesTransformer from "ts-transformer-minify-privates";
import { Program } from "typescript";
import { Configuration } from "webpack";
//import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
//const propertiesRenameTransformer = require('ts-transformer-properties-rename').default;

const config: Configuration & { devServer?: any } = {
    entry: "./test/test_project/index.ts",
    output: {
        path: path.join(__dirname, "/testbundle"),
        filename: "[name].bundle.js",
        assetModuleFilename: "images/[name][ext]"
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: false,
                    output: {
                        beautify: true
                    },
                    mangle: {
                        keep_fnames: true,
                        keep_classnames: true,
                        properties: {
                            regex: /^_private_/
                        }
                    },
                    nameCache: {}
                }
            })
        ]
        //   splitChunks: {
        //     chunks: "all",
        //   },
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader",
            options: {
                configFile: "tsconfig.webpack.json",
                getCustomTransformers: (program: Program) => ({
                    before: [
                        minifyPrivatesTransformer(program)
                        //propertiesRenameTransformer(program, { entrySourceFiles: ["./index.ts"] })
                    ]
                })
            }
        },
        {
            test: /\.(png|jpg|gif)$/,
            type: "asset"
        }
        ]
    },
    resolve: {
        modules: [path.join(__dirname, "src"), "node_modules"],
        extensions: [".ts", ".js"],
        alias: {
            "@src": path.join(__dirname, "src")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./test/test_project/index.html"
        }),
        new ESLintPlugin({
            extensions: ["ts"],
            cache: true,
            fix: true
        })
        //new BundleAnalyzerPlugin()
    ],
    devServer: {
        host: "0.0.0.0",
        port: 20310,
        allowedHosts: [
            "nonamehome.iptime.org"
        ],
        client: {
            logging: "none"
        }
    },
    mode: "development"
};

export default config;
