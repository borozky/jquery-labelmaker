import $ from 'jquery';
import 'jquery-ui-bundle';
import store from '../scripts/store';
import JSBarcode from 'jsbarcode';
import moment from 'moment';

export class AppCanvas {

    constructor() {
        let self = this;
        self.$element = $("#AppCanvas");

        // .canvas-item is dynamically created item. Use delegates
        self.$element.on("click", ".canvas-item", function(e) {
            store.dispatch({
                type: "SELECT_SINGLE_CANVAS_ITEM",
                payload: {
                    id: $(this).attr("id"),
                }
            })
        });

        self.$element.selectable({
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

    addItem(item) {

        if (item.type === "LINE") {
            this.createLine(item);
            return;
        }

        let $element = $("<div class='canvas-item'/>");
        this.$element.append($element);
        $element.addClass(item.type.toString().toLowerCase());
        $element.attr("data-type", item.type);
        $element.attr("id", item.id.toString());
        $element.attr("title", item.id.toString());
        $element.css({...item});

        // DOM
        switch(item.type) {
            case "TEXT":
            case "TEXTBOX":
                $element.append($(`<span class='value'>${item.value.toString()}</span>`));
                break;
            case "DATE":
                let date = moment(item.value).format(item.format);
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
                break;
            default:
                break;
        }

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
        
        if (item.selected) {
            $element.addClass("ui-selected");
        } else {
            $element.removeClass("ui-selected");
        }

        $element.data("labelmaker", item);
    }

    updateItem(id, item) {
        if (item.type === "LINE") {
            this.updateLine(id, item);
            return
        }

        let $element = this.$element.find("#" + id);
        $element.data("labelmaker");

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
                $element.css({...item});
                break;
            case "DATE":
                let $date = $element.find(".value");
                $date.html(moment(item.value).format(item.format));
                $element.css({...item});
                break;
            case "IMAGE":
                let $img = $element.find("img")[0];
                $img.src = item.value;
                $element.css({...item});
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
                $element.css({...item});
                break;
            case "RECTANGLE":
            case "ELLIPSE":
                $element.css({...item});
                break
            default:
                break;
        }

        $element.data("labelmaker", item);
    }

    resize(width = 21.0, height = 29.7, units = "cm") {
        this.$element.css({
            width: `${width}${units}`,
            height: `${height}${units}`
        })
    }

    createLine(item) {
        let $element = $("<div class='canvas-item'/>");
        $element.addClass(item.type.toString().toLowerCase());
        $element.attr("data-type", item.type);
        $element.attr("id", item.id.toString());
        $element.css({...item});

        $element.resizable({
            handles: "w, e",
            stop: function(event, ui) {
                console.log(this);
                let data = $(this).data("labelmaker");
                let width = ui.size.width;
                let height = ui.size.height

                if (data.orientation === "vertical") {
                    width = ui.size.height
                    height = ui.size.width
                }

                store.dispatch({
                    type: "UPDATE_CANVAS_ITEM",
                    payload: {
                        id: item.id,
                        width: width,
                        height: height,
                        left: ui.position.left,
                        top: ui.position.top,
                    }
                })
            },
            start: function() {
                store.dispatch({
                    type: "SELECT_SINGLE_CANVAS_ITEM",
                    payload: {
                        id: item.id
                    }
                })
            },
        });

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
        this.$element.append($element);
        $element.data("labelmaker", item);

    }

    updateLine(id, item) {
        let $element = this.$element.find("#" + id);
        let data = $element.data("labelmaker");
        let oldOrientation = data.orientation;

        if (item.selected) {
            $element.addClass("ui-selected");
        } else {
            $element.removeClass("ui-selected");
        }

        
        if (item.orientation === "horizontal") {
            $element.css({
                width: item.width,
                height: item.height,
                backgroundColor: item.backgroundColor
            })
        } 
        else if (item.orientation === "vertical") {
            $element.css({
                height: item.width,
                width: item.height,
                backgroundColor: item.backgroundColor
            })
        }

        $element.data("labelmaker", item);

        if (oldOrientation === item.orientation) {
            return;
        } 

        $element.resizable("option", "handles", item.orientation === "vertical" ? "n, s" : "e, w")
    }

}


export let appCanvas = new AppCanvas();