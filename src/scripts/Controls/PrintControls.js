import $ from 'jquery';
import {appCanvas} from '../AppCanvas';
import {siteModal} from '../Sections/SiteModal';
import store from '../store';
import html2canvas from 'html2canvas';

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
        store.dispatch({ type: "UNSELECT_ALL_ITEMS" })

        // open modal, hide other sections
        let $previewParent = siteModal.openSection("#PreviewParent");
        siteModal.$scrollable.css({
            backgroundColor: "#CCCCCC",
        })
        
        let $preview = $previewParent.find("canvas");
        if ($preview.length > 0) {
            $preview.remove();
        }

        html2canvas(appCanvas.$element[0]).then(function(canvas) {
            let $generatedCanvas = $(canvas);
            $generatedCanvas.css({ 
                boxShadow: "0 0 0.5cm rgba(0,0,0,.5)"
            });
            $previewParent.append($generatedCanvas)
        })


        console.log(siteModal);
    }

    setSettings(settings) {
        this.settings = settings;
        if(Number(this.settings.width) !== Number(this.$paperWidth.val())) {
            this.$paperWidth.val(Number(this.settings.width));
        }
        if(Number(this.settings.height) !== Number(this.$paperHeight.val())) {
            this.$paperHeight.val(Number(this.settings.height));
        }
        if(this.settings.units !== this.$paperUnit.val()) {
            this.$paperUnit.val(this.settings.units);
        }
    }
}

export let printControls = new PrintControls();