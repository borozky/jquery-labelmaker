import _ from "lodash";
import {combineReducers, createStore, applyMiddleware} from "redux";

const initialCanvasState = {
    items: []
}
const initialSettingsState = {
    width: 4,
    height: 6,
    units: "in",
}

export function canvas(state = initialCanvasState, action = {}) {
    switch (action.type) {
        case "ADD_CANVAS_ITEM":
            return {...state, 
                items: state.items.concat({
                    ...action.payload,
                    id: `${action.payload.type}_${_.uniqueId()}`
                })
            };
        case "SELECT_SINGLE_CANVAS_ITEM":
            if(typeof action.payload.id === "undefined") {
                throw new Error("payload.id is missing");
            }
            return {
                ...state,
                items: state.items.map(item => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            selected: true
                        }
                    }
                    return {
                        ...item, selected: false
                    }
                })
            }
        case "UPDATE_CANVAS_ITEM":
            if(typeof action.payload.id === "undefined") {
                throw new Error("payload.id is missing");
            }
            return {
                ...state,
                items: state.items.map(item => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            ...action.payload
                        };
                    }
                    return item
                })
            }
        case "REMOVE_SELECTED_ITEMS":  
            return {
                ...state,
                items: state.items.filter(item => !item.selected)
            }
        case "DELETE_CANVAS_ITEM":
            if(typeof action.payload.id === "undefined") {
                throw new Error("payload.id is missing");
            }
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id)
            }
        case "UNSELECT_ALL_ITEMS":
            return {
                ...state,
                items: state.items.map(item => ({
                    ...item, selected: false
                }))
            }
        default:
            return state
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