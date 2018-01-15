import $ from "jquery";
import store from "../store";

export default class BackgroundControl {
    constructor() {
        this.$element = $("#BackgroundColorControl");
        this.$backgroundColor = this.$element.find("input");

        this.$backgroundColor.on("input change paste keyup", this.backgroundColorChanged.bind(this));
        
        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0]);
            }
        })
    }

    backgroundColorChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                background: `#${e.target.value}`,
                backgroundColor: `#${e.target.value}`
            }
        })
    }

    setItem(item) {
        this.item = item;
        let val = item.backgroundColor.toUpperCase().replace("#", "");
        if (val !== this.$backgroundColor.val()) {
            this.$backgroundColor.val(val);
        }
    }
}

export let backgroundControl = new BackgroundControl();