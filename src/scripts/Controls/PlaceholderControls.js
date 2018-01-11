import $ from 'jquery';
import store from '../store';

class PlaceholderControls {
    constructor() {
        let self = this;
        this.$element = $("#PlaceholderControls");

        store.subscribe(() => {
            let placeholders = store.getState().canvas.placeholders;
            this.$element.empty();
            
            if (placeholders.length <= 0) {
                this.$element.html(`<b>There are no detected placeholders</b>`);
            } else {
                placeholders.forEach(placeholder => {
                    this.addPlaceholder(placeholder);
                })
            }
        })
    }

    addPlaceholder(placeholder) {
        /** @type {string} */
        let placeholderContent = placeholder.replace("{{", "").replace("}}", "");
        let html = `
            <div class='placeholder-control'>
                <div class='placeholder'>
                    <b>${placeholder}</b>
                </div>
            </div>
        `;

        let $elem = $(html);
        $elem.attr("id", `PLACEHOLDER_${placeholderContent}`);

        this.$element.append($elem);
    }
}

export let placeholderControls = new PlaceholderControls();