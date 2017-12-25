import $ from "jquery";
import store from "../store";

export default class AlignmentControl {
    constructor() {
        this.$element = $("#FontAlignmentControl");
        this.$fontAlignments = this.$element.find(".font-alignment");

        let self = this;
        this.$fontAlignments.on("click", function() {
            store.dispatch({
                type: "UPDATE_CANVAS_ITEM",
                payload: {
                    id: self.item.id,
                    textAlign: $(this).attr("data-value")
                }
            })
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

        this.$element
            .find(`.font-alignment[data-value='${item.textAlign}']`)
            .addClass("active")
            .siblings(".font-alignment")
            .removeClass("active")
    }
}

export let alignmentControl = new AlignmentControl();