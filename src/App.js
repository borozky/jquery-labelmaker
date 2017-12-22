import AppHeader from "./scripts/Sections/AppHeader";
import AppFooter from "./scripts/Sections/AppFooter";
import LeftSidebar from "./scripts/Sections/LeftSidebar";
import RightSidebar from "./scripts/Sections/RightSidebar";
import AppCanvas from "./scripts/AppCanvas";

export default class App {
    
    /**
     * 
     * @param {HTMLElement} $element  
     */
    constructor($element = document.body) {
        this.$element = $element;

        this.AppHeader = new AppHeader();
        this.AppFooter = new AppFooter();
        this.LeftSidebar = new LeftSidebar();
        this.RightSidebar = new RightSidebar();
        this.AppCanvas = new AppCanvas();
    }

}