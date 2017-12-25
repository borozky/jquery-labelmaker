import $ from "jquery";
import store from "../store";

export default class ItemControl {
    constructor() {
        this.$element = $("#ItemControl");
        this.$removeButton = this.$element.find("button");

        this.$removeButton.on("click", this.removeAllSelectedItems.bind(this));
    }

    removeAllSelectedItems(e) {
        store.dispatch({
            type: "REMOVE_SELECTED_ITEMS"
        });
    }
}

export let itemControl = new ItemControl();