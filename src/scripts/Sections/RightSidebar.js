import $ from "jquery";
import store from "../store";

import {valueControl} from "../Controls/ValueControl";
import {dateControl} from "../Controls/DateControl"
import {fontControl} from "../Controls/FontControl"
import {fontStyleControl} from "../Controls/FontStyleControl"
import {alignmentControl} from "../Controls/AlignmentControl"
import {textColorControl} from "../Controls/TextColorControl"
import {backgroundControl} from "../Controls/BackgroundControl"
import {sizeControl} from "../Controls/SizeControl"
import {borderControl} from "../Controls/BorderControl"
import {itemControl} from "../Controls/ItemControl"
import {imageControl} from "../Controls/ImageControl"
import {barcodeValueControl} from "../Controls/BarcodeValueControl";
import {barcodeLineControl} from "../Controls/BarcodeLineControl";
import {spacingAndLineHeightControl} from "../Controls/SpacingAndLineHeightControl";
import { lineControls } from "../Controls/LineControl";
import {placeholderControls} from "../Controls/PlaceholderControls";


export default class RightSidebar {
    constructor($element = $("#RightSidebar")) {
        this.$element = $element;

        this.hideAllControls();

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            
            if (selectedItems.length === 0) {
                this.hideAllControls();
            }
            else if (selectedItems.length === 1) {
                this.hideAllControls();
                this.showControlsFor(selectedItems[0]);
            }
            else if (selectedItems.length > 1) {
                this.hideAllControls();
                itemControl.$element.show();
            }
        });
    }

    hideAllControls() {
        $("#RightSidebar .control").hide();
    }

    showControlsFor(item) {
        
        switch(item.type) {
            case "TEXT":
                valueControl.$element.show();
                fontControl.$element.show();
                fontStyleControl.$element.show();
                alignmentControl.$element.show();
                textColorControl.$element.show();
                spacingAndLineHeightControl.$element.show();
                break;
            case "TEXTBOX":
                valueControl.$element.show();
                fontControl.$element.show();
                fontStyleControl.$element.show();
                alignmentControl.$element.show();
                textColorControl.$element.show();
                spacingAndLineHeightControl.$element.show();
                break;
            case "DATE":
                dateControl.$element.show();
                fontControl.$element.show();
                fontStyleControl.$element.show();
                alignmentControl.$element.show();
                textColorControl.$element.show();
                spacingAndLineHeightControl.$element.show();
                break;
            case "BARCODE":
                barcodeValueControl.$element.show();
                fontControl.$element.show();
                fontStyleControl.$element.show();
                textColorControl.$element.show();
                alignmentControl.$element.show();
                barcodeLineControl.$element.show();
                break
            case "IMAGE":
                imageControl.$element.show();
                break;
            case "RECTANGLE":
            case "ELLIPSE":
                sizeControl.$element.show();
                backgroundControl.$element.show();
                borderControl.$element.show();
                break;
            case "LINE":
                lineControls.$element.show();
                break;
            default:
                return;
        }
        itemControl.$element.show();
    }

}

export let rightSidebar = new RightSidebar($("#RightSidebar"));