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

        let value = item.value.toString();

        if(value.indexOf("{{") === -1 ) {
            return;
        }

        if (value.indexOf("}}") === -1) {
            return;
        }

        const regex = /\{\{[A-Za-z0-9_-]+\}\}/g;
        const str = value;
        let m;

        while ((m = regex.exec(str)) !== null) { // eslint-disable-line
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
            break
        case "REMOVE_ALL_ITEMS":
            items = []
            break;
        default: 
            return state; // eslint-disable-line
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
    build: () => 2
});

export const rootReducer = (state, action) => {
    if (action.type === "LOAD_NEW_STATE") {
        state = {
            ...action.payload,
            canvas: {
                ...action.payload.canvas,
                placeholders: action.payload.canvas.placeholders ? action.payload.canvas.placeholders : []
            }
        }
    }
    return appReducer(state, action);
}

const stateLogger = store => next => action => {
    let result;
    result = next(action);
    return result;
}

export default createStore(rootReducer, applyMiddleware(stateLogger));