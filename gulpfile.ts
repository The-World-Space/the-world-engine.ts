/* eslint-disable @typescript-eslint/naming-convention */
import alias from "@gulp-plugin/alias";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import gulp from "gulp";
import cleanDest from "gulp-clean-dest";
import filter from "gulp-filter";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import terser from "gulp-terser";
import ts from "gulp-typescript";
import rollupTypescript from "rollup-plugin-typescript2";
import minifyPrivatesTransformer from "ts-transformer-minify-privates";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const gru2 = require("gulp-rollup-2");
//const propertiesRenameTransformer = require("ts-transformer-properties-rename").default;

function terserStream(compress: boolean): NodeJS.ReadWriteStream {
    return terser({
        compress: compress,
        output: {
            beautify: !compress
        },
        mangle: {
            keep_fnames: true,
            keep_classnames: true,
            properties: {
                regex: /^_private_/
            }
        },
        nameCache: { }
    });
}

const tsProject = ts.createProject("tsconfig.json", {
    getCustomTransformers: program => ({
        before: [
            minifyPrivatesTransformer(program!)
            //propertiesRenameTransformer(program, { entrySourceFiles: ["./src/index.ts"] })
        ]
    }),
    declaration: true,
    module: "esnext"
});

gulp.task("esm", ((): import("undertaker").TaskFunction => {
    const src = ["src/**/*.ts", "src/**/*.js"];
    const dest = "dist/esm";

    function clean(): NodeJS.ReadWriteStream {
        return gulp.src(`${dest}/**/*`, { read: false, allowEmpty: true })
            .pipe(cleanDest(dest));
    }

    function tsBuild(): NodeJS.ReadWriteStream {
        return gulp.src(src)
            .pipe(alias({ config: tsProject.config.compilerOptions }))
            .pipe(tsProject())
            .pipe(gulp.dest(dest));
    }

    function tsMangleBuild(): NodeJS.ReadWriteStream {
        return gulp.src(src)
            .pipe(alias({ config: tsProject.config.compilerOptions }))
            .pipe(tsProject()).js
            .pipe(terserStream(false))
            .pipe(filter([
                "**",
                "!**/engine/hierarchy_object/Component.js",
                "!**/engine/hierarchy_object/Prefab.js"
            ]))
            .pipe(gulp.dest(dest, { overwrite: true }));
    }

    return gulp.series(clean, tsBuild, tsMangleBuild);
})());

gulp.task("umd", ((): import("undertaker").TaskFunction => {
    const dest = "dist/umd";

    function clean(): NodeJS.ReadWriteStream {
        return gulp.src(`${dest}/**/*`, { read: false, allowEmpty: true })
            .pipe(cleanDest(dest));
    }

    async function build(): Promise<NodeJS.ReadWriteStream> {
        return (await gru2.src({
            input: "src/index.ts",
            output: {
                file: "twengine.js",
                format: "umd",
                name: "twengine",
                globals: {
                    "three/src/Three": "THREE",
                    "three/src/math/MathUtils": "THREE.MathUtils",
                    "three/examples/jsm/postprocessing/EffectComposer": "EffectComposer",
                    "three/examples/jsm/postprocessing/RenderPass": "RenderPass"
                }
            },
            context: "this",
            plugins: [
                nodeResolve({
                    extensions: [".js", ".ts"],
                    resolveOnly: ["js-sdsl"]
                }),
                rollupTypescript({
                    tsconfigOverride: {
                        compilerOptions: {
                            target: "ES6",
                            module: "esnext",
                            declaration: false
                        },
                        include: ["src"]
                    }
                })
            ]
        }))
            .pipe(terserStream(false))
            .pipe(gulp.dest(dest))
            .pipe(sourcemaps.init())
            .pipe(terserStream(true))
            .pipe(rename({ extname: ".min.js" }))
            .pipe(sourcemaps.write(".", { includeContent: false }))
            .pipe(gulp.dest(dest));
    }

    return gulp.series(clean, build);
})());

gulp.task("default", gulp.series("esm", "umd"));
