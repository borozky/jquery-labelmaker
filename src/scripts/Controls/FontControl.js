import $ from "jquery";
import store from "../store";

export default class FontControl {
    constructor() {
        this.$element = $("#FontFamilyControl");
        this.$fontFamily = this.$element.find("select");
        this.$fontSize = this.$element.find("input");

        this.$fontFamily.on("change", this.fontFamilyChanged.bind(this));
        this.$fontSize.on("input change paste keyup", this.fontSizeChanged.bind(this));

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0]);
            }
        });
    }

    fontSizeChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                fontSize: Number(e.target.value)
            }
        })
    }

    fontFamilyChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                fontFamily: e.target.value
            }
        })
    }
    
    setItem(item) {
        this.item = item;
        this.$fontFamily.val(item.fontFamily)
        this.$fontSize.val(Number(item.fontSize));
    }
}

export let fontControl = new FontControl();
