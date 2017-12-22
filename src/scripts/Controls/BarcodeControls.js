import $ from "jquery"
import RightSidebarControls from "./RightSidebarControls";
import {appCanvas} from "../AppCanvas";

class BarcodeControls extends RightSidebarControls {
    constructor() {
        super( $("#BarcodeControls"), {
            value: "00000000000",
            lineWidth: 2,
            lineHeight: 100
        })
    }
}

export let barcodeControls = new BarcodeControls();