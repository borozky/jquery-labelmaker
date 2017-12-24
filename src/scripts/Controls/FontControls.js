import $ from "jquery";
import {appCanvas} from "../AppCanvas";
import RightSidebarControls from "./RightSidebarControls"

export default class FontControls extends RightSidebarControls {

    constructor(options) {
        super( $("#FontControls"), {
            ...options,
            value: "",
            fontFamily: "Segoe UI",
            fontSize: 20,
            bold: false,
            italic: false,
            underline: false,
            textAlign: "left",
            color: "#000000",
            lineHeight: 1.0,
            letterSpacing: "1px"
        })
        this.item = null;

        this.$value = this.$element.find("input[name='content']");
        this.$fontFamily = this.$element.find("#FontFamily");
        this.$fontSize = this.$element.find("input[name='font-size']");
        this.$fontStyles = this.$element.find(".font-style");
        this.$fontAlignments = this.$element.find(".font-alignment");
        this.$fontColor = this.$element.find("input[name='color']");
        this.$letterSpacing = this.$element.find("input[name='letter-spacing']");
        this.$lineHeight = this.$element.find("input[name='line-height']");

        let self = this;
        this.$value.on("input changed paste keyup", this.valueChanged.bind(this));
        this.$fontFamily.on("input change paste keyup", this.fontFamilyChanged.bind(this));
        this.$fontSize.on("input change paste keyup", this.fontSizeChanged.bind(this));

        this.$fontStyles.on("mousedown", function() {
            if (self.item == null) {
                console.error("item not set");
                return;
            }

            const val = $(this).attr("data-value");
            switch(val) {
                case "bold":
                    if (self.item.options.fontWeight == "bold") {
                        self.item.set("fontWeight", "normal");
                        $(this).removeClass("active");
                        break;
                    }

                    self.item.set("fontWeight", "bold");
                    $(this).addClass("active");
                    break;

                case "italic":
                    if (self.item.options.fontStyle == "italic") {
                        self.item.set("fontStyle", "normal");
                        $(this).removeClass("active");
                        break;
                    }

                    self.item.set("fontStyle", "italic");
                    $(this).addClass("active");
                    break;

                case "underline":
                    if (self.item.options.textDecoration == "underline") {
                        self.item.set("textDecoration", "none");
                        $(this).removeClass("active");
                        break;
                    }

                    self.item.set("textDecoration", "underline");
                    $(this).addClass("active");
                    break;

                default:
                    console.error("Invalid font style: "+ val);
                    return;
            }

            self.options.onUpdate(self.item);
        });

        this.$fontAlignments.on("click", function() {
            if (self.item == null) {
                console.error("item not set");
                return;
            }

            let alignment = $(this).attr("data-value");
            self.item.options = {
                ...self.item.options,
                textAlign: alignment
            }
            $(this).addClass("active").siblings(".active").removeClass("active");
            self.options.onUpdate(self.item);

        });

        this.$lineHeight.on("input change paste keyup", this.lineHeightChanged.bind(this));
        this.$letterSpacing.on("input change paste keyup", this.letterSpacingChanged.bind(this));
        this.$fontColor.on("input change paste keyup", this.fontColorChanged.bind(this));

    }

    valueChanged(e) {
        if ( ! this.item) {
            return;
        }

        this.item.setValue(e.target.value);
        this.options.onUpdate(this.item);
    }

    fontSizeChanged(e) {
        if ( ! this.item) {
            return;
        }

        this.item.set("fontSize", Number(e.target.value));
        this.options.onUpdate(this.item);
    }

    fontFamilyChanged(e) {
        if ( ! this.item) {
            return;
        }
        this.item.set("fontFamily", e.target.value);
        this.options.onUpdate(this.item);
    }

    lineHeightChanged(e) {
        if ( ! this.item) {
            return;
        }

        this.item.set("lineHeight", Number(e.target.value));
        this.options.onUpdate(this.item);
    }

    letterSpacingChanged(e) {
        if ( ! this.item) {
            return;
        }

        this.item.set("letterSpacing", Number(e.target.value));
        this.options.onUpdate(this.item);
    }

    fontColorChanged(e) {
        if ( ! this.item) {
            return;
        }

        this.item.set("color", "#" + e.target.value);
        this.options.onUpdate(this.item);
    }

    

    setItem(item) {
        this.item = item;
        this.$value.val(item.options.value);
        this.$fontFamily.val(item.options.fontFamily);
        this.$fontSize.val(item.options.fontSize);
        this.$fontColor.val(item.options.color);
        this.$lineHeight.val(item.options.lineHeight);
        this.$letterSpacing.val(item.options.letterSpacing);
        this.$element.show();
        this.options.onItemSet(item);
    }
}

export let fontControls = new FontControls({
    onItemSet: function(item) {
        
    },
    onUpdate: function(item) {
        console.log("FontControls.onupdate", item.options);
        switch(item.type) {
            case "TEXT":
            case "TEXTBOX":
            case "DATE":
                console.log({...item.options});
                item.$element.css({...item.options});
                item.$element.find(".value").html(item.options.value);
                break;
        }
        console.log("fontControls.onUpdate", item);
    },
})

window.fontControls = fontControls;