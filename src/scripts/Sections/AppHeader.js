import $ from "jquery"
import {printControls} from "../Controls/PrintControls";
import {fileControls} from "../Controls/FileControls";
import {templateControls} from "../Controls/TemplateControls";

export default class AppHeader {
    constructor() {
        this.$element = $("#AppHeader");
        this.printControls = printControls;
        this.fileControls = fileControls;
        this.templateControls = templateControls;
    }
}

export let appHeader = new AppHeader();