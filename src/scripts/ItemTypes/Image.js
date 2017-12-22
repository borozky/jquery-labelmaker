import $ from "jquery";
import "jquery-ui-bundle"
import Rectangle from "./Rectangle";
import defaultImage from "../../images/image.png";

export default class Image extends Rectangle {
    constructor(image = defaultImage, options = {}) {
        super(80, 80, {
            backgroundColor: "transparent",
            border: "none",
            type: "IMAGE"
        })
        let $img = $(`<img src='${image}'/>`);
        this.$element.append($img);
    }
}