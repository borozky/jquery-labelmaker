import $ from "jquery";
import store from "../store";

export default class SizeControl {
    constructor() {
        this.$element = $("#SizeControl");
        this.$width = this.$element.find("input[name='width']");
        this.$height = this.$element.find("input[name='height']")
    
        this.$width.on("input change paste keyup", this.widthChanged.bind(this));
        this.$height.on("input change paste keyup", this.heightChanged.bind(this));

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0]);
            }
        })
    }

    widthChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                width: Number(e.target.value)
            }
        })
    }
    heightChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                height: Number(e.target.value)
            }
        })
    }

    setItem(item) {
        this.item = item;
        if(Number(item.width) !== Number(this.$width.val())) {
            this.$width.val(Number(item.width));
        }
        if(Number(item.height) !== Number(this.$height.val())) {
            this.$height.val(Number(item.height));
        }
    }
}

export let sizeControl = new SizeControl();