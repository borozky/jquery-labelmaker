import $ from "jquery"
import RightSidebarControls from "./RightSidebarControls";
import {appCanvas} from "../AppCanvas";

class ShapeControls extends RightSidebarControls {
    constructor() {
        super( $("#ShapeControls"), {
            width: 80,
            height: 80,
            backgroundColor: "#000000",
            borderWidth: 2,
            borderColor: "#000000"
        })
    }
}

export let shapeControls = new ShapeControls();