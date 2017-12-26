import {appHeader} from "./scripts/Sections/AppHeader";
import {appFooter} from "./scripts/Sections/AppFooter";
import {leftSidebar} from "./scripts/Sections/LeftSidebar";
import {rightSidebar} from "./scripts/Sections/RightSidebar";
import {appCanvas} from "./scripts/AppCanvas";

export default class App {
    
    /**
     * @param {HTMLElement} $element  
     */
    constructor($element) {
        this.$element = document.body;
        this.AppHeader = appHeader;
        this.AppFooter = appFooter;
        this.LeftSidebar = leftSidebar;
        this.RightSidebar = rightSidebar;
        this.AppCanvas = appCanvas;
    }

}

export let app = new App();