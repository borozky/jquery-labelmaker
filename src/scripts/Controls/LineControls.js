import $ from "jquery"
import RightSidebarControls from "./RightSidebarControls";
import {appCanvas} from "../AppCanvas";

class LineControls extends RightSidebarControls {
    constructor() {
        super( $("#LineControls"), {
            borderWidth: 1,
            borderColor: "#000000"
        });
    }
}

export let lineControls = new LineControls();