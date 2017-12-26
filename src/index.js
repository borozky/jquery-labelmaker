import registerServiceWorker from './registerServiceWorker';
import $ from "jquery";
import "jquery-ui-bundle";
import "./scripts/drag-multiple";
import ruler from "./scripts/ruler";
import Defaults from "./scripts/Defaults";
import {app} from "./App";
import "./styles/index.css";


window.jQuery = $;
require("jquery-ui-touch-punch");

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
    window.appCanvas = app.AppCanvas;
    document.body.setAttribute("class", "loaded");
});



registerServiceWorker();
