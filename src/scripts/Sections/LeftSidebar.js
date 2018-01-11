import $ from "jquery";
import store from "../store";
import defaultImage from "../../images/image.png";
import moment from "moment";
import {itemNavigation} from "./ItemNavigation";

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
            fontFamily: "Arial",
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
                        format: "DD-MM-YYYY hh:mm:ss a"
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
            case "LINE":
                store.dispatch({
                    type: "ADD_CANVAS_ITEM",
                    payload: {
                        ...item,
                        width: 300,
                        height: 2,
                        orientation: "horizontal",
                        backgroundColor: "#000000",
                    }
                });
                break;
            default:
                alert("Adding new " + itemType + " is currently not supported");
                return;
        }
    }
});