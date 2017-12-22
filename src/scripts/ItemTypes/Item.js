import $ from "jquery";
import "jquery-ui-bundle";
import {appCanvas} from "../AppCanvas";

export default class Item {

    options = {
        x: 10,
        y: 10,
        backgroundColor: "transparent",
        value: null,
        fontFamily:"Arial",
        fontSize: 20,
        type: null,
        textAlign: "left"
    }
    

    constructor(type, options = {}) {
        let self = this;

        self.type = type;
        self.$element = $("<div />");
        self.options = {
            ...self.options, 
            type: type,
            ...options, 
        }

        self.$element.addClass("canvas-item");

        if(self.options.type) {
            self.$element.addClass(self.options.type.toString().toLowerCase());
            self.$element.attr("data-type", self.options.type.toString());
        }

        self.$element.css({
            position: "absolute",
            left: self.options.x,
            top: self.options.y,
            backgroundColor: self.options.backgroundColor,
            fontFamily: self.options.fontFamily,
            fontSize: self.options.fontSize,
            ...options
        });

        self.$element.draggable({
            multiple: true,
            start: function(event, ui) {
                let selected = [self];
                $(this).addClass("ui-selected");
                $(this).siblings(".ui-selected").each(function() {
                    selected.push( $(this).data("labelmaker") );
                });
                if (selected.length === 1) {
                    appCanvas.selectOne(self);
                }
                else if (selected.length > 1) {
                    appCanvas.selectMany(selected);
                }
            }
        });
        
        self.$element.on("click", function(e) {
            if (!e.metaKey && !e.shiftKey) {
                // if command key is pressed don't deselect existing elements
                $(this).parent().find(".ui-selected").removeClass("ui-selected");
                $(this).addClass("ui-selected");
            }
            else {
                if ($(this).hasClass("ui-selected")) {
                    $(this).removeClass("ui-selected");
                }
                else {
                    $(this).addClass("ui-selected");
                }
            }
            
            appCanvas.selectOne(self);

        });

        self.$element.data("labelmaker", self);
    }


    set(prop, value, callback = function(){}) {
        this.options[prop] = value;
        callback(this);
    }
    
    move(x, y, callback = function(){}) {
        this.set("x", x);
        this.set("y", y);
        this.$element.css({
            position: "absolute",
            left: x,
            top: y
        });
        callback(this);
    }

    offset(dx, dy, callback = function(){}) {
        this.set("x", this.x + dx);
        this.set("y", this.y + dy);
        this.$element.css({
            position: "absolute",
            left: this.x,
            top: this.y
        });
        callback(this);
    }

    setValue(newValue, callback = function(){}) {
        this.set("value", newValue, callback());
    }
}