import $ from "jquery";

export default class SiteModal {
    constructor() {
        this.$element = $("#SiteModal");
        this.$content = null;
        this.$background = this.$element.find("#SiteModalBackground");
        this.$closeButton = this.$element.find("#CloseModal");
        this.$modalContent = this.$element.find("#ModalContent");
        this.$foreground = this.$element.find("#Foreground");
        this.$scrollable = this.$element.find("#ModalScrollableContent");

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
        this.$modalContent.find(".active").removeClass("active");
        this.$scrollable.css({
            backgroundColor: "transparent"
        })
        this.$element.removeClass("open");
    }

    open() {
        this.$element.addClass("open");
    }

    /**
     * @param {string} selector
     * @return {JQuery<HTMLElement>}
     */
    openSection(selector) {
        this.open();
        let $found = this.$modalContent.find(selector);
        $found.addClass("active").siblings().removeClass("active");
        return $found;
    }

}

export let siteModal = new SiteModal();