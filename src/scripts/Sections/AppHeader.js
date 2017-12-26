import $ from "jquery"
import {printControls} from "../Controls/PrintControls";

export default class AppHeader {
    constructor() {
        this.$element = $("#AppHeader");
        this.printControls = printControls;
    }
}

export let appHeader = new AppHeader();