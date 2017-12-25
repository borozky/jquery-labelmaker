import $ from "jquery";
import store from "../store";

export default class FontStyleControl {
    constructor() {
        this.$element = $("#FontStylingControl");
        this.$fontStyles = this.$element.find(".font-style");
        this.$fontBold = this.$element.find("#FontBold");
        this.$fontItalic = this.$element.find("#FontItalic");
        this.$fontUnderline = this.$element.find("#FontUnderline");

        let self = this;
        this.$fontStyles.on("click", function() {
            let prop = $(this).attr("data-prop");
            let dataActive = $(this).attr("data-active");
            let dataDefault = $(this).attr("data-default");
            let value = $(this).hasClass("active") ? dataDefault : dataActive;
            let payload = {};
            payload["id"] = self.item.id;
            payload[prop] = value;
            store.dispatch({
                type: "UPDATE_CANVAS_ITEM",
                payload: payload
            });
        });

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1) {
                this.setItem(selectedItems[0]);
            }
        })
    }

    setItem(item) {
        this.item = item;

        if (item.fontWeight == "bold") {
            this.$fontBold.addClass("active");
        } else {
            this.$fontBold.removeClass("active");
        }

        if (item.fontStyle == "italic") {
            this.$fontItalic.addClass("active");
        } else {
            this.$fontItalic.removeClass("active");
        }

        if (item.textDecoration == "underline") {
            this.$fontUnderline.addClass("active");
        } else {
            this.$fontUnderline.removeClass("active");
        }

    }

}

export let fontStyleControl = new FontStyleControl();