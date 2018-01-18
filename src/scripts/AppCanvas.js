import $ from 'jquery';
import store from '../scripts/store';
import JSBarcode from 'jsbarcode';
import moment from 'moment';
import Mousetrap from 'mousetrap';
import {doPolygonsIntersect, getElementCornerCoordinates, getElementRotation} from '../scripts/helpers';
import "../libs/jquery-ui-rotatable/jquery.ui.rotatable";
import "../libs/jquery-ui-rotatable/jquery.ui.rotatable.css";
import "../libs/jQuery-ui-resizable-rotation-patch/resizable-rotation.patch";

export class AppCanvas {

    /** @type {JQuery<HTMLElement>} */
    $element;

    constructor() {
        let self = this;
        self.$element = $("#AppCanvas");

        self.setupKeyboardEvents();

        self.$element.selectable({
            filter: ".canvas-item", // select .canvas-item only to improve performance, esp with inline SVGs
            tolerance: "touch"
        });

        self.$element.on("selectableselected", this.handleSelectableSelected);
        self.$element.on("selectableunselected", this.handleSelectableUnselected);
        self.$element.on("selectablestop", this.handleSelectableStop);

        // .canvas-item is dynamically created item. Use delegates
        self.$element.on("click", ".canvas-item", this.handleCanvasItemClicked);

        store.subscribe(() => {

            // set size
            let settings = store.getState().settings;
            this.resize(settings.width, settings.height, settings.units);


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

    /** @param {JQuery.Event<HTMLElement, null>} e */
    handleCanvasItemClicked(e) {
        /** @type {HTMLElement} */
        let self = this;
        store.dispatch({
            type: "SELECT_SINGLE_CANVAS_ITEM",
            payload: {
                id: $(self).attr("id")
            }
        })
    }

    handleSelectableSelected(event, ui) {
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
    }

    handleSelectableUnselected(event, ui) {
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

    handleSelectableStop(event, ui) {
        let $helper = $(".ui-selectable-helper");
        let $appCanvas = $("#AppCanvas");

        let helperCornerPoints = [
            { 
                x: $helper.offset().left - $appCanvas.offset().left,
                y: $helper.offset().top - $appCanvas.offset().top
            }, // nw
            { 
                x: $helper.offset().left - $appCanvas.offset().left + $helper.width(), 
                y: $helper.offset().top - $appCanvas.offset().top
            }, // ne
            { 
                x: $helper.offset().left - $appCanvas.offset().left + $helper.width(), 
                y: $helper.offset().top - $appCanvas.offset().top + $helper.height() 
            }, // se
            { 
                x: $helper.offset().left - $appCanvas.offset().left , 
                y: $helper.offset().top - $appCanvas.offset().top + $helper.height() 
            }  // sw
        ];

        $(".canvas-item").each(function() {
            var pointsA = getElementCornerCoordinates(this);
            let doesIntersect = doPolygonsIntersect(pointsA, helperCornerPoints);
            if (doesIntersect && $(this).hasClass("ui-selected") === false) {
                $(this).addClass("ui-selected");
                store.dispatch({
                    type: "UPDATE_CANVAS_ITEM",
                    payload: {
                        id: $(this).attr("id"),
                        selected: true
                    }
                })
                return;
            }

            if (doesIntersect === false) {
                $(this).removeClass("ui-selected");
                store.dispatch({
                    type: "UPDATE_CANVAS_ITEM",
                    payload: {
                        id: $(this).attr("id"),
                        selected: false
                    }
                })
            }
        })
    }

    addItem(item) {

        let $element = $("<div class='canvas-item'/>");
        $element.addClass(item.type.toString().toLowerCase());
        $element.attr("data-type", item.type);
        $element.attr("id", item.id.toString());
        $element.attr("title", item.id.toString());

        // DOM
        switch(item.type) {
            case "TEXT":
            case "TEXTBOX":
                $element.append($(`<span class='value'>${item.value.toString()}</span>`));
                break;
            case "DATE":
                let date = moment(item.value, "DD-MM-YYYY hh:mm:ss a").format(item.format);
                $element.append($(`<span class='value'>${date}</span>`));
                break;
            case "LINE":
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
            case "LINE":
                $element.resizable({
                    // grid: 3      // DO NOT USE grids! The resize-rotation patch is not working very well with grids. 
                    handles: item.type === "LINE" ? "w, e" : 'ne, nw, se, sw, n, w, s, e' ,
                    start: function(event, ui) {
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
                                height: item.type === "LINE" ? item.height : ui.size.height,
                                left: ui.position.left,
                                top: ui.position.top
                            }
                        })
                    }
                });
                break;
            default:
                break;
        }

        $element.rotatable({
            handleOffset: item.type === "LINE" ? { top: -10, left: 20 } : {top: 0, left: -20},
            snap: true,
            step: 2.0,
            wheelRotate: false,
            stop: function(event, ui) {
                let angle = Math.round(getElementRotation(this));
                let id = $(this).attr("id");
                store.dispatch({
                    type: "UPDATE_CANVAS_ITEM",
                    payload: {
                        id: id,
                        transform: `rotate(${angle}deg)`
                    }
                })
            }
        });

        // https://stackoverflow.com/questions/3523747/webkit-and-jquery-draggable-jumping
        var recoupLeft, recoupTop;
        $element.draggable({
            grid: [2,2],
            start: function(event, ui) {
                var left = parseInt($(this).css('left'),10);
                left = isNaN(left) ? 0 : left;
                var top = parseInt($(this).css('top'),10);
                top = isNaN(top) ? 0 : top;
                recoupLeft = left - ui.position.left;
                recoupTop = top - ui.position.top;

                store.dispatch({
                    type: "SELECT_SINGLE_CANVAS_ITEM",
                    payload: {
                        id: item.id,
                    }
                })
            },
            drag: function(event, ui) {
                ui.position.left += recoupLeft;
                ui.position.top += recoupTop;
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
        
        if (item.selected) {
            $element.addClass("ui-selected");
        } else {
            $element.removeClass("ui-selected");
        }

        $element.data("labelmaker", item);
        $element.css({...item});

        this.$element.append($element);
    }

    updateItem(id, item) {
        let $element = this.$element.find("#" + id);
        let currentData = $element.data("labelmaker");
        if(currentData === item) {
            return;
        }

        if (item.selected) {
            $element.addClass("ui-selected");
        } else {
            $element.removeClass("ui-selected");
        }

        switch(item.type) {
            case "TEXT":
            case "TEXTBOX":
                let $value = $element.find(".value");
                $value.html(item.value);
                break;
            case "DATE":
                let $date = $element.find(".value");
                $date.html(moment(item.value, "DD-MM-YYYY hh:mm:ss a").format(item.format));
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
                break;
            case "RECTANGLE":
            case "ELLIPSE":
            case "LINE":
                break;
            default:
                break;
        }

        $element.css({...item});
        $element.data("labelmaker", item);
    }

    resize(width = 21.0, height = 29.7, units = "cm") {
        this.$element.css({
            width: `${width}${units}`,
            height: `${height}${units}`
        })
    }

    setupKeyboardEvents() {

        Mousetrap.bind("up", function() {
            if (document.activeElement === document.body) {
                let selectedItems = store.getState().canvas.items.filter(item => item.selected);
                if (selectedItems.length === 1) {
                    store.dispatch({
                        type: "UPDATE_CANVAS_ITEM",
                        payload: {
                            id: selectedItems[0].id,
                            top: selectedItems[0].top - 1
                        }
                    });
                    return false;
                }
            }
        });

        Mousetrap.bind("down", function() {
            if (document.activeElement === document.body) {
                let selectedItems = store.getState().canvas.items.filter(item => item.selected);
                if (selectedItems.length === 1) {
                    store.dispatch({
                        type: "UPDATE_CANVAS_ITEM",
                        payload: {
                            id: selectedItems[0].id,
                            top: selectedItems[0].top + 1
                        }
                    });
                    return false;
                }
            }
        });

        Mousetrap.bind("left", function() {
            if (document.activeElement === document.body) {
                let selectedItems = store.getState().canvas.items.filter(item => item.selected);
                if (selectedItems.length === 1) {
                    store.dispatch({
                        type: "UPDATE_CANVAS_ITEM",
                        payload: {
                            id: selectedItems[0].id,
                            left: selectedItems[0].left - 1
                        }
                    });
                    return false;
                }
            }
        });

        Mousetrap.bind("right", function() {
            if (document.activeElement === document.body) {
                let selectedItems = store.getState().canvas.items.filter(item => item.selected);
                if (selectedItems.length === 1) {
                    store.dispatch({
                        type: "UPDATE_CANVAS_ITEM",
                        payload: {
                            id: selectedItems[0].id,
                            left: selectedItems[0].left + 1
                        }
                    });
                    return false;
                }
            }
        });

    }

}


export let appCanvas = new AppCanvas();