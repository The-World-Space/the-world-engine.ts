/* eslint-disable @typescript-eslint/naming-convention */
import alias from "@gulp-plugin/alias";
import rollupAlias from "@rollup/plugin-alias";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import type { TaskFunction } from "gulp";
import gulp from "gulp";
import cleanDest from "gulp-clean-dest";
import filter from "gulp-filter";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import terser from "gulp-terser";
import ts from "gulp-typescript";
import rollupTypescript from "rollup-plugin-typescript2";
import minifyPrivatesTransformer from "ts-transformer-minify-privates";

/* eslint-disable @typescript-eslint/no-var-requires */
const gru2 = require("gulp-rollup-2");
const externalGlobals = require("rollup-plugin-external-globals");
//const propertiesRenameTransformer = require("ts-transformer-properties-rename").default;
/* eslint-enable @typescript-eslint/no-var-requires */

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

gulp.task("esm", ((): TaskFunction => {
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

gulp.task("umd", ((): TaskFunction => {
    const dest = "dist/umd";

    function clean(): NodeJS.ReadWriteStream {
        return gulp.src(`${dest}/**/*`, { read: false, allowEmpty: true })
            .pipe(cleanDest(dest));
    }

    async function build(): Promise<NodeJS.ReadWriteStream> {
        return (await gru2.src([
            {
                input: "src/index.ts",
                output: {
                    file: "twengine.js",
                    format: "umd",
                    name: "TWE",
                    globals: {
                        "three/src/Three": "THREE",
                        "three/src/math/MathUtils": "THREE.MathUtils",
                        "three/examples/jsm/postprocessing/EffectComposer": "EffectComposer",
                        "three/examples/jsm/postprocessing/RenderPass": "RenderPass",
                        "b2d": "B2D"
                    },
                    intro: `
                    (function () {
                        function e() { }

                        const b2dMock = {
                            AABB: e,
                            Abs: e,
                            Acos: e,
                            Alloc: e,
                            AngularStiffness: e,
                            AreaJoint: e,
                            AreaJointDef: e,
                            Asin: e,
                            Assert: e,
                            Atan2: e,
                            BlockAllocator: e,
                            Body: e,
                            BodyDef: e,
                            BroadPhase: e,
                            BuoyancyController: e,
                            CalculateParticleIterations: e,
                            ChainAndCircleContact: e,
                            ChainAndPolygonContact: e,
                            ChainShape: e,
                            CircleContact: e,
                            CircleShape: e,
                            Clamp: e,
                            ClipSegmentToLine: e,
                            ClipVertex: e,
                            CollideCircles: e,
                            CollideEdgeAndCircle: e,
                            CollideEdgeAndPolygon: e,
                            CollidePolygonAndCircle: e,
                            CollidePolygons: e,
                            Color: e,
                            ConstantAccelController: e,
                            ConstantForceController: e,
                            Contact: e,
                            ContactEdge: e,
                            ContactFactory: e,
                            ContactFeature: e,
                            ContactFilter: e,
                            ContactID: e,
                            ContactImpulse: e,
                            ContactListener: e,
                            ContactManager: e,
                            ContactPositionConstraint: e,
                            ContactRegister: e,
                            ContactSolver: e,
                            ContactSolverDef: e,
                            ContactVelocityConstraint: e,
                            Controller: e,
                            ControllerEdge: e,
                            Cos: e,
                            Counter: e,
                            DegToRad: e,
                            DestructionListener: e,
                            Distance: e,
                            DistanceInput: e,
                            DistanceJoint: e,
                            DistanceJointDef: e,
                            DistanceOutput: e,
                            DistanceProxy: e,
                            Draw: e,
                            DynamicTree: e,
                            EdgeAndCircleContact: e,
                            EdgeAndPolygonContact: e,
                            EdgeShape: e,
                            Filter: e,
                            Fixture: e,
                            FixtureDef: e,
                            FixtureParticleQueryCallback: e,
                            FixtureProxy: e,
                            Free: e,
                            FrictionJoint: e,
                            FrictionJointDef: e,
                            GearJoint: e,
                            GearJointDef: e,
                            GetPointStates: e,
                            GravityController: e,
                            GrowableBuffer: e,
                            GrowableStack: e,
                            InvSqrt: e,
                            IsPowerOfTwo: e,
                            IsValid: e,
                            Island: e,
                            Jacobian: e,
                            Joint: e,
                            JointDef: e,
                            JointEdge: e,
                            LinearStiffness: e,
                            Log: e,
                            MakeArray: e,
                            MakeNullArray: e,
                            MakeNumberArray: e,
                            Manifold: e,
                            ManifoldPoint: e,
                            MassData: e,
                            Mat22: e,
                            Mat33: e,
                            Max: e,
                            Maybe: e,
                            Min: e,
                            MixFriction: e,
                            MixRestitution: e,
                            MixRestitutionThreshold: e,
                            MotorJoint: e,
                            MotorJointDef: e,
                            MouseJoint: e,
                            MouseJointDef: e,
                            NextPowerOfTwo: e,
                            Pair: e,
                            ParseInt: e,
                            ParseUInt: e,
                            ParticleBodyContact: e,
                            ParticleContact: e,
                            ParticleDef: e,
                            ParticleGroup: e,
                            ParticleGroupDef: e,
                            ParticleHandle: e,
                            ParticlePair: e,
                            ParticlePairSet: e,
                            ParticleSystem: e,
                            ParticleSystemDef: e,
                            ParticleSystem_CompositeShape: e,
                            ParticleSystem_ConnectionFilter: e,
                            ParticleSystem_DestroyParticlesInShapeCallback: e,
                            ParticleSystem_FixedSetAllocator: e,
                            ParticleSystem_FixtureParticle: e,
                            ParticleSystem_FixtureParticleSet: e,
                            ParticleSystem_InsideBoundsEnumerator: e,
                            ParticleSystem_JoinParticleGroupsFilter: e,
                            ParticleSystem_ParticleListNode: e,
                            ParticleSystem_ParticlePair: e,
                            ParticleSystem_Proxy: e,
                            ParticleSystem_ReactiveFilter: e,
                            ParticleSystem_SolveCollisionCallback: e,
                            ParticleSystem_UpdateBodyContactsCallback: e,
                            ParticleSystem_UserOverridableBuffer: e,
                            ParticleTriad: e,
                            PolygonAndCircleContact: e,
                            PolygonContact: e,
                            PolygonShape: e,
                            Position: e,
                            PositionSolverManifold: e,
                            Pow: e,
                            PrismaticJoint: e,
                            PrismaticJointDef: e,
                            Profile: e,
                            PulleyJoint: e,
                            PulleyJointDef: e,
                            QueryCallback: e,
                            RadToDeg: e,
                            Random: e,
                            RandomRange: e,
                            RayCastCallback: e,
                            RayCastInput: e,
                            RayCastOutput: e,
                            RevoluteJoint: e,
                            RevoluteJointDef: e,
                            Rope: e,
                            RopeDef: e,
                            RopeTuning: e,
                            Rot: e,
                            SeparationFunction: e,
                            Shape: e,
                            ShapeCast: e,
                            ShapeCastInput: e,
                            ShapeCastOutput: e,
                            Simplex: e,
                            SimplexCache: e,
                            SimplexVertex: e,
                            Sin: e,
                            SolverData: e,
                            Sq: e,
                            Sqrt: e,
                            StackAllocator: e,
                            StackQueue: e,
                            Swap: e,
                            Sweep: e,
                            TOIInput: e,
                            TOIOutput: e,
                            TensorDampingController: e,
                            TestOverlapAABB: e,
                            TestOverlapShape: e,
                            TimeOfImpact: e,
                            TimeStep: e,
                            Timer: e,
                            Transform: e,
                            TreeNode: e,
                            Vec2: e,
                            Vec2_zero: e,
                            Vec3: e,
                            Velocity: e,
                            VelocityConstraintPoint: e,
                            Version: e,
                            VoronoiDiagram: e,
                            VoronoiDiagram_Generator: e,
                            VoronoiDiagram_Task: e,
                            WeldJoint: e,
                            WeldJointDef: e,
                            WheelJoint: e,
                            WheelJointDef: e,
                            World: e,
                            WorldManifold: e,
                            _180_over_pi: e,
                            _pi_over_180: e,
                            aabbExtension: e,
                            aabbMultiplier: e,
                            angularSleepTolerance: e,
                            angularSlop: e,
                            barrierCollisionTime: e,
                            baumgarte: e,
                            branch: e,
                            commit: e,
                            dynamicBody: e,
                            epsilon: e,
                            epsilon_sq: e,
                            get_g_blockSolve: e,
                            gjk_reset: e,
                            invalidParticleIndex: e,
                            kinematicBody: e,
                            lengthUnitsPerMeter: e,
                            linearSleepTolerance: e,
                            linearSlop: e,
                            maxAngularCorrection: e,
                            maxFloat: e,
                            maxLinearCorrection: e,
                            maxManifoldPoints: e,
                            maxParticleForce: e,
                            maxParticleIndex: e,
                            maxParticlePressure: e,
                            maxPolygonVertices: e,
                            maxRotation: e,
                            maxRotationSquared: e,
                            maxSubSteps: e,
                            maxTOIContacts: e,
                            maxTranslation: e,
                            maxTranslationSquared: e,
                            maxTriadDistance: e,
                            maxTriadDistanceSquared: e,
                            minParticleSystemBufferCapacity: e,
                            minParticleWeight: e,
                            minPulleyLength: e,
                            particleStride: e,
                            pbdAngleBendingModel: e,
                            pbdDistanceBendingModel: e,
                            pbdHeightBendingModel: e,
                            pbdStretchingModel: e,
                            pbdTriangleBendingModel: e,
                            pi: e,
                            polygonRadius: e,
                            set_g_blockSolve: e,
                            springAngleBendingModel: e,
                            staticBody: e,
                            timeToSleep: e,
                            toiBaumgarte: e,
                            toi_reset: e,
                            two_pi: e,
                            version: e,
                            xpbdAngleBendingModel: e,
                            xpbdStretchingModel: e,
                        };
                        
                        if (b2d === undefined) {
                            b2d = b2dMock;
                        }
                    })();
                    `
                },
                context: "this",
                plugins: [
                    nodeResolve({
                        extensions: [".js", ".ts"],
                        resolveOnly: ["js-sdsl"]
                    }),
                    rollupTypescript({
                        typescript: require("ttypescript"),
                        tsconfigOverride: {
                            compilerOptions: {
                                target: "ES6",
                                module: "esnext",
                                declaration: true
                            },
                            include: ["src"]
                        }
                    }),
                    rollupAlias({
                        entries: [
                            { find: /.+box2d.ts\/build\/index$/, replacement: "b2d" }
                        ]
                    }),
                    externalGlobals({
                        "b2d": "B2D"
                    })
                ]
            },
            {
                input: "src/box2d.ts/build/index.js",
                output: {
                    file: "box2d.js",
                    format: "umd",
                    name: "B2D"
                },
                context: "this"
            }
        ]))
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
