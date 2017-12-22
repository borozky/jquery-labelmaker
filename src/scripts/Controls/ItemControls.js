import $ from "jquery"
import RightSidebarControls from "./RightSidebarControls";
import {appCanvas} from "../AppCanvas";

class ItemControls extends RightSidebarControls {

    constructor() {
        super( $("#ItemControls"), {})

        this.$removeButton = this.$element.find("button").eq(0);
        this.$removeButton.on("click", this.removeAllSelectedItems.bind(this));
    }

    removeAllSelectedItems() {
        appCanvas.removeAllSelectedItems();
    }


}

export let itemControls = new ItemControls();