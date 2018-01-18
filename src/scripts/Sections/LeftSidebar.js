import $ from 'jquery';
import store from '../store';
import {itemNavigation} from './ItemNavigation';
import {CanvasItemGenerator} from '../generators';


export default class LeftSidebar {

    constructor() {
        let self = this;
        this.$element = $("#LeftSidebar");
        this.itemNavigation = itemNavigation;

        this.$element.find(".item-types").on("click", function(e) {
            let itemType = $(this).attr("data-type").toString();
            store.dispatch({
                type: "ADD_CANVAS_ITEM",
                payload: {
                    ...self.makeCanvasItem(itemType)
                }
            });
        });

        // when left sidebar is clicked (except its li and inner items)
        this.$element.on("click", function(e) {
            let $target = $(e.target);
            if ($target.attr("id") === "LeftSidebar" || $target[0].tagName.toLowerCase() === "ul") {
                store.dispatch({
                    type: "UNSELECT_ALL_ITEMS"
                });
            }
        });
    }

    makeCanvasItem(itemType) {
        let item;

        switch(itemType) {
            case "TEXT":
                item = CanvasItemGenerator.makeText();
                break;
            case "TEXTBOX":
                item = CanvasItemGenerator.makeTextbox();
                break;
            case "DATE":
                item = CanvasItemGenerator.makeDate();
                break;
            case "RECTANGLE":
                item = CanvasItemGenerator.makeRectangle();
                break;
            case "ELLIPSE":
                item = CanvasItemGenerator.makeEllipse();
                break;
            case "IMAGE":
                item = CanvasItemGenerator.makeImage();
                break;
            case "BARCODE":
                item = CanvasItemGenerator.makeBarcode();
                break;
            case "LINE":
                item = CanvasItemGenerator.makeLine();
                break;
            default:
                alert("Adding new " + itemType + " is currently not supported");
                return;
        }

        return item;
    }

}


export let leftSidebar = new LeftSidebar();