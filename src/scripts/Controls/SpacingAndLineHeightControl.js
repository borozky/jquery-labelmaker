import $ from "jquery"
import store from "../store"

export default class SpacingAndLineHeightControl {
    constructor() {
        this.$element = $("#SpacingAndLineHeightControl");
        this.$letterSpacing = this.$element.find("input[name='letter-spacing']")
        this.$lineHeight = this.$element.find("input[name='line-height']")

        this.$letterSpacing.on("input change paste keyup", this.letterSpacingChanged.bind(this))
        this.$lineHeight.on("input change paste keyup", this.lineHeightChanged.bind(this));

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected)
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0])
            }
        })

    }

    letterSpacingChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                letterSpacing: Number(e.target.value)
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
        this.$letterSpacing.val(Number(item.letterSpacing))
        this.$lineHeight.val(Number(item.lineHeight))
    }
}

export let spacingAndLineHeightControl = new SpacingAndLineHeightControl();