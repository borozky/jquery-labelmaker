import $ from "jquery";
import store from "../store";

export default class DateControl {
    constructor() {
        this.$element = $("#DatepickerControl");
        this.$date = this.$element.find("input");
        this.$format = this.$element.find("select");

        this.$date.on("input change paste keyup", this.valueChanged.bind(this));
        this.$format.on("change", this.formatChanged.bind(this));

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0]);
            }
        });
    }

    valueChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                value: e.target.value
            }
        })
    }

    formatChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                format: e.target.value
            }
        })
    }

    setItem(item) {
        this.item = item;
        this.$date.val(item.value);
        this.$format.val(item.format)
    }
}

export let dateControl = new DateControl();