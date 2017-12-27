import $ from "jquery"
import store from "../store"

export default class LineControl {
    constructor() {
        this.$element = $("#LineControl")
        this.$length = this.$element.find("input[name='length']")
        this.$thickness = this.$element.find("input[name='thickness']")
        this.$orientation = this.$element.find("input[name='orientation']")
        this.$lineColor = this.$element.find("input[name='line-color']")

        this.$length.on("input change paste keyup", this.lengthChanged.bind(this))
        this.$thickness.on("input change paste keyup", this.thicknessChanged.bind(this));
        this.$orientation.on("change", this.orientationChanged.bind(this));
        this.$lineColor.on("input change paste keyup", this.lineColorChanged.bind(this));

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if(selectedItems.length === 1 && selectedItems[0].type === "LINE") {
                this.setItem(selectedItems[0]);
            }
        })

    }

    /**
     * 
     * @param {Event} e 
     */
    lengthChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                width: Number(e.target.value)
            }
        })
    }

    
    /**
     * 
     * @param {Event} e 
     */
    thicknessChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                height: Number(e.target.value)
            }
        })
    }

    /**
     * 
     * @param {Event} e 
     */
    orientationChanged(e) {
        let orientation = this.$element.find("input[name='orientation']:checked").val();
        console.log(orientation)
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                orientation: orientation
            }
        })
    }

    /**
     * 
     * @param {Event} e 
     */
    lineColorChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                backgroundColor: `#${e.target.value.replace("#", "")}`
            }
        })
    }


    setItem(item) {
        this.item = item
        this.$length.val(item.width)
        this.$thickness.val(item.height)
        this.$orientation.filter(function() { this.value === item.orientation}).prop("checked", true)
        this.$lineColor.val(item.backgroundColor)
    }


}

export let lineControls = new LineControl();