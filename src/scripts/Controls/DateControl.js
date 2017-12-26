import $ from "jquery";
import store from "../store";
import moment from "moment";
import {siteModal} from "../Sections/SiteModal";
import "../../../node_modules/jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css";

require("jquery-ui-timepicker-addon");

export default class DateControl {

    constructor() {
        this.$element = $("#DatepickerControl");
        this.$date = this.$element.find("input[name='date']");
        this.$format = this.$element.find("input[name='format']");
        this.$formatHelpLink = this.$element.find("#FormatHelpLink");
        this.$date.datetimepicker({
            showSecond: true,
            timeFormat: "hh:mm:ss tt"
        });

        this.$date.on("input change paste keyup", this.valueChanged.bind(this));
        this.$format.on("input change paste keyup", this.formatChanged.bind(this));

        this.$formatHelpLink.on("click", function(e) {
            e.preventDefault();
            siteModal.open();
        })

        store.subscribe(() => {
            let selectedItems = store.getState().canvas.items.filter(item => item.selected);
            if (selectedItems.length === 1 && selectedItems[0].type === "DATE") {
                this.setItem(selectedItems[0]);
            }
        });
    }

    valueChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                value: e.target.value
            }
        })
    }

    formatChanged(e) {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: this.item.id,
                format: e.target.value
            }
        })
    }

    setItem(item) {
        this.item = item;
        this.$date.val(item.value.replace(",", ""));
        this.$format.val(item.format)
    }
}

export let dateControl = new DateControl();