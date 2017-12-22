import $ from "jquery";
import "jquery-ui-bundle"
import Item from "./Item";
import Text from "./Text";

export default class Textbox extends Text {
    constructor(value = "Lorem ipsum dolor sit amet", options = {}) {
        super(value, {...options, type: "TEXTBOX"});
        this.$element.resizable();
    }
}