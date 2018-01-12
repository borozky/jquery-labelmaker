import $ from 'jquery';
import store from '../store';
import moment from 'moment';

export class ItemNavigation {
    constructor() {
        this.$element = $("#ItemNavigation");
        this.suffix = "_REF";
        let self = this;

        $("#ItemNavigation").on("click", "li", function(e) {
            self.handleItemRefClicked(this, e);
        });
        
        store.subscribe(() => {
            let items = store.getState().canvas.items;

            // remove an item based on existing IDs
            let itemIDs = items.map(item => item.id);
            self.$element.find("li").each(function() {
                let id = $(this).attr("id").replace(self.suffix, "");   // #ItemNavigation>li will have their IDs suffixed with '_REF'
                if (itemIDs.indexOf(id) === -1) {
                    $(this).remove();
                }
            })


            // add or update item
            items.forEach(item => {
                let idToFind = `#${item.id}${this.suffix}`;
                let $itemRef = self.$element.find(idToFind);

                // create item if doesn't exists
                if($itemRef.length === 0) {
                    self.addItem(item);
                }

                // update item
                else {
                    self.updateItem($itemRef, item);
                }
            });
        });
    }

    addItem(item = {}) {
        let itemvalue = item.id;
        switch(item.type) {
            case "TEXT":
            case "TEXTBOX":
            case "BARCODE":
                itemvalue = item.value.toString();
                break;
            case "DATE":
                itemvalue = moment(item.value, "DD-MM-YYYY hh:mm:ss a").format(item.format);
                break;
            default:
                break;
        }

        let $elem = $(`<li id="${item.id}_REF" data-ref-id="${item.id}" class="${item.type.toLowerCase()}" data-type="${item.type}">${itemvalue}</li>`);
        $elem.data("labelmaker", item);
        this.$element.append($elem);

        if (item.selected) {
            $elem.addClass("selected");
        } else {
            $elem.removeClass("selected");
        }
    }


    /**
     * @param {JQuery<HTMLElement>} $itemRef 
     * @param {object} item 
     */
    updateItem($itemRef, item) {
        if ($itemRef.data("labelmaker") === item) {
            return;
        }

        let itemvalue = item.id;
        switch(item.type) {
            case "TEXT":
            case "TEXTBOX":
            case "BARCODE":
                if(item.value.toString().trim().length > 0) {
                    itemvalue = item.value.toString();
                }
                break;
            case "DATE":
                let val = moment(item.value, "DD-MM-YYYY hh:mm:ss a").format(item.format);
                if (val.length > 0) {
                    itemvalue = val;
                }
                break;
            default:
                break;
        }

        $itemRef.html(itemvalue);

        if (item.selected) {
            $itemRef.addClass("selected");
        } else {
            $itemRef.removeClass("selected");
        }
    }


    /**
     * @param {HTMLElement} $element  
     * @param {JQuery.Event<HTMLElement, null>} e 
     */
    handleItemRefClicked($element, e) {
        let refID = $($element).attr("data-ref-id");
        store.dispatch({
            type: "SELECT_SINGLE_CANVAS_ITEM",
            payload: {
                id: refID
            }
        });
    }
}

export let itemNavigation = new ItemNavigation();