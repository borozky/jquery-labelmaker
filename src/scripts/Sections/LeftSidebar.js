import $ from "jquery";
import Text from "../ItemTypes/Text";
import Textbox from "../ItemTypes/Textbox";
import Rectangle from "../ItemTypes/Rectangle";
import Ellipse from "../ItemTypes/Ellipse";
import Image from "../ItemTypes/Image";
import store from "../store";
import defaultImage from "../../images/image.png";
import moment from "moment";

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

        let item = {
            left: 80, 
            top: 80,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "none",
            value: null,
            color: "#000000",
            fontSize: 20,
            fontFamily: "Segoe UI",
            textAlign: "left",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            lineHeight: 1,
            letterSpacing: 1,
            type: itemType
        }

        switch(itemType) {
            case "TEXT":
                store.dispatch({
                    type: "ADD_CANVAS_ITEM",
                    payload: {
                        ...item,
                        value: "TEXT"
                    }
                });
                break;
            case "TEXTBOX":
                store.dispatch({
                    type: "ADD_CANVAS_ITEM",
                    payload: {
                        ...item,
                        width: 80,
                        height: 80,
                        value: "Lorem ipsum dolor sit amet"
                    }
                })
                break;
            case "DATE":
                store.dispatch({
                    type: "ADD_CANVAS_ITEM",
                    payload: {
                        ...item,
                        value: (new Date()).toLocaleString(),
                        format: "DD-MM-YYYY"
                    }
                })
                break;
            case "RECTANGLE":
            case "ELLIPSE":
                store.dispatch({
                    type: "ADD_CANVAS_ITEM",
                    payload: {
                        ...item,
                        width: 80,
                        height: 80,
                        backgroundColor: "#dff0fe",
                        borderColor: "#88b5df",
                        borderWidth: 1,
                        borderStyle: "solid"
                    }
                })
                break;
            case "IMAGE":
                store.dispatch({
                    type: "ADD_CANVAS_ITEM",
                    payload: {
                        ...item,
                        width: 80,
                        height: 80,
                        value: defaultImage,
                    }
                });
                break;
            case "BARCODE":
                store.dispatch({
                    type: "ADD_CANVAS_ITEM",
                    payload: {
                        ...item,
                        width: 203,
                        height: 132,
                        value: "000000000",
                        displayValue: true,
                        lineHeight: 100,
                        lineWidth: 2,
                        margin: 0,
                        textAlign: "center",
                        marginBottom: 10, // allow space for letters like g,j,p,q,y
                    }
                });
                break;
            default:
                alert("Adding new " + itemType + " is currently not supported");
                return;
        }
    }
});