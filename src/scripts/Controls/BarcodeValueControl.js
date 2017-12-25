import $ from "jquery"
import store from "../store"

export default class BarcodeValueControl {
    constructor() {
        this.$element = $("#BarcodeValueControl")
        this.$barcode = this.$element.find("input[name='barcode-value']")
        this.$displayValue = this.$element.find("input[name='display-value']")

        this.$barcode.on("input change paste keyup", this.barcodeChanged.bind(this));
        this.$displayValue.on("change", this.displayValueChanged.bind(this));

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0]);
            }
        })
    }

    barcodeChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                value: e.target.value
            }
        })
    }

    displayValueChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                displayValue: !this.item.displayValue
            }
        })
    }

    setItem(item) {
        this.item = item;
        this.$barcode.val(item.value);
        this.$displayValue[0].checked = item.displayValue
    }
}

export let barcodeValueControl = new BarcodeValueControl();