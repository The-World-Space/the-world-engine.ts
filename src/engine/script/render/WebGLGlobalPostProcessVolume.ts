import { EffectComposer, Pass } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { WebGLRenderer } from "three/src/Three";

import { EngineGlobalObject } from "../../EngineGlobalObject";
import { Component } from "../../hierarchy_object/Component";
import { CameraContainer } from "../../render/CameraContainer";
import { IReadonlyGameScreen } from "../../render/IReadonlyGameScreen";
import { WebGLGlobalObject } from "../../render/WebGLGlobalObject";
import { Camera } from "./Camera";

class EffectComposerRc {
    private static readonly _map = new Map<EngineGlobalObject, EffectComposerRc>();

    private _referenceCount = 0;
    private readonly _effectComposer: EffectComposer;
    private readonly onScreenResize = (width: number, height: number): void => {
        this._effectComposer.setSize(width, height);
    };

    private constructor(engineGlobalObject: EngineGlobalObject, effectComposer: EffectComposer) {
        this._effectComposer = effectComposer;
        EffectComposerRc._map.set(engineGlobalObject, this);
    }

    public static createOraddReference(engineGlobalObject: EngineGlobalObject, webglRenderer: WebGLRenderer): EffectComposer {
        let effectComposerRc = EffectComposerRc._map.get(engineGlobalObject);
        if (effectComposerRc === undefined) {
            const effectComposer = new EffectComposer(webglRenderer);
            const screen = engineGlobalObject.screen;
            effectComposer.setSize(screen.width, screen.height);
            effectComposerRc = new EffectComposerRc(engineGlobalObject, effectComposer);
            screen.onResize.addListener(effectComposerRc.onScreenResize);
            EffectComposerRc._map.set(engineGlobalObject, effectComposerRc);
        }
        effectComposerRc._referenceCount += 1;
        return effectComposerRc._effectComposer;
    }

    public static removeReference(engineGlobalObject: EngineGlobalObject): void {
        const effectComposerRc = EffectComposerRc._map.get(engineGlobalObject);
        if (effectComposerRc !== undefined) {
            effectComposerRc._referenceCount -= 1;
            if (effectComposerRc._referenceCount === 0) {
                const screen = engineGlobalObject.screen;
                screen.onResize.removeListener(effectComposerRc.onScreenResize);
                EffectComposerRc._map.delete(engineGlobalObject);
            }
        }
    }
}

export class WebGLGlobalPostProcessVolume extends Component {
    private _renderPass: RenderPass|null = null;
    private _effectComposer: EffectComposer|null = null;
    private _willAddRenderPass = true;
    private _reInitializeWhenCameraChanged = true;
    private _reinitializeWhenScreenSizeChanged = true;

    private _passes: readonly Pass[] = [];

    private _initializer: ((scene: THREE.Scene, camera: THREE.Camera, screen: IReadonlyGameScreen) => readonly[readonly Pass[], (() => void)?])|null = null;
    private _disposer: (() => void)|null = null;

    private readonly onCameraChanged = (camera: Camera): void => {
        if (this._renderPass !== null) {
            this._renderPass.camera = camera.threeCamera!;
        }
        if (this._reInitializeWhenCameraChanged && this._initializer && this._effectComposer) {
            const threeScene = this.engine.scene.unsafeGetThreeScene();
            const [passes, disposer] = this._initializer(threeScene, camera.threeCamera!, this.engine.screen);
            this.initializeEffectComposer(this._effectComposer, this._passes, passes, this._disposer ?? undefined);
            this._passes = passes;
            this._disposer = disposer ?? null;
        }
    };

    private readonly onScreenResize = (): void => {
        if (this._reinitializeWhenScreenSizeChanged && this._initializer && this._effectComposer) {
            const threeScene = this.engine.scene.unsafeGetThreeScene();
            const camera = this.engine.cameraContainer.camera!;
            const [passes, disposer] = this._initializer(threeScene, camera.threeCamera!, this.engine.screen);
            this.initializeEffectComposer(this._effectComposer, this._passes, passes, this._disposer ?? undefined);
            this._passes = passes;
            this._disposer = disposer ?? null;
        }
    };

    public onEnable(): void {
        const threeScene = this.engine.scene.unsafeGetThreeScene();
        const cameraContainer = this.engine.cameraContainer as CameraContainer;
        const camera = cameraContainer.camera;
        const webglGlobalObject = this.engine.webGL;

        if (camera === null) {
            throw new Error("WebGLGlobalPostProcessVolume must be loaded after camera.");
        }

        if (webglGlobalObject === null) {
            throw new Error("WebGLRenderer is not initialized.");
        }

        if (webglGlobalObject.webglRenderer === null) {
            throw new Error("You can't use WebGLRenderer wrapper for post processing.");
        }

        const effectComposer = this._effectComposer = EffectComposerRc.createOraddReference(this.engine, webglGlobalObject.webglRenderer);
        cameraContainer.onCameraChanged.addListener(this.onCameraChanged);
        this.engine.screen.onResize.addListener(this.onScreenResize);
        if (this._willAddRenderPass) {
            const renderPass = this._renderPass = new RenderPass(threeScene, camera.threeCamera!);
            effectComposer.addPass(renderPass);
        }

        if (this._initializer) {
            const [passes, disposer] = this._initializer(threeScene, camera.threeCamera!, this.engine.screen);
            this.initializeEffectComposer(effectComposer, this._passes, passes, this._disposer ?? undefined);
            this._passes = passes;
            this._disposer = disposer ?? null;
        }

        (this.engine.webGL as WebGLGlobalObject).effectComposer = effectComposer;
    }

    public onDisable(): void {
        const effectComposer = this._effectComposer;
        if (this._renderPass !== null) {
            effectComposer?.removePass(this._renderPass);
            this._renderPass = null;
        }
        const passes = this._passes;
        if (effectComposer !== null) {
            this.removeAndDisposePasses(effectComposer, passes, this._disposer ?? undefined);
            this._passes = [];
            this._disposer = null;
            EffectComposerRc.removeReference(this.engine);
            this._effectComposer = null;
        }

        const cameraContainer = this.engine.cameraContainer as CameraContainer;
        cameraContainer.onCameraChanged.removeListener(this.onCameraChanged);
        this.engine.screen.onResize.removeListener(this.onScreenResize);
    }

    private removeAndDisposePasses(effectComposer: EffectComposer, passes: readonly Pass[], disposer?: () => void): void {
        const startIndex = effectComposer.passes.indexOf(passes[0]);
        if (startIndex !== -1) {
            for (let i = 0; i < passes.length; i++) {
                effectComposer.removePass(passes[i]);
            }
        }
        disposer?.();
    }

    private initializeEffectComposer(effectComposer: EffectComposer, oldPasses: readonly Pass[], newPasses: readonly Pass[], oldPassesDisposer?: () => void): void {
        let startIndex = -1;
        if (0 < oldPasses.length) {
            startIndex = effectComposer.passes.indexOf(oldPasses[0]);
            if (startIndex !== -1) {
                for (let i = 0; i < oldPasses.length; i++) {
                    effectComposer.removePass(oldPasses[i]);
                }
            }
            oldPassesDisposer?.();
        }

        if (startIndex === -1) {
            for (let i = 0; i < newPasses.length; i++) {
                effectComposer.addPass(newPasses[i]);
            }
        } else {
            for (let i = 0; i < newPasses.length; i++) {
                effectComposer.insertPass(newPasses[i], startIndex + i);
            }
        }
    }

    /**
     * set initializer for effect composer. this callback will be called multiple times when switching camera. or when screen size is changed.
     * 
     * i recommend you make this callback as pure function.
     * @param initializer its return value is tuple of passes and disposer. you must dispose passes in disposer.
     */
    public initializer(
        initializer: (scene: THREE.Scene, camera: THREE.Camera, screen: IReadonlyGameScreen) => readonly[readonly Pass[], (() => void)?]
    ): void {
        if (this._effectComposer) {
            this.removeAndDisposePasses(this._effectComposer, this._passes, this._disposer ?? undefined);
            this._passes = [];
        }

        this._initializer = initializer;
        
        if (this._effectComposer) {
            const threeScene = this.engine.scene.unsafeGetThreeScene();
            const camera = this.engine.cameraContainer.camera!;
            const [passes, disposer] = this._initializer(threeScene, camera.threeCamera!, this.engine.screen);
            this.initializeEffectComposer(this._effectComposer, this._passes, passes, this._disposer ?? undefined);
            this._passes = passes;
            this._disposer = disposer ?? null;
        }
    }

    /**
     * if true, render pass will be added to effect composer.
     * this value is only available before onEnable method is called.
     */
    public get willAddRenderPass(): boolean {
        return this._willAddRenderPass;
    }

    /**
     * if true, render pass will be added to effect composer.
     * this value is only available before onEnable method is called.
     */
    public set willAddRenderPass(value: boolean) {
        this._willAddRenderPass = value;
    }

    /**
     * if true, effect composer will be reinitialized when current camera is changed.
     */
    public get reInitializeWhenCameraChanged(): boolean {
        return this._reInitializeWhenCameraChanged;
    }

    /**
     * if true, effect composer will be reinitialized when current camera is changed.
     */
    public set reInitializeWhenCameraChanged(value: boolean) {
        this._reInitializeWhenCameraChanged = value;
    }

    /**
     * if true, effect composer will be reinitialized when screen size is changed.
     */
    public get reinitializeWhenScreenSizeChanged(): boolean {
        return this._reinitializeWhenScreenSizeChanged;
    }

    /**
     * if true, effect composer will be reinitialized when screen size is changed.
     */
    public set reinitializeWhenScreenSizeChanged(value: boolean) {
        this._reinitializeWhenScreenSizeChanged = value;
    }
}
