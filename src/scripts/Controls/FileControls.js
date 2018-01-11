import $ from 'jquery';
import moment from 'moment';
import FileSaver from 'file-saver';
import store from '../store';

export default class FileControls {
    constructor() {
        this.$element = $("#FileControls");
        this.$save = this.$element.find("#SaveFile");
        this.$fileInput = this.$element.find("#FileChooser");
        this.$open = this.$element.find("#OpenFile");

        this.$save.on("click", this.saveFilePrompt.bind(this));
        this.$open.on("click", this.openFile.bind(this));
    }

    /**
     * @param {JQuery.Event} e 
     */
    saveFilePrompt(e) {
        e.stopImmediatePropagation();

        let prefix = "LABELMAKER_";
        let defaultProjectName = prefix + moment().format("YYYY-MM-DD-hh-mm-ss-a").toString();
        let extension = ".json";
        let filetype = "application/json=charset=utf-8";
        let projectName = prompt("Save project as", defaultProjectName);

        if (projectName === null || projectName === "" || projectName.trim().length === 0) {} 
        else {
            let fullFilename = projectName + extension
            FileSaver.saveAs(new Blob([JSON.stringify(store.getState())], {
                type: filetype
            }), fullFilename);
        }
    }


    /**
     * @param {JQuery.Event} e 
     */
    openFile(e) {
        e.preventDefault();

        this.$fileInput.click();
        this.$fileInput.on("change", e => {
            e.stopImmediatePropagation();

            if (e.target.files.length === 0) {
                return;
            }

            let file = e.target.files[0];
            if (file.name.split('.').pop() !== "json") {
                alert("Error: You must select a JSON file");
                return;
            }

            if (file.length === 0) {
                alert("Error: The file selected has no contents");
                return;
            }

            var reader = new FileReader();
            reader.onload = event => {
                let state = JSON.parse(event.target.result);

                if (typeof state.settings === "undefined" || typeof state.canvas === "undefined") {
                    alert("File contents are invalid");
                    return;
                }

                if (state.build && state.build > 0) {

                    store.dispatch({
                        type: "LOAD_NEW_STATE", 
                        payload: state
                    })
    
                    // IMPORTANT to clear out selected file or else 
                    // selecting the same file will not trigger "onChange" event
                    this.$fileInput[0].value = null;

                } else {
                    alert("Sorry, the project metadata is not compatible with the version of this application");
                    return;
                }
                

            }

            reader.readAsText(file);
            
        })
    }
}

export let fileControls = new FileControls();