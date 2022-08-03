import { Component } from "the-world-engine";

export class FontLoader extends Component {
    private _linkElement: HTMLLinkElement|null = null;
    private readonly _id = "font-loader";

    public awake(): void {
        if (document.getElementById(this._id)) return;

        this._linkElement = document.createElement("link");
        this._linkElement.rel = "stylesheet";
        this._linkElement.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
        this._linkElement.id = this._id;
        document.head.appendChild(this._linkElement);
    }

    public onDestroy(): void {
        if (this._linkElement) {
            document.head.removeChild(this._linkElement);
        }
    }
}
