import $ from "jquery";
import "jquery-ui-bundle"
import Rectangle from "./Rectangle";

export default class Ellipse extends Rectangle {
    constructor(width = 80, height = 80, options = {}){
        super(width, height, {
            type: "ELLIPSE",
            borderRadius: "100%"
        });
    }
}