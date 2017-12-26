import $ from "jquery"
import {printControls} from "../Controls/PrintControls";
import {fileControls} from "../Controls/FileControls";

export default class AppHeader {
    constructor() {
        this.$element = $("#AppHeader");
        this.printControls = printControls;
        this.fileControls = fileControls;
    }
}

export let appHeader = new AppHeader();