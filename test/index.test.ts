import * as Index from "@src/index";

describe("index Test", () => {
    it("Bootstrapper export", () => expect(Index.Bootstrapper).toBeDefined());
    it("SceneBuilder export", () => expect(Index.SceneBuilder).toBeDefined());

    it("EventContainer export", () => expect(Index.EventContainer).toBeDefined());

    it("Coroutine export", () => expect(Index.Coroutine).toBeDefined());
    it("YieldInstruction export", () => expect(Index.YieldInstruction).toBeDefined());
    it("WaitForEndOfFrame export", () => expect(Index.WaitForEndOfFrame).toBeDefined());
    it("WaitForSeconds export", () => expect(Index.WaitForSeconds).toBeDefined());
    it("WaitUntil export", () => expect(Index.WaitUntil).toBeDefined());
    it("WaitWhile export", () => expect(Index.WaitWhile).toBeDefined());

    it("Component export", () => expect(Index.Component).toBeDefined());
    it("GameObject export", () => expect(Index.GameObject).toBeDefined());
    it("GameObjectBuilder export", () => expect(Index.GameObjectBuilder).toBeDefined());
    it("Prefab export", () => expect(Index.Prefab).toBeDefined());
    it("PrefabRef export", () => expect(Index.PrefabRef).toBeDefined());
    it("Scene export", () => expect(Index.Scene).toBeDefined());
    it("Transform export", () => expect(Index.Transform).toBeDefined());

    it("InputHandler export", () => expect(Index.InputHandler).toBeDefined());

    it("Collision2D export", () => expect(Index.Collision2D).toBeDefined());
    it("ContactFilter2D export", () => expect(Index.ContactFilter2D).toBeDefined());
    it("ContactPoint2D export", () => expect(Index.ContactPoint2D).toBeDefined());
    it("Physics2DLoader export", () => expect(Index.Physics2DLoader).toBeDefined());
    it("PhysicsMaterial2D export", () => expect(Index.PhysicsMaterial2D).toBeDefined());
    it("RaycastHit2D export", () => expect(Index.RaycastHit2D).toBeDefined());
    //it("CollisionLayerConst export", () => expect(Index.CollisionLayerConst.DefaultLayer).toBeDefined());
    it("CollisionLayerMaskConverter export", () => expect(Index.CollisionLayerMaskConverter).toBeDefined());

    it("CamearContainer export", () => expect(Index.CameraContainer).toBeDefined());
    it("Color export", () => expect(Index.Color).toBeDefined());

    it("Time export", () => expect(Index.Time).toBeDefined());

    it("EngineGlobalObject export", () => expect(Index.EngineGlobalObject).toBeDefined());
    it("Game export", () => expect(Index.Game).toBeDefined());
    it("GameSetting export", () => expect(Index.GameSetting).toBeDefined());
    it("GameStateKind export", () => expect(Index.GameStateKind).toBeDefined());
    it("Instantiater export", () => expect(Index.Instantiater).toBeDefined());

    it("GlobalConfig export", () => expect(Index.GlobalConfig).toBeDefined());

    it("Pathfinder export", () => expect(Index.Pathfinder).toBeDefined());
    it("PathfindTest export", () => expect(Index.PathfindTest).toBeDefined());

    it("EditorCameraController export", () => expect(Index.EditorCameraController).toBeDefined());
    it("PlayerGridMovementController export", () => expect(Index.PlayerGridMovementController).toBeDefined());
    it("TrackCameraController export", () => expect(Index.TrackCameraController).toBeDefined());

    it("GridEventMap export", () => expect(Index.GridEventMap).toBeDefined());
    it("PlayerGridEventInvoker export", () => expect(Index.PlayerGridEventInvoker).toBeDefined());

    it("AsyncImageLoader export", () => expect(Index.AsyncImageLoader).toBeDefined());
    it("Direction export", () => expect(Index.Direction).toBeDefined());
    it("Directable export", () => expect(Index.Directable).toBeDefined());

    it("GridPointer export", () => expect(Index.GridPointer).toBeDefined());
    it("PointerGridEvent export", () => expect(Index.PointerGridEvent).toBeDefined());
    it("PointerGridInputListener export", () => expect(Index.PointerGridInputListener).toBeDefined());

    it("RigidBody2D export", () => expect(Index.RigidBody2D).toBeDefined());
    it("RigidbodyType2D export", () => expect(Index.RigidbodyType2D).toBeDefined());
    it("CollisionDetectionMode2D export", () => expect(Index.CollisionDetectionMode2D).toBeDefined());
    it("RigidbodySleepMode2D export", () => expect(Index.RigidbodySleepMode2D).toBeDefined());
    it("ForceMode2D export", () => expect(Index.ForceMode2D).toBeDefined());
    it("Collider2D export", () => expect(Index.Collider2D).toBeDefined());
    it("BoxCollider2D export", () => expect(Index.BoxCollider2D).toBeDefined());
    it("CircleCollider2D export", () => expect(Index.CircleCollider2D).toBeDefined());
    it("EdgeCollider2D export", () => expect(Index.EdgeCollider2D).toBeDefined());
    it("PolygonCollider2D export", () => expect(Index.PolygonCollider2D).toBeDefined());

    it("CssCollideTilemapChunkRenderer export", () => expect(Index.CssCollideTilemapChunkRenderer).toBeDefined());
    it("CssCollideTilemapRenderer export", () => expect(Index.CssCollideTilemapRenderer).toBeDefined());
    it("GridCollideMap export", () => expect(Index.GridCollideMap).toBeDefined());
    it("GridCollider export", () => expect(Index.GridCollider).toBeDefined());
    it("GridObjectCollideMap export", () => expect(Index.GridObjectCollideMap).toBeDefined());

    it("CssTilemapChunkRenderer export", () => expect(Index.CssTilemapChunkRenderer).toBeDefined());
    it("EditorGridRenderer export", () => expect(Index.EditorGridRenderer).toBeDefined());
    it("ParallaxTranslater export", () => expect(Index.ParallaxTranslater).toBeDefined());
    it("SpriteAnimator export", () => expect(Index.SpriteAnimator).toBeDefined());
    it("SpriteAtlasAnimator export", () => expect(Index.SpriteAtlasAnimator).toBeDefined());
    it("SpriteAtlasInstance export", () => expect(Index.SpriteAtlasInstance).toBeDefined());
    it("SpriteAtlasStaticInstancer export", () => expect(Index.SpriteAtlasStaticInstancer).toBeDefined());
    it("SpriteInstance export", () => expect(Index.SpriteInstance).toBeDefined());
    it("SpriteStaticInstancer export", () => expect(Index.SpriteStaticInstancer).toBeDefined());

    it("CssDropShadow export", () => expect(Index.CssDropShadow).toBeDefined());
    it("CssFilter export", () => expect(Index.CssFilter).toBeDefined());
    it("CameraType export", () => expect(Index.CameraType).toBeDefined());
    it("Camera export", () => expect(Index.Camera).toBeDefined());
    it("CameraRelativeZaxisSorter export", () => expect(Index.CameraRelativeZaxisSorter).toBeDefined());
    it("CssLineRenderer export", () => expect(Index.CssLineRenderer).toBeDefined());
    it("CssEdgeRenderer2D export", () => expect(Index.CssEdgeRenderer).toBeDefined());
    it("CssPolygonRenderer2D export", () => expect(Index.CssPolygonRenderer2D).toBeDefined());
    it("CssHtmlElementRenderer export", () => expect(Index.CssHtmlElementRenderer).toBeDefined());
    it("CssIframeRenderer export", () => expect(Index.CssIframeRenderer).toBeDefined());
    it("CssRenderer export", () => expect(Index.CssRenderer).toBeDefined());
    it("CssSpriteAtlasRenderer export", () => expect(Index.CssSpriteAtlasRenderer).toBeDefined());
    it("CssSpriteRenderer export", () => expect(Index.CssSpriteRenderer).toBeDefined());
    it("TextAlign export", () => expect(Index.TextAlign).toBeDefined());
    it("FontWeight export", () => expect(Index.FontWeight).toBeDefined());
    it("CssTextRenderer export", () => expect(Index.CssTextRenderer).toBeDefined());
    it("TileAtlasItem export", () => expect(Index.TileAtlasItem).toBeDefined());
    it("CssTilemapRenderer export", () => expect(Index.CssTilemapRenderer).toBeDefined());
    it("ZaxisSortable export", () => expect(Index.ZaxisSortable).toBeDefined());
    it("ZaxisSorter export", () => expect(Index.ZaxisSorter).toBeDefined());
});
