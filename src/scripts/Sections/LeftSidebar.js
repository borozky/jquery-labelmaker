import $ from "jquery";
import Text from "../ItemTypes/Text";
import Textbox from "../ItemTypes/Textbox";
import Rectangle from "../ItemTypes/Rectangle";
import Ellipse from "../ItemTypes/Ellipse";
import Image from "../ItemTypes/Image";
import {appCanvas} from "../AppCanvas";
import {printControls} from "../Controls/PrintControls";
import {fontControls} from "../Controls/FontControls";


export default class LeftSidebar {
    options = {
        onCreate: function() {}
    }

    constructor($element = $("#LeftSidebar"), options = {onCreate:function(itemType){} }) {
        this.$element = $element;
        this.options = {...this.options, ...options};

        let self = this;
        this.$element.find(".item-types").on("click", function(e) {
            let itemType = $(this).attr("data-type").toString();
            self.options.onCreate(itemType);
        })
    }
}


export let leftSidebar = new LeftSidebar($("#LeftSidebar"), {
    onCreate: function(itemType) {
        switch(itemType) {
            case "TEXT":
                let text = new Text("TEXT");
                appCanvas.addItem(text);
                break;
            case "TEXTBOX":
                let textbox = new Textbox("Lorem ipsum dolor sit amet");
                appCanvas.addItem(textbox);
                break;
            case "RECTANGLE":
                let rectangle = new Rectangle();
                appCanvas.addItem(rectangle);
                break;
            case "ELLIPSE":
                let ellipse = new Ellipse();
                appCanvas.addItem(ellipse);
                break;
            case "IMAGE":
                let image = new Image();
                appCanvas.addItem(image);
                break;
            default:
                console.error(`Unable to add item of type ${itemType}`);
                return;
        }
    }
});