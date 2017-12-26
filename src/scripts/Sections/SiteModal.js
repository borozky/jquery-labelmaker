import $ from "jquery";
import "../../styles/SiteModal.css";

export default class SiteModal {
    constructor() {
        this.$element = $("#SiteModal");
        this.$content = null;
        this.$background = this.$element.find("#SiteModalBackground");
        this.$closeButton = this.$element.find("#CloseModal");
        this.$modalContent = this.$element.find("#ModalContent");

        this.$closeButton.on("click", e => {
            e.preventDefault();
            this.close();
        });

        this.$background.on("click", e => {
            e.preventDefault();
            this.close();
        })
    }

    close() {
        this.$element.removeClass("open");
    }

    open() {
        this.$element.addClass("open");
    }

    /**
     * @param {JQuery<HTMLElement>} $content 
     */
    setContent($content) {
        this.$content = $content;
        this.$modalContent.empty();
        this.$modalContent.append($content);
    }
}

export let siteModal = new SiteModal();