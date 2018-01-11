import _ from "lodash";
import {combineReducers, createStore, applyMiddleware} from "redux";

const initialCanvasState = {
    items: [],
    placeholders: [],
}
const initialSettingsState = {
    width: 4,
    height: 6,
    units: "in",
}

/** @returns {string[]} */
function getPlaceholders(items = []) {
    let placeholders = new Set();

    items.forEach(item => {
        if(typeof item.value === "undefined" || item.value === null) {
            return;
        }

        if(item.value.indexOf("{{") === -1 ) {
            return;
        }

        if (item.value.indexOf("}}") === -1) {
            return;
        }

        const regex = /\{\{[A-Za-z0-9_-]+\}\}/g;
        const str = item.value;
        let m;

        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach((match, groupIndex) => {
                placeholders.add(match);
            });
        }
    });
    return [...placeholders];
}


export function canvas(state = initialCanvasState, action = {}) {
    let items = [];
    let placeholders = [];

    switch (action.type) {
        case "ADD_CANVAS_ITEM":
            items = state.items
                    .map(item => ({...item, selected: false}))  // deselect all items
                    
                    // select newly added item
                    .concat({
                        ...action.payload,
                        id: `${action.payload.type}_${_.uniqueId()}`,
                        selected: true
                    });
            break;

        case "SELECT_SINGLE_CANVAS_ITEM":
            if(typeof action.payload.id === "undefined") {
                throw new Error("payload.id is missing");
            }

            items =  state.items.map(item => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        selected: true
                    }
                }
                return {
                    ...item, 
                    selected: false
                }
            });
            break;

        case "UPDATE_CANVAS_ITEM":
            if(typeof action.payload.id === "undefined") {
                throw new Error("payload.id is missing");
            }
            items = state.items.map(item => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        ...action.payload
                    };
                }
                return item
            });
            break;

        case "REMOVE_SELECTED_ITEMS":  
            items = state.items.filter(item => !item.selected);
            break;
            

        case "DELETE_CANVAS_ITEM":
            if (typeof action.payload.id === "undefined") {
                throw new Error("payload.id is missing");
            }

            items = state.items.filter(item => item.id !== action.payload.id)
            break;

        case "UNSELECT_ALL_ITEMS":
            items = state.items.map(item => ({
                ...item, selected: false
            }));

        default:
            return state;
    }

    return {
        ...state,
        items: items,
        placeholders: getPlaceholders(items)
    }
}

export function settings(state = initialSettingsState, action = {}) {
    switch(action.type) {
        case "UPDATE_SETTINGS":
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

let appReducer = combineReducers({
    canvas: canvas,
    settings: settings,
    build: () => 1
});

const rootReducer = (state, action) => {
    if (action.type === "LOAD_NEW_STATE") {
        state = action.payload
    }
    return appReducer(state, action);
}

const stateLogger = store => next => action => {
    let result;
    console.groupCollapsed(`DISPATCHING ${action.type}`);
    console.log("State BEFORE ACTION", store.getState());
    result = next(action);
    console.log("State AFTER ACTION", store.getState());
    console.groupEnd();
    return result;
}

export default createStore(rootReducer, applyMiddleware(stateLogger));