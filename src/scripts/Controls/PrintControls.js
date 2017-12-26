import $ from "jquery";
import {appCanvas} from "../AppCanvas";
import store from "../store";

export default class PrintControls {
    constructor() {
        this.$element = $("#PrintControls");
        this.$paperWidth = this.$element.find("input[name='paper-width']");
        this.$paperHeight = this.$element.find("input[name='paper-height']");
        this.$paperUnit = this.$element.find("select[name='paper-unit']");
        this.$previewButton = this.$element.find("button");

        this.$paperWidth.on("input change paste keyup", this.paperWidthChanged.bind(this));
        this.$paperHeight.on("input change paste keyup", this.paperHeightChanged.bind(this));
        this.$paperUnit.on("change", this.paperUnitChanged.bind(this));
        this.$previewButton.on("click", this.previewClicked.bind(this));

        store.subscribe(() => {
            let settings = store.getState().settings;
            this.setSettings(settings);
        });

    }

    /**
     * @param {JQuery.Event} e 
     */
    paperWidthChanged(e) {
        store.dispatch({
            type: "UPDATE_SETTINGS",
            payload: {
                width: Number(e.target.value)
            }
        })
    }

    /**
     * @param {JQuery.Event} e 
     */
    paperHeightChanged(e) {
        store.dispatch({
            type: "UPDATE_SETTINGS",
            payload: {
                height: Number(e.target.value)
            }
        })
    }

    /**
     * @param {JQuery.Event} e 
     */
    paperUnitChanged(e) {
        store.dispatch({
            type: "UPDATE_SETTINGS",
            payload: {
                units: e.target.value
            }
        })
    }

    /**
     * @param {MouseEvent} e 
     */
    previewClicked(e) {
        alert("Preview is current not supported");
    }

    setSettings(settings) {
        this.settings = settings;
        this.$paperWidth.val(Number(this.settings.width));
        this.$paperHeight.val(Number(this.settings.height));
        this.$paperUnit.val(this.settings.units);
    }
}

export let printControls = new PrintControls();