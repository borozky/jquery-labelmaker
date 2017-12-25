import $ from "jquery"
import store from "../store"

export default class ImageControl {
    constructor() {
        this.$element = $("#ImageControl")
        this.$image = this.$element.find("input[name='image']");

        let self = this;
        this.$image.on("input change", function(e) {
            if (e.target.files && e.target.files[0]) {
                let reader = new FileReader();
                reader.onload = evt => {
                    store.dispatch({
                        type: "UPDATE_CANVAS_ITEM",
                        payload: {
                            id: self.item.id,
                            value: evt.target.result
                        }
                    })
                }
                reader.readAsDataURL(e.target.files[0]);
            }
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
    }
}

export let imageControl = new ImageControl();