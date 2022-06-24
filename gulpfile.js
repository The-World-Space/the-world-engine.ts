const gulp = require("gulp");
const ts = require("gulp-typescript");
const terser = require("gulp-terser");
const filter = require("gulp-filter");
const merge = require("merge2");
const alias = require("@gulp-plugin/alias");
//const propertiesRenameTransformer = require("ts-transformer-properties-rename").default;
const minifyPrivatesTransformer = require("ts-transformer-minify-privates").default;

const tsProject = ts.createProject("tsconfig.json");

tsProject.config.include = [
    "src"
];

const tsSettings = {
    stripInternal: true,
    allowJs: true,
    lib: [
        "dom",
        "dom.iterable",
        "esnext"
    ],
    target: "ES6",
    declaration: true,
    module: "esnext",
    moduleResolution: "node"
};

gulp.task("tsBuild", () => {
    const tsResult = tsProject.src()
        .pipe(alias(tsProject.config))
        .pipe(ts(tsSettings));

    return merge([
        tsResult.dts.pipe(gulp.dest("dist")),
        tsResult.js.pipe(gulp.dest("dist"))
    ]);
});

gulp.task("tsMangleBuild", () => {
    const tsMangleResult = tsProject.src()
        .pipe(alias(tsProject.config))
        .pipe(ts({
            ...tsSettings,
            getCustomTransformers: program => ({
                before: [
                    minifyPrivatesTransformer(program),
                    //propertiesRenameTransformer(program, { entrySourceFiles: ["./src/index.ts"] })
                ]
            })
        }));

    return tsMangleResult.js
        .pipe(terser({
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
        }))
        .pipe(filter([
            "**",
            "!**/engine/hierarchy_object/Component.js",
            "!**/engine/hierarchy_object/Prefab.js"
        ]))
        .pipe(gulp.dest("dist", { overwrite: true }));
});

gulp.task("default", gulp.series("tsBuild", "tsMangleBuild"));
