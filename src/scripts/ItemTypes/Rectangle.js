import $ from "jquery";
import "jquery-ui-bundle"
import Item from "./Item";

export default class Rectangle extends Item {
    constructor(width = 80, height = 80, options = {}){
        super( "RECTANGLE", {
            width: width,
            height: height,
            backgroundColor: "#eee",
            border: "2px solid black",
            ...options,
        });
        this.$element.resizable();
    }
}