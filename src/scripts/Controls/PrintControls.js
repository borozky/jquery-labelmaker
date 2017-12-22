import $ from "jquery";
import {appCanvas} from "../AppCanvas";

export default class PrintControls {
    options = {
        width: 21.5,
        height: 29.7,
        units: "cm",
        onUpdate: function(newSettings) {},
        onPreview: function(settings){}
    }

    constructor(options) {
        this.$element = $("#PrintControls");
        this.options = {...this.options, ...options};

        let $paperWidth = this.$element.find("input[name='paper-width']");
        let $paperHeight = this.$element.find("input[name='paper-height']");
        let $paperUnit = this.$element.find("select[name='paper-unit']");
        let $previewButton = this.$element.find("button");

        $paperWidth[0].value = Number(this.options.width)
        $paperHeight[0].value = Number(this.options.height)
        $paperUnit[0].value = Number(this.options.units)

        $paperWidth.on("input change paste keyup", e => {
            this.options.width = Number(e.target.value)
            this.options.onUpdate(this.options);
        })

        $paperHeight.on("input change paste keyup", e => {
            this.options.height = Number(e.target.value)
            this.options.onUpdate(this.options);
        })

        $paperUnit.on("change", e => {
            this.options.units = e.target.value.toString()
            this.options.onUpdate(this.options);
        })

        $previewButton.on("click", e => {
            this.preview();
        })
    }

    setSize(width = this.options.width, height = this.options.height) {
        this.options.width = width
        this.options.height = height
        this.options.onUpdate();
    }

    preview() {
        this.options.onPreview(this.options);
    }
}

export let printControls = new PrintControls({
    onUpdate: function(newOptions) {
        appCanvas.$element[0].style.width = `${newOptions.width}${newOptions.units}`
        appCanvas.$element[0].style.height = `${newOptions.height}${newOptions.units}`
    },
    onPreview: function(settings) {
        alert(JSON.stringify(settings));
    }
});