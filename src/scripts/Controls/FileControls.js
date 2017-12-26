import $ from "jquery"
import moment from "moment"
import FileSaver from "file-saver"
import {siteModal} from "../Sections/SiteModal"
import store from "../store"

export default class FileControls {
    constructor() {
        this.$element = $("#FileControls")
        this.$save = this.$element.find("#SaveFile")
        this.$fileInput = this.$element.find("#FileChooser");
        this.$open = this.$element.find("#OpenFile")

        this.$save.on("click", this.saveFilePrompt.bind(this));
        this.$open.on("click", this.openFile.bind(this));
    }

    saveFilePrompt(e) {
        let prefix = "LABELMAKER_";
        let defaultProjectName = prefix + moment().format("YYYY-MM-DD-hh-mm-ss-a").toString();
        let extension = ".json";
        let filetype = "application/json=charset=utf-8";
        let projectName = prompt("Save project as", defaultProjectName);

        if (projectName == null || projectName == "" || projectName.trim().length === 0) {} 
        else {
            let fullFilename = projectName + extension
            FileSaver.saveAs(new Blob([JSON.stringify(store.getState())], {
                type: filetype
            }), fullFilename);
        }
    }


    openFile(e) {

    }

}

export let fileControls = new FileControls();