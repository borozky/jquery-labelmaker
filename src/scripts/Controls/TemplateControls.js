import $ from "jquery"
import moment from "moment"
import FileSaver from "file-saver"
import {siteModal} from "../Sections/SiteModal"
import store from "../store";
import {HTMLGenerator} from '../generators';
import html2canvas from 'html2canvas';

export default class TemplateControls {
    constructor() {
        this.$element = $("#TemplateControls");
        this.$previewTemplate = this.$element.find("#PreviewTemplate");
        this.$previewTemplate.on("click", this.previewTemplate.bind(this));

        store.subscribe(() => {
            let placeholders = store.getState().canvas.placeholders;
            if(placeholders.length === 0) {
                this.$previewTemplate.attr("disabled", "disabled");
                this.$previewTemplate.attr("title", "There are no placeholders detected");
            } else {
                this.$previewTemplate.removeAttr("disabled");
                this.$previewTemplate.removeAttr("title");
            }
        })

    }


    /**
     * @param {JQuery.Event} e
     */
    previewTemplate(e) {
        e.preventDefault();
        e.stopPropagation();

        // setup
        let $section = siteModal.openSection("#HTMLGenerator");
        let $templateControl = $section.find("#TemplateControls");
        let $templatePreview = $section.find("#TemplatePreview");
        let $templatePreviewHTML = $section.find("#TemplatePreviewHTML");
        let $templatePreviewCanvas = $section.find("#TemplatePreviewCanvas");


        // preview dimensions
        $templatePreviewHTML.css({
            width: `${store.getState().settings.width}${store.getState().settings.units}`,
            height: `${store.getState().settings.height}${store.getState().settings.units}`,
        });
        $templatePreviewCanvas.css({
            width: `${store.getState().settings.width}${store.getState().settings.units}`,
            height: `${store.getState().settings.height}${store.getState().settings.units}`,
        });


        // setup placeholder
        let items = [...store.getState().canvas.items];
        let settings = {...store.getState().settings};
        let generator = new HTMLGenerator(items, settings);
        let placeholders = store.getState().canvas.placeholders;
        let placeholderDictionary = {};
        placeholders.forEach(placeholder => {
            generator.setPlaceholder(placeholder, placeholder);
        });


        // add template controls
        $templateControl.empty();
        placeholders.forEach(placeholder => {
            let placeholderContent = placeholder.replace("{{", "").replace("}}", "");
            let html = `
                <p>
                    <label for='INPUT_FOR_PLACEHOLDER_${placeholderContent}'>${placeholderContent}<label><br/>
                    <input type='text' id='INPUT_FOR_PLACEHOLDER_${placeholderContent}' data-placeholder="${placeholder}"/>
                </p>
            `;
            let $html = $(html);
            $templateControl.prepend($html);
        });


        // update html preview on input
        $templateControl.on("input", "input[type='text']", function() {
            let attr = $(this).attr("data-placeholder");
            let value = this.value.trim().length > 0 ? this.value : attr;
            generator.setPlaceholder(attr, value);
            let $dom = generator.getDOM();
            $templatePreviewHTML.empty().append($dom);
        });


        // preview template
        $templateControl.append($('<button type="button" id="PreviewTemplateAsCanvas">Update</button>'));
        $templateControl.on("click", "#PreviewTemplateAsCanvas", function() {
            let self = this;
            $(self).attr("disabled", "disabled");
            html2canvas($templatePreviewHTML.find(".canvas-parent")[0]).then(function(canvas) {
                $templatePreviewCanvas.empty().append($(canvas));
                $(self).removeAttr("disabled");
            });
        });


        // initialize
        let $dom = generator.getDOM();
        $templatePreviewHTML.empty().append($dom);
        $templatePreviewCanvas.empty();
        html2canvas($templatePreviewHTML.find(".canvas-parent")[0]).then(function(canvas) {
            $templatePreviewCanvas.empty().append($(canvas));
        });
    }

}

export let templateControls = new TemplateControls();