import $ from "jquery";
import store from "../store";

export default class TextColorControl {
    constructor() {
        this.$element = $("#TextColorControl");
        this.$color = this.$element.find("input");

        this.$color.on("input change paste keyup", this.colorChanged.bind(this));
    
        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0]);
            }
        })
    }

    colorChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                color: `#${e.target.value}`
            }
        })
    }

    setItem(item) {
        this.item = item;
        this.$color.val(item.color.toUpperCase().replace("#", ""));
        this.$color.css({
            backgroundColor: "#" + item.color.toUpperCase().replace("#", "")
        })
    }
}

export let textColorControl = new TextColorControl();