export default class RightSidebarControls {
    options = {
        onItemSet: function(item) {},
        onUpdate: function(item){}
    }
    constructor($element, options = {}) {
        this.$element = $element;
        this.options = {...this.options, ...options}
    }

    setItem(item) {
        this.item = item;
        this.$element.show();
        this.options.onItemSet(item);
    }

    unsetItem() {
        this.item = null;
        this.$element.hide();
    }
}
