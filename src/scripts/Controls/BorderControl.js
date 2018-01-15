import $ from "jquery";
import store from "../store";

export default class BorderControl {
    constructor() {
        this.$element = $("#BorderControl");
        this.$borderWidth = this.$element.find("input[name='border-width']");
        this.$borderColor = this.$element.find("input[name='border-color']")
    
        this.$borderWidth.on("input change paste keyup", this.borderWidthChanged.bind(this));
        this.$borderColor.on("input change paste keyup", this.borderColorChanged.bind(this));

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0]);
            }
        })
    }

    borderWidthChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                borderWidth: Number(e.target.value)
            }
        })
    }
    borderColorChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                borderColor: `#${e.target.value}`
            }
        })
    }

    setItem(item) {
        this.item = item;
        const borderWidth = Number(item.borderWidth)
        const borderColor = item.borderColor.toUpperCase().replace("#", "")
        if(borderWidth !== Number(this.$borderWidth.val())) {
            this.$borderWidth.val(Number(item.borderWidth));
        }
        if(borderColor !== this.$borderColor.val()) {
            this.$borderColor.val(borderColor);
        }
    }
}

export let borderControl = new BorderControl();