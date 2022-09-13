"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[207],{4653:(t,e,s)=>{s.r(e),s.d(e,{assets:()=>p,contentTitle:()=>u,default:()=>b,frontMatter:()=>c,metadata:()=>m,toc:()=>w});var i=s(7462),h=(s(7294),s(3905)),n=s(5853),r=s(708),o=s(6896),l=s(1269),d=s(6885);class a extends r.A{run(){const t=this.instantiater;return this.sceneBuilder.withChild(t.buildGameObject("camera").withComponent(o.V,(t=>{t.viewSize=4})).withComponent(l.Y,(t=>{t.mouseMoveButton=0,t.maxViewSize=4})).withComponent(d.y,(t=>{t.renderWidth=50,t.renderHeight=50})))}}const c={},u="Editor Setup",m={unversionedId:"tutorial-2dtopdown/editor-setup",id:"tutorial-2dtopdown/editor-setup",title:"Editor Setup",description:"for debug purposes we will add some components to game",source:"@site/docs/2-tutorial-2dtopdown/2-editor-setup.mdx",sourceDirName:"2-tutorial-2dtopdown",slug:"/tutorial-2dtopdown/editor-setup",permalink:"/the-world-engine.ts/build/docs/tutorial-2dtopdown/editor-setup",draft:!1,editUrl:"https://github.com/The-World-Space/the-world-engine.ts/tree/main/docs/docusaurus/docs/2-tutorial-2dtopdown/2-editor-setup.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Create Project",permalink:"/the-world-engine.ts/build/docs/tutorial-2dtopdown/create-project"},next:{title:"Sprite Atlas Setup",permalink:"/the-world-engine.ts/build/docs/tutorial-2dtopdown/sprite-atlas-setup"}},p={},w=[],g={toc:w};function b(t){let{components:e,...s}=t;return(0,h.kt)("wrapper",(0,i.Z)({},g,s,{components:e,mdxType:"MDXLayout"}),(0,h.kt)("h1",{id:"editor-setup"},"Editor Setup"),(0,h.kt)("p",null,"for debug purposes we will add some components to game"),(0,h.kt)("pre",null,(0,h.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/Bootstrapper.ts"',title:'"src/Bootstrapper.ts"'},'.withChild(instantiater.buildGameObject("camera")\n    .withComponent(Camera)\n    .withComponent(EditorCameraController, c => {\n        c.mouseMoveButton = 0;\n    })\n    .withComponent(EditorGridRenderer, c => {\n        c.renderWidth = 50;\n        c.renderHeight = 50;\n    }))\n')),(0,h.kt)(n.Z,{bootstrapper:a,mdxType:"DocumentGame"}),(0,h.kt)("p",null,"These two components will be very helpful in creating grid-based 2D games."))}b.isMDXComponent=!0},7888:(t,e,s)=>{s.d(e,{s:()=>i});class i{constructor(t=null){this.ref=t}}},1269:(t,e,s)=>{s.d(e,{Y:()=>o});var i=s(6120),h=s(4532),n=s(3674),r=s(6896);class o extends n.w{constructor(){super(...arguments),this.disallowMultipleComponent=!0,this.requiredComponents=[r.V],this.mh=null,this.Vh=!1,this.wh=1,this.zh=new i.F,this.xh=1,this.Sh=10,this.bh=5,this._h=5,this.Bh=new h.P,this.Eh=t=>{" "===t.key&&(this._h=this.bh,this.Mh(),this.transform.localPosition.copy(this.Bh))},this.jh=t=>{this._h+=.01*t.deltaY,this._h<this.xh?this._h=this.xh:this._h>this.Sh&&(this._h=this.Sh),this.Mh()},this.Cr=t=>{this.zh.set(t.clientX/this.engine.screen.width,t.clientY/this.engine.screen.height),t.button===this.wh&&(this.Vh=!0)},this.kh=t=>{t.button===this.wh&&(this.Vh=!1)},this.yh=t=>{if(!this.Vh)return;const e=t.clientX/this.engine.screen.width,s=t.clientY/this.engine.screen.height,i=e-this.zh.x,h=s-this.zh.y,n=this.engine.screen.width/this.engine.screen.height;this.transform.localPosition.x-=i*this.mh.viewSize*2*n,this.transform.localPosition.y+=h*this.mh.viewSize*2,this.zh.set(e,s)},this.Dh=t=>{this.Vh=!1}}awake(){this.mh=this.gameObject.getComponent(r.V),this.bh=this.mh.viewSize,this.Bh.copy(this.transform.localPosition),this._h=this.bh,this.mh.viewSize=this._h}onEnable(){const t=this.engine.input;t.onKeyDown.addListener(this.Eh),t.onWheel.addListener(this.jh),t.onPointerDown.addListener(this.Cr),t.onPointerUp.addListener(this.kh),t.onPointerMove.addListener(this.yh),t.onPointerLeave.addListener(this.Dh)}onDisable(){const t=this.engine.input;t.onKeyDown.removeListener(this.Eh),t.onWheel.removeListener(this.jh),t.onPointerDown.removeListener(this.Cr),t.onPointerUp.removeListener(this.kh),t.onPointerMove.removeListener(this.yh),t.onPointerLeave.removeListener(this.Dh)}Mh(){this.mh&&(this.mh.viewSize=this._h)}get minViewSize(){return this.xh}set minViewSize(t){this.xh=t,this._h<this.xh&&(this._h=this.xh,this.Mh())}get maxViewSize(){return this.Sh}set maxViewSize(t){this.Sh=t,this._h>this.Sh&&(this._h=this.Sh,this.Mh())}get mouseMoveButton(){return this.wh}set mouseMoveButton(t){this.wh=t}}},6885:(t,e,s)=>{s.d(e,{y:()=>l});var i=s(4532),h=s(3674),n=s(7888),r=s(6896),o=s(1466);class l extends h.w{constructor(){super(...arguments),this.disallowMultipleComponent=!0,this.requiredComponents=[r.V],this.hd=null,this.rd=null,this.Ih=1,this.Th=1,this.nd=18,this.od=10,this.dd=.2,this.ad=0,this.ld=new i.P(NaN,NaN,NaN)}awake(){const t=new n.s;this.rd=this.engine.scene.addChildFromBuilder(this.engine.instantiater.buildGameObject("grid-renderer",void 0,void 0,new i.P(this.dd,this.dd,this.dd)).active(!1).withComponent(o.w,(t=>{const e=document.createElement("div");e.style.backgroundImage="                        repeating-linear-gradient(#999 0 1px, transparent 1px 100%),                        repeating-linear-gradient(90deg, #999 0 1px, transparent 1px 100%)",e.style.backgroundSize=this.Ih/this.dd/.1+"px "+this.Th/this.dd/.1+"px",t.elementWidth=this.nd/this.dd,t.elementHeight=this.od/this.dd,t.pointerEvents=!1,t.element=e,t.viewScale=.1})).getComponent(o.w,t)),this.hd=t.ref}onEnable(){this.rd.exists&&(this.rd.activeSelf=!0)}onDisable(){this.rd.exists&&(this.rd.activeSelf=!1)}update(){const t=this.transform.position,e=1/this.dd/.1,s=this.nd*e/2,i=this.od*e/2,h=this.Ih*e,n=this.Th*e,r=s%h,o=i%n;if(!t.equals(this.ld)){const s=this.rd.transform.position;s.copy(t),s.z+=this.ad,this.hd.element.style.backgroundPosition=-t.x*e+r+h/2-.5+"px "+(t.y*e+o+n/2-.5)+"px"}}onDestroy(){var t;null===(t=this.rd)||void 0===t||t.destroy()}fd(){const t=this.hd;t&&(t.element.style.backgroundSize=this.Ih/this.dd/.1+"px "+this.Th/this.dd/.1+"px")}get gridCellWidth(){return this.Ih}set gridCellWidth(t){this.Ih=t,this.fd()}get gridCellHeight(){return this.Th}set gridCellHeight(t){this.Th=t,this.fd()}get renderWidth(){return this.nd}set renderWidth(t){this.nd=t,this.hd&&(this.hd.elementWidth=this.nd/this.dd)}get renderHeight(){return this.od}set renderHeight(t){this.od=t,this.hd&&(this.hd.elementHeight=this.od/this.dd)}get lineWidth(){return.1*this.dd}set lineWidth(t){this.dd=t/.1;const e=this.hd;e&&(this.fd(),e.elementWidth=this.nd/this.dd,e.elementHeight=this.od/this.dd,e.gameObject.transform.localScale.setScalar(this.dd))}get zOffset(){return this.ad}set zOffset(t){this.ad=t}}},1466:(t,e,s)=>{s.d(e,{w:()=>n});var i=s(4627),h=s(6924);class n extends h.Y{constructor(){super(...arguments),this.tu=1,this.su=1,this.iu=!1,this.Ca=null}renderInitialize(){var t;null===(t=this.Ca)||void 0===t||t.call(this),this.htmlElement||(this.element=null)}updateCenterOffset(t){if(!this.css3DObject)return;let e,s;if(this.iu)if(this.css3DObject.element.parentElement){const t=this.css3DObject.element.style.display;this.css3DObject.element.style.display="",e=this.css3DObject.element.offsetWidth*this.viewScale,s=this.css3DObject.element.offsetHeight*this.viewScale,this.css3DObject.element.style.display=t}else{const t=this.css3DObject.element.style.display;this.css3DObject.element.style.display="";const i=this.css3DObject.element.style.transform;this.css3DObject.element.style.transform="translateX(1000000px)",document.body.appendChild(this.css3DObject.element),e=this.css3DObject.element.offsetWidth*this.viewScale,s=this.css3DObject.element.offsetHeight*this.viewScale,this.css3DObject.element.style.display=t,this.css3DObject.element.style.transform=i,document.body.removeChild(this.css3DObject.element)}else e=this.tu,s=this.su;this.css3DObject.position.set(e*this.centerOffset.x,s*this.centerOffset.y,0),t&&(i.w.updateRawObject3DWorldMatrixRecursively(this.css3DObject),this.transform.enqueueRenderAttachedObject3D(this.css3DObject))}updateViewScale(t){if(!this.css3DObject)return;const e=this.viewScale;this.iu?(this.css3DObject.scale.set(e,e,e),this.updateCenterOffset(!1)):(this.css3DObject.element.style.width=this.tu/this.viewScale+"px",this.css3DObject.element.style.height=this.su/this.viewScale+"px",this.css3DObject.scale.set(e,e,e)),t&&(i.w.updateRawObject3DWorldMatrixRecursively(this.css3DObject),this.transform.enqueueRenderAttachedObject3D(this.css3DObject))}get element(){return this.htmlElement}set element(t){const e=this.htmlElement=null!=t?t:document.createElement("div");this.readyToDraw?this.hu(e):this.Ca=()=>this.hu(e)}hu(t){this.iu?(t.style.width="auto",t.style.height="auto"):(t.style.width=this.tu/this.viewScale+"px",t.style.height=this.su/this.viewScale+"px");const e=this.initializeBaseComponents(!0);i.w.updateRawObject3DWorldMatrixRecursively(e),this.transform.enqueueRenderAttachedObject3D(e)}get elementWidth(){if(this.iu){if(this.htmlElement){const t=this.htmlElement.style.display;this.htmlElement.style.display="";const e=this.htmlElement.offsetWidth*this.viewScale;return this.htmlElement.style.display=t,e}return 0}return this.tu}set elementWidth(t){this.iu||(this.tu=t,this.htmlElement&&(this.htmlElement.style.width=t/this.viewScale+"px"),this.updateCenterOffset(!0))}get elementHeight(){if(this.iu){if(this.htmlElement){const t=this.htmlElement.style.display;this.htmlElement.style.display="";const e=this.htmlElement.offsetHeight*this.viewScale;return this.htmlElement.style.display=t,e}return 0}return this.su}set elementHeight(t){this.iu||(this.su=t,this.htmlElement&&(this.htmlElement.style.height=t/this.viewScale+"px"),this.updateCenterOffset(!0))}get autoSize(){return this.iu}set autoSize(t){this.iu=t,this.htmlElement&&(t?(this.htmlElement.style.width="auto",this.htmlElement.style.height="auto"):(this.htmlElement.style.width=this.tu/this.viewScale+"px",this.htmlElement.style.height=this.su/this.viewScale+"px"))}}}}]);