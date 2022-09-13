/* eslint-disable @typescript-eslint/naming-convention */
import alias from "@gulp-plugin/alias";
import gulp from "gulp";
import filter from "gulp-filter";
import terser from "gulp-terser";
import ts from "gulp-typescript";
//const propertiesRenameTransformer = require("ts-transformer-properties-rename").default;
import minifyPrivatesTransformer from "ts-transformer-minify-privates";

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

gulp.task("tsBuild", () => {
    return gulp.src(["src/**/*.ts"])
        .pipe(alias({ config: tsProject.config.compilerOptions }))
        .pipe(tsProject())
        .pipe(gulp.dest("dist"));
});

gulp.task("tsMangleBuild", () => {
    return gulp.src(["src/**/*.ts"])
        .pipe(alias({ config: tsProject.config.compilerOptions }))
        .pipe(tsProject()).js
        .pipe(terser({
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
            nameCache: { }
        }))
        .pipe(filter([
            "**",
            "!**/engine/hierarchy_object/Component.js",
            "!**/engine/hierarchy_object/Prefab.js"
        ]))
        .pipe(gulp.dest("dist", { overwrite: true }));
});

gulp.task("default", gulp.series("tsBuild", "tsMangleBuild"));
