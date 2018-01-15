import $ from "jquery"
import store from "../store"

export default class BarcodeLineControl {
    constructor() {
        this.$element = $("#BarcodeLineControl");
        this.$lineWidth = this.$element.find("input[name='line-width']")
        this.$lineHeight = this.$element.find("input[name='line-height']")

        this.$lineWidth.on("input change paste keyup", this.lineWidthChanged.bind(this))
        this.$lineHeight.on("input change paste keyup", this.lineHeightChanged.bind(this));
    
        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0]);
            }
        })
    }

    lineWidthChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                lineWidth: Number(e.target.value)
            }
        })
    }
    
    lineHeightChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                lineHeight: Number(e.target.value)
            }
        })
    }

    setItem(item) {
        this.item = item
        const lineWidth = Number(item.lineWidth);
        const lineHeight = Number(item.lineHeight);

        if(lineWidth !== Number(this.$lineWidth.val())) {
            this.$lineWidth.val(lineWidth)
        }
        if(lineHeight !== Number(this.$lineHeight.val())) {
            this.$lineHeight.val(lineHeight)
        }
    }
}

export let barcodeLineControl = new BarcodeLineControl();