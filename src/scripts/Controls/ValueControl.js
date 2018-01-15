import $ from "jquery";
import store from "../store";

export default class ValueControl {

    constructor() {
        this.$element = $("#ValueControl");
        this.$value = this.$element.find("input");

        this.$value.on("input change paste keyup", this.valueChanged.bind(this));
        
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

    setItem(item) {
        this.item = item;
        if(item.value !== this.$value.val()) {
            this.$value.val(item.value);
        }
    }
}

export let valueControl = new ValueControl();