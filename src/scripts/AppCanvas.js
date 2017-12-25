import $ from "jquery";
import "jquery-ui-bundle";
import {appFooter} from "./Sections/AppFooter";
import {leftSidebar} from "./Sections/LeftSidebar";
import {rightSidebar} from "./Sections/RightSidebar";
import store from "../scripts/store";
import JSBarcode from "jsbarcode";
import moment from "moment";

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
            stop: function(event, ui) {
            },
            selected: function(event, ui) {
                let $selected = $(ui.selected);
                if ($selected.hasClass("canvas-item")) {
                    store.dispatch({
                        type: "UPDATE_CANVAS_ITEM",
                        payload: {
                            id: $selected.attr("id"),
                            selected: true
                        }
                    })
                }
            },
            unselected: function(event, ui) {
                let $unselected = $(ui.unselected);
                if ($unselected.hasClass("canvas-item")) {
                    store.dispatch({
                        type: "UPDATE_CANVAS_ITEM",
                        payload: {
                            id: $unselected.attr("id"),
                            selected: false
                        }
                    });
                }
            }
        });

        // .canvas-item is dynamically created item. Use delegates
        self.$element.on("click", ".canvas-item", function(e) {
            store.dispatch({
                type: "SELECT_SINGLE_CANVAS_ITEM",
                payload: {
                    id: $(this).attr("id"),
                }
            })
        });

        store.subscribe(() => {
            let items = store.getState().canvas.items;

            // remove an item based on existing IDs
            let itemIDs = items.map(item => item.id);
            self.$element.find(".canvas-item").each(function() {
                let id = $(this).attr("id");
                if (itemIDs.indexOf(id) === -1) {
                    $(this).remove();
                }
            })


            // add or update item
            items.forEach(element => {
                let canvasItem = self.$element.find(`#${element.id}`);

                // create item if doesn't exists
                if(canvasItem.length === 0) {
                    self.addItem(element);
                }
                // update item
                else {
                    self.updateItem(element.id, element);
                }
            });
        });



    }

    addItem(item = {}) {
        let $element = $("<div class='canvas-item'/>");
        $element.addClass(item.type.toString().toLowerCase());
        $element.attr("data-type", item.type);
        $element.attr("id", item.id.toString());
        $element.css({...item});

        // DOM
        switch(item.type) {
            case "TEXT":
            case "TEXTBOX":
                $element.append($(`<span class='value'>${item.value.toString()}</span>`));
                break;
            case "DATE":
                $element.append($(`<span class='value'>${moment(item.value).format(item.format)}</span>`));
                break;
            case "RECTANGLE":
            case "ELLIPSE":
                // these shapes have no inner DOM content
                break;
            case "IMAGE":
                $element.append(`<img src="${item.value}" alt="${item.id}"/>`);
                break;
            case "BARCODE":
                let $barcode = $(`<svg id="${item.id}_img"/>`)[0];
                $element.append($barcode);
                let fontOptions = [];
                if (item.fontWeight === "bold") {
                    fontOptions.push("bold");
                }
                if (item.fontStyle === "italic") {
                    fontOptions.push("italic");
                }
                JSBarcode($barcode, item.value, {
                    ...item,
                    renderer: "svg",
                    displayValue: item.displayValue,
                    width: item.lineWidth,
                    height: item.lineHeight,
                    font: item.fontFamily,
                    lineColor: item.color,
                    background: "transparent",
                    fontOptions: fontOptions.join(" ")
                })
                break;
            default:
                console.error("Cannot add value for type " + item.type);
                break;
        };

        // Resizable
        switch(item.type) {
            case "TEXTBOX":
            case "RECTANGLE":
            case "ELLIPSE":
            case "IMAGE":
            case "BARCODE":
                $element.resizable({
                    start: function() {
                        store.dispatch({
                            type: "SELECT_SINGLE_CANVAS_ITEM",
                            payload: {
                                id: item.id
                            }
                        })
                    },
                    stop: function(event, ui) {
                        store.dispatch({
                            type: "UPDATE_CANVAS_ITEM",
                            payload: {
                                id: item.id,
                                width: ui.size.width,
                                height: ui.size.height
                            }
                        })
                    }
                });
        }


        let $coordinates = document.getElementById("Coordinates");
        $element.draggable({
            start: function(event, ui) {
                store.dispatch({
                    type: "SELECT_SINGLE_CANVAS_ITEM",
                    payload: {
                        id: item.id,
                    }
                })
            },
            stop: function(event, ui) {
                store.dispatch({
                    type: "UPDATE_CANVAS_ITEM",
                    payload: {
                        id: item.id,
                        left: ui.position.left,
                        top: ui.position.top,
                        selected: true,
                    }
                })
            },
        })

        $element.data("labelmaker", item);
        this.$element.append($element);
    }

    updateItem(id, item = {}) {
        let $element = this.$element.find("#" + id);
        $element.css({...item});

        if (item.selected) {
            $element.addClass("ui-selected");
        } else {
            $element.removeClass("ui-selected");
        }

        $element.data("labelmaker", item);

        switch(item.type) {
            case "TEXT":
            case "TEXTBOX":
                let $value = $element.find(".value");
                $value.html(item.value);
                break;
            case "DATE":
                let $date = $element.find(".value");
                $date.html(moment(item.value).format(item.format));
                break;
            case "IMAGE":
                let $img = $element.find("img")[0];
                $img.src = item.value;
                break;
            case "BARCODE":
                let $barcode = $element.find("svg")[0];
                let fontOptions = [];
                if (item.fontWeight === "bold") {
                    fontOptions.push("bold");
                }
                if (item.fontStyle === "italic") {
                    fontOptions.push("italic");
                }
                JSBarcode($barcode, item.value, {
                    ...item,
                    renderer: "svg",
                    displayValue: item.displayValue,
                    width: item.lineWidth,
                    height: item.lineHeight,
                    font: item.fontFamily,
                    lineColor: item.color,
                    background: "transparent",
                    fontOptions: fontOptions.join(" ")
                })
            default:
                return;
        }
    }

}


export let appCanvas = new AppCanvas($("#AppCanvas"), {
    onItemSelected: function(item) {

    },
    onMultipleItemsSelected: function(items) {

    },
    onItemRemoved: function() {

    },
    onMultipleItemsRemoved: function() {

    }
});