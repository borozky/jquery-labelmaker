import {assert, expect} from 'chai';
import {rootReducer} from '../scripts/store';
import {createStore} from 'redux';

function getRandomItem(items = []) {
    if(items.length === 0) {
        throw new Error("Items are empty");
    }
    return items[Math.floor(Math.random() * items.length)];
}

describe("ADD_CANVAS_ITEM" , function() {

    let store = createStore(rootReducer);

    beforeEach(function() {
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {
                x: 10,
                y: 10,
                type: "TEXT"
            }
        });
    });

    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("creates a canvas item", function() {
        let items = store.getState().canvas.items;
        assert.lengthOf(items, 1);
    });

    test("it populates ID when new canvas item is created", function() {
        let items = store.getState().canvas.items;
        assert.isString(items[0].id);
    });

    test("new item is automatically selected", function() {
        let items = store.getState().canvas.items;
        assert.isTrue(items[0].selected);
    });

    test("only newly added item is selected", function() {

        // add new items 3-8 items
        let times = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < times; i++) {
            store.dispatch({
                type: "ADD_CANVAS_ITEM",
                payload: { x: 10, y: 10, type: "ELLIPSE" }
            });
        }


        // assert all items except last one are NOT selected
        // last item has index of [length - 1]

        /** @type {object[]} $items */
        let items = store.getState().canvas.items; 
        let lastItem = items[items.length - 1];

        // [1, 2, 3, ..., n] -> n should be true, others should be false
        for(let i = 0; i < items.length; i++) {
            if (i < items.length - 1) {
                assert.isFalse(items[i].selected);
            } else {
                assert.isTrue(items[i].selected);
            }
        }
    });
});

describe("SELECT_SINGLE_CANVAS_ITEM", function() {
    let store = createStore(rootReducer);
    let itemIDs;

    beforeEach(function() {
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "LINE"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "TEXT", value: "Some text"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "BARCODE", value: "1231543450"}
        });
        itemIDs = store.getState().canvas.items.map(item => item.id);
    });

    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("throws error if ID is not specified", function() {
        assert.throw(function() {
            store.dispatch({
                type: "SELECT_SINGLE_CANVAS_ITEM",
                payload: {}
            })
        })
    });

    test("specified ID is then ONLY one selected", function() {
        let randomID = itemIDs[Math.floor(Math.random() * itemIDs.length)];
        store.dispatch({
            type: "SELECT_SINGLE_CANVAS_ITEM",
            payload: { id: randomID }
        });

        store.getState().canvas.items.forEach(item => {
            if (item.id === randomID) {
                assert.isTrue(item.selected);
            } else {
                assert.isFalse(item.selected);
            }
        });
    });
});

describe("UPDATE_CANVAS_ITEM", function() {
    let store = createStore(rootReducer);
    let itemIDs;

    beforeEach(function() {
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "LINE"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "TEXT", value: "Some text"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "BARCODE", value: "1231543450"}
        });
        itemIDs = store.getState().canvas.items.map(item => item.id);
    });

    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("throws error if ID is not specified", function() {
        assert.throw(function() {
            store.dispatch({
                type: "UPDATE_CANVAS_ITEM",
                payload: {}
            })
        })
    });

    test("item updates", function() {
        let randomID = getRandomItem(itemIDs);
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: randomID,
                x: 15,
                y: 20
            }
        });

        let item = store.getState().canvas.items.filter(item => randomID === item.id)[0];
        assert.strictEqual(item.x, 15);
        assert.strictEqual(item.y, 20);
    });
});

describe("REMOVE_SELECTED_ITEMS", function() {
    let store = createStore(rootReducer);
    let itemIDs;

    beforeEach(function() {
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "LINE"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "TEXT", value: "Some text"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "BARCODE", value: "1231543450"}
        });

        itemIDs = store.getState().canvas.items.map(item => item.id);

        store.dispatch({
            type: "SELECT_SINGLE_CANVAS_ITEM", 
            payload: { id: itemIDs[0], selected: true }
        });
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: { id: itemIDs[1], selected: true }
        })
    });

    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("selected items are removed", function() {

        // itemIDs[0] and itemIDs[1] are selected, itemIDs[2] is not selected

        store.dispatch({ type: "REMOVE_SELECTED_ITEMS" });
        let items = store.getState().canvas.items;
        assert.strictEqual(items.filter(item => item.id === itemIDs[0]).length, 0);
        assert.strictEqual(items.filter(item => item.id === itemIDs[1]).length, 0);
        assert.strictEqual(items.filter(item => item.id === itemIDs[2]).length, 1);
    });
});

describe("DELETE_CANVAS_ITEM", function() {
    let store = createStore(rootReducer);
    let itemIDs;

    beforeEach(function() {
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "LINE"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "TEXT", value: "Some text"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "BARCODE", value: "1231543450"}
        });

        itemIDs = store.getState().canvas.items.map(item => item.id);
    });

    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("throws error if ID is not specified", function() {
        assert.throw(function() {
            store.dispatch({
                type: "DELETE_CANVAS_ITEM",
                payload: {}
            })
        });
    });

    test("item with specified id is deleted", function() {
        store.dispatch({
            type: "DELETE_CANVAS_ITEM",
            payload: { id: itemIDs[0] }
        });

        // make sure only the item with id of itemIDs[0] is only deleted
        let items = store.getState().canvas.items;
        assert.strictEqual(items.filter(item => item.id === itemIDs[0]).length, 0);
        assert.strictEqual(items.filter(item => item.id === itemIDs[1]).length, 1);
        assert.strictEqual(items.filter(item => item.id === itemIDs[2]).length, 1);
    });
});


describe("UNSELECT_ALL_ITEMS", function() {
    let store = createStore(rootReducer);
    let itemIDs;

    beforeEach(function() {
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "LINE"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "TEXT", value: "Some text"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "BARCODE", value: "1231543450"}
        });

        itemIDs = store.getState().canvas.items.map(item => item.id);
    });

    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("all items are deselected", function() {
        store.dispatch({ type: "UNSELECT_ALL_ITEMS" });

        // make sure only the item with id of itemIDs[0] is only deleted
        let items = store.getState().canvas.items;
        items.forEach(item => {
            assert.isFalse(item.selected);
        })
    });
});

describe("REMOVE_ALL_ITEMS", function() {
    let store = createStore(rootReducer);
    let itemIDs;

    beforeEach(function() {
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "LINE"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "TEXT", value: "Some text"}
        });
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "BARCODE", value: "1231543450"}
        });

        itemIDs = store.getState().canvas.items.map(item => item.id);
    });

    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("all items removed", function() {
        store.dispatch({ type: "REMOVE_ALL_ITEMS" });
        assert.isEmpty(store.getState().canvas.items);
    });
});

describe("UPDATE_SETTINGS", function() {
    let store = createStore(rootReducer);
    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("settings updated", function() {
        store.dispatch({
            type: "UPDATE_SETTINGS",
            payload: {
                width: 10,
                height: 40,
                units: 'in'
            }
        });

        let settings = store.getState().settings;
        expect(settings).to.include({
            width: 10,
            height: 40,
            units: 'in'
        })
    });
});


describe("Placeholders", function() {
    let store = createStore(rootReducer);
    let itemIDs;

    beforeEach(function() {
        store.dispatch({
            type: "ADD_CANVAS_ITEM",
            payload: {x:10, y:10, type: "TEXT", value: "TEXT"}
        });

        itemIDs = store.getState().canvas.items.map(item => item.id);
    });

    afterEach(function() {
        store = createStore(rootReducer);
    });

    test("Detect placeholder for string: {{anystring}}", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "{{sampletext}}"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.include.members(["{{sampletext}}"])
    });

    test("Detect placeholder for string: {{snake_case}}", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "{{sample_text}}"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.include.members(["{{sample_text}}"])
    });

    test("Detect placeholder for string: {{kebab-case}}", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "{{sample-text}}"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.include.members(["{{sample-text}}"])
    });

    test("Detect placeholder for string: {{0123456789}}", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "{{0980}}"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.include.members(["{{0980}}"])
    });

    test("Do not detect placeholders for normal values", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "Normal values"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.have.lengthOf(0);
    });

    test("Do not detect placeholders for: {{}}", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "{{}} without items inside curly braces"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.have.lengthOf(0);
    });

    test("Do not detect placeholders for: {{  }}", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "{{  }} with spaces only inside curly braces"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.have.lengthOf(0);
    });

    test("Do not detect placeholders with inner spaces: {{ test }}", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "{{ test }}"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.have.lengthOf(0);
    });

    test("Detect multiple placeholders", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "{{sample-text}} {{another}}"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.include.members(["{{sample-text}}", "{{another}}"])
    });


    test("Detect duplicate placeholders", function() {
        store.dispatch({
            type: "UPDATE_CANVAS_ITEM",
            payload: {
                id: itemIDs[0],
                value: "{{same}} {{same}} {{another}}"
            }
        });

        let placeholders = store.getState().canvas.placeholders;
        expect(placeholders).to.have.members(["{{same}}", "{{another}}"]);
        expect(placeholders).to.have.lengthOf(2);
    });

});
