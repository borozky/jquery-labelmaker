import $ from "jquery";
import "jquery-ui-bundle";
import {leftSidebar} from "./Sections/LeftSidebar";
import {rightSidebar} from "./Sections/RightSidebar";

export class AppCanvas {
    selected = []
    items = []

    options = {
        width: 1024,
        height: 1024,
        onItemAdded: function(item) {},
        onResize: function() {},
        onItemSelected: function(item){},
        onMultipleItemsSelected: function(items){},
        onItemMoved: function(item, offsetX, offsetY) {},
        onMultipleItemsMoved: function(items, offsetX, offsetY) {},
        onItemRemoved: function(item) {},
        onMultipleItemsRemoved: function(items) {}
    }

    constructor($element = $("#AppCanvas"), options = {}) {
        let self = this;
        self.$element = $element;
        self.options = {...self.options, ...options};

        self.$element.selectable({
            selected: function(event, ui) {
                let selectedData = $(ui.selected).data("labelmaker");
                if($(ui.selected).hasClass("canvas-item") && self.selected.indexOf(selectedData) == -1) {
                    self.selected.push(selectedData);
                }
            },

            stop: function(event, ui) {
                let numSelected = self.selected.length;
                if (numSelected === 1){
                    self.options.onItemSelected(self.selected[0])
                } 
                else if (numSelected > 1) {
                    self.options.onMultipleItemsSelected(self.selected);
                }
            },

            unselected: function(event, ui) {
                let itemData = $(ui.unselected).data("labelmaker")
                self.selected = self.selected.filter(item => item !== itemData);
                if (self.selected.length == 0) {
                    rightSidebar.hideAllControls();
                }
            }

        });

    }

    addItem(item) {
        this.$element.append(item.$element);
        this.items.push(item);
        this.options.onItemAdded(item);
        return item;
    }

    resize(w = 1024, h = 1024) {
        this.$element.css({
            width: w, height: h
        });
        this.options.onResize(w, h);
    }

    selectOne(item) {
        this.selected = [item];
        this.options.onItemSelected(item);
    }

    selectMany(items) {
        this.selected = items;
        this.options.onMultipleItemsSelected(this.selected);
    }

    remove(item) {
        this.items = this.items.filter(v => v !== item)
        this.selected = [];
        item.$element.remove();
        this.options.onItemRemoved(item);
        item = null;
    }

    removeAllSelectedItems() {
        this.selected.forEach(item => {
            this.items = this.items.filter(v => v !== item)
            item.$element.remove();
        });
        this.options.onMultipleItemsRemoved(this.selected);
        this.selected = [];
    }
}


export let appCanvas = new AppCanvas($("#AppCanvas"), {
    onItemSelected: function(item) {
        rightSidebar.hideAllControls();
        rightSidebar.displayControlsFor(item);
    },
    onMultipleItemsSelected: function(items) {
        rightSidebar.handleMultipleItemsSelected(items);
    },
    onItemRemoved: function() {
        rightSidebar.hideAllControls();
    },
    onMultipleItemsRemoved: function() {
        rightSidebar.hideAllControls();
    }
});