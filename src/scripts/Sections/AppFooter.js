import $ from "jquery";
import store from "../store";

export default class AppFooter {
    constructor($element = $("#AppFooter")) {
        this.$element = $element;
        this.$coordinates = this.$element.find("#Coordinates");

        store.subscribe(() => {
            let selected = store.getState().canvas.items.filter(item => item.selected);
            if (selected.length > 0) {
                this.$coordinates[0].innerHTML = `x: ${selected[0].left}, y: ${selected[0].top}`;
            }
            else {
                this.$coordinates[0].innerHTML = "";
            }
        });

    }
}

export let appFooter = new AppFooter();