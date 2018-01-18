import $ from 'jquery';
import JSBarcode from 'jsbarcode';
import moment from 'moment';
import defaultImage from '../images/image.png';

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
                    let date = moment(item.value, "DD-MM-YYYY hh:mm:ss a").format(item.format);
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

export class CanvasItemGenerator {
    static defaults = {
        left: 80, 
        top: 80,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderColor: "none",
        value: null,
        color: "#000000",
        fontSize: 20,
        fontFamily: "Arial",
        textAlign: "left",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        lineHeight: 1,
        letterSpacing: 1,
        transform: "rotate(0deg)"
    }

    static makeText(value = "TEXT") {
        return {
            ...CanvasItemGenerator.defaults,
            value: value,
            type: "TEXT"
        }
    }

    static makeTextbox(value = "Lorem ipsum dolor sit amet") {
        return {
            ...CanvasItemGenerator.makeText(value),
            width: 80,
            height: 80,
            type: "TEXTBOX",
        }
    }

    static makeDate(format = "DD-MM-YYYY hh:mm:ss a") {
        return {
            ...CanvasItemGenerator.makeText(moment().format(format)),
            format: format,
            type: "DATE",
        }
    }

    static makeRectangle(width = 80, height = 80) {
        return {
            ...CanvasItemGenerator.defaults,
            width: width,
            height: height,
            backgroundColor: "#dff0fe",
            borderColor: "#88b5df",
            borderWidth: 1,
            borderStyle: "solid",
            type: "RECTANGLE"
        }
    }

    static makeEllipse(width = 80, height = 80) {
        return {
            ...CanvasItemGenerator.makeRectangle(width, height),
            type: "ELLIPSE"
        }
    }

    static makeImage(src = defaultImage) {
        return {
            ...CanvasItemGenerator.defaults,
            width: 80,
            height: 80,
            value: src,
            type: "IMAGE"
        }
    }

    static makeBarcode(value = "000000000") {
        return {
            ...CanvasItemGenerator.defaults,
            width: 203,
            height: 132,
            displayValue: true,
            lineHeight: 100,
            lineWidth: 2,
            margin: 0,
            value: value,
            textAlign: "center",
            renderer: 'svg',
            marginBottom: 10, // allow space for letters like g,j,p,q,y
            type: "BARCODE"
        }
    }

    static makeLine(length = 300, thickness = 3) {
        return {
            ...CanvasItemGenerator.defaults,
            width: length,
            height: thickness,
            backgroundColor: "#000000",
            type: "LINE"
        }
    }
}

