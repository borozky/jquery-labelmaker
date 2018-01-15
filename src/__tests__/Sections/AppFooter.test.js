import $ from 'jquery';
import {assert} from 'chai';
import _store, {rootReducer} from '../../scripts/store';
import { createStore } from 'redux';
import AppFooter from '../../scripts/Sections/AppFooter';
import {CanvasItemGenerator} from '../../scripts/generators';


describe("AppFooter tests", function() {

    let appFooter, $appFooterMock, $coordinatesMock, store = _store;

    beforeEach(function() {
        store = createStore(rootReducer);
        $appFooterMock = $(`<div id="AppFooter"></div>`);
        $coordinatesMock = $(`<div id="Coordinates"></div>`)
        appFooter = new AppFooter($appFooterMock, $coordinatesMock, store);

        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {...CanvasItemGenerator.makeText()}
        })
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {...CanvasItemGenerator.makeTextbox()}
        })
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {...CanvasItemGenerator.makeDate()}
        })
    });

    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("App footer display coordinates when new item is added", function() {
        assert.equal(appFooter.$coordinates[0].innerHTML, `x: ${CanvasItemGenerator.defaults.left}, y: ${CanvasItemGenerator.defaults.top}`);
    });

    test("App footer updates coordinates when an item is selected", function() {
        let items = store.getState().canvas.items;
        store.dispatch({
            type: "SELECT_SINGLE_CANVAS_ITEM",
            payload: { id: items[2].id }
        });

        assert.equal(appFooter.$coordinates[0].innerHTML, `x: ${items[2].left}, y: ${items[2].top}`);
    });

    test("App footer updates coordinates when an item is moved", function() {
        let items = store.getState().canvas.items;
        let index = 1;
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: { id: items[index].id, left: 0, top: 100 }
        });

        assert.equal(appFooter.$coordinates[0].innerHTML, `x: ${items[index].left}, y: ${items[index].top}`);
    });

    test("App footer clears coordinates when all items deselected", function() {
        store.dispatch({ type: "UNSELECT_ALL_ITEMS" })
        assert.equal(appFooter.$coordinates[0].innerHTML, "");
    });

    
})