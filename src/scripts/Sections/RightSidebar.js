import $ from "jquery";
import {fontControls} from "../Controls/FontControls";
import {itemControls } from "../Controls/ItemControls";
import {imageControls} from "../Controls/ImageControls";
import {shapeControls } from "../Controls/ShapeControls";
import {barcodeControls} from "../Controls/BarcodeControls";
import { lineControls } from "../Controls/LineControls";

export default class RightSidebar {
    constructor($element, options) {
        this.$element = $element;

        this.hideAllControls();
    }

    hideAllControls() {
        fontControls.unsetItem();
        shapeControls.unsetItem();
        imageControls.unsetItem();
        barcodeControls.unsetItem();
        itemControls.unsetItem();
        lineControls.unsetItem();
    }

    displayControlsFor(item) {
        switch(item.options.type) {
            case "TEXT":
            case "TEXTBOX":
            case "DATE":
                fontControls.setItem(item);
                break;
            case "RECTANGLE":
            case "ELLIPSE":
                shapeControls.setItem(item);
                break;
            case "IMAGE":
                imageControls.setItem(item);
                break;
            case "BARCODE":
                barcodeControls.setItem(item);
                break;
            case "LINE":
                lineControls.setItem(item);
                break;
            default:
                return;
        }

        itemControls.setItem(item);
    }

    handleMultipleItemsSelected(items) {
        this.hideAllControls();
        itemControls.$element.show();
    }
}

export let rightSidebar = new RightSidebar($("#RightSidebar"), {

});