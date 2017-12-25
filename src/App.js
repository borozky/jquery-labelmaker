
import {appFooter} from "./scripts/Sections/AppFooter";
import {leftSidebar} from "./scripts/Sections/LeftSidebar";
import {rightSidebar} from "./scripts/Sections/RightSidebar";
import AppCanvas, {appCanvas} from "./scripts/AppCanvas";

export default class App {
    
    /**
     * 
     * @param {HTMLElement} $element  
     */
    constructor($element = document.body) {
        this.$element = $element;

        this.AppHeader = new AppHeader();
        this.AppFooter = appFooter;
        this.LeftSidebar = leftSidebar;
        this.RightSidebar = rightSidebar;
        this.AppCanvas = appCanvas;
    }

}