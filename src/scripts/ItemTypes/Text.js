import $ from "jquery";
import "jquery-ui-bundle"
import Item from "./Item";

export default class Text extends Item {
    constructor(value = "DEFAULT TEXT", options = {}) {
        super( "TEXT", { 
            value: value,
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            lineHeight: 1,
            letterSpacing: 1,
            ...options
        });
        this.$element.addClass(this.options.type.toString().toLowerCase());
        this.$element.append(`<span class='value'>${value}</span>`);
    }
}