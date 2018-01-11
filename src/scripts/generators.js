import $ from 'jquery';
import JSBarcode from 'jsbarcode';
import moment from 'moment';

export class HTMLGenerator {
    static defaultSettings = {
        width: 4,
        height: 6,
        units: 'in'
    }

    constructor(items = [], settings = HTMLGenerator.defaultSettings) {
        this.items = items;
        this.settings = settings;
        this.placeholders = {};
    }

    getItems() {
        return this.items;
    }

    setItems(items) {
        this.items = items.map(item => ({...item}));
    }

    getSettings() {
        return this.settings;
    }

    setSettings(settings) {
        this.settings = {...settings};
    }

    setPlaceholder(placeholder, value) {
        this.placeholders[placeholder] = value;
    }

    setPlaceholders(placeholders = {}) {
        this.placeholders = placeholders;
    }

    getDOM() {
        let newItems = this.items.map(item => {
           if (item.value) {
               return {
                   ...item,
                   value: Object.keys(this.placeholders).reduce((prev, curr) => prev.replace(new RegExp(curr, 'g'), this.placeholders[curr]), item.value)
               }
           }
           return item;
        });


        let $parentElement = $(`<div class="canvas-parent"/>`);
        $parentElement.css({
            width: `${this.settings.width}${this.settings.units}`,
            height: `${this.settings.height}${this.settings.units}`
        });

        newItems.forEach(item => {

            let $element = $("<div class='canvas-item'/>");
            $element.addClass(item.type.toString().toLowerCase());
            $element.attr("data-type", item.type);
            $element.attr("id", item.id.toString() + "_PREVIEW");
            $element.attr("title", item.id.toString());
            $element.css({...item});

            // DOM
            switch(item.type) {
                case "TEXT":
                case "TEXTBOX":
                    $element.html(`<span class='value'>${item.value.toString()}</span>`);
                    break;
                case "DATE":
                    let date = moment(item.value).format(item.format);
                    $element.html(`<span class='value'>${date}</span>`);
                    break;
                case "LINE":
                case "RECTANGLE":
                case "ELLIPSE":
                    // these shapes have no inner DOM content
                    break;
                case "IMAGE":
                    $element.html(`<img src="${item.value}" alt="${item.id}"/>`);
                    break;
                case "BARCODE":
                    let $barcode = $(`<svg id="${item.id}_img_PREVIEW"/>`)[0];
                    $element.empty();
                    $element.append($barcode);
                    let fontOptions = [];
                    if (item.fontWeight === "bold") {
                        fontOptions.push("bold");
                    }
                    if (item.fontStyle === "italic") {
                        fontOptions.push("italic");
                    }
                    JSBarcode($barcode, item.value, {
                        ...item,
                        renderer: "svg",
                        displayValue: item.displayValue,
                        width: item.lineWidth,
                        height: item.lineHeight,
                        font: item.fontFamily,
                        lineColor: item.color,
                        background: "transparent",
                        fontOptions: fontOptions.join(" ")
                    })
                    break;
                default:
                    console.error("Cannot add value for type " + item.type);
                    break;
            };

            $parentElement.append($element);
        });

        return $parentElement;
    }

}
