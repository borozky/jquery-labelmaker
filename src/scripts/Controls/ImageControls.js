import $ from "jquery"
import RightSidebarControls from "./RightSidebarControls";
import {appCanvas} from "../AppCanvas";

class ImageControls extends RightSidebarControls {
    constructor() {
        super( $("#ImageControls"), {})

        this.$fileInput = this.$element.find("input[type='file']");
        this.$fileInput.on("input change", function() {
            console.log("ImageControls.constructor", $(this));
        });
    }


}

export let imageControls = new ImageControls();