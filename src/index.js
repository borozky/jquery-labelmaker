import registerServiceWorker from './registerServiceWorker';
import $ from "jquery";
import "jquery-ui-bundle";
import "./scripts/drag-multiple";
import ruler from "./scripts/ruler";

import Defaults from "./scripts/Defaults";
import {AppCanvas, appCanvas} from "./scripts/AppCanvas";

import "./styles/index.css";

let myRuler = new ruler({
    container: document.getElementById('CanvasRuler'),
    rulerHeight: 15, // thickness of ruler
    fontFamily: 'arial',// font for points
    fontSize: '7px', 
    strokeStyle: 'black',
    lineWidth: 1,
    enableMouseTracking: true,
    enableToolTip: true
});

$(function(){
    // let text = new Text("Text", {});
    // text.move(10, 10);
    // text.set("value", "item", function() {});
    // text.remove(function() {});

    // let textBox = new Textbox("Lorem ipsum dolor sit amet", {});
    // textBox.setSize(10, 10, function() {})
    // let rectangle = new Rectangle(10, 10, {});

    // let appCanvas = new AppCanvas($("#AppCanvas"), {
    //     width: 1024,
    //     height: 1024,
    //     onItemAdded: function(e, item) {},
    //     onResize: function(e, size) {},
    //     onItemSelected: function(){},
    //     onMultipleItemsSelected: function(){},
    //     onItemMoved: function(e, item) {},
    //     onMultipleItemsMoved: function(e, items) {},
    //     onItemDeleted: function(e, item) {},
    //     onItemsDeleted: function(e, items) {}
    // });
    // appCanvas.resize(1024, 1024);
    // appCanvas.addItem(text);

    // let leftSidebar = new LeftSidebar($("#LeftSidebar"), {
    //     onCreate: function(){}
    // });
    // leftSidebar.registerItemType("Name", "img", function() {});

    // let rightSidebar = new RightSidebar($("#RightSidebar"), {
    // });
    // rightSidebar.displayAllControls();
    // rightSidebar.hideAllControls();
    // rightSidebar.displayControlsFor();

    // let barcodeControls = new BarcodeControls($("#BarcodeControls"), {
    //     onItemSet: function(item) {},
    //     onUpdate: function(item, newValue){},
    // });

    window.appCanvas = appCanvas;
    document.body.setAttribute("class", "loaded");
});



registerServiceWorker();
