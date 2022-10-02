var sc_vars = []
var path_attr_map = {}

let var_display = document.querySelector("#vardisplay");

let bool_template = document.querySelector("#boolean_card_template");
let numb_template = document.querySelector("#number_card_template");
let string_template = document.querySelector("#string_card_template");
let object_template = document.querySelector("#object_card_template");
let searchbar = document.querySelector("#searchbar")

const base_var_path  = "window.wrappedJSObject.SugarCube.State.active.variables";

class Attr_Var {


    varname;
    varval;
    vartype;


    constructor(varname, vartype, varval) {
        this.varname = varname;
        this.vartype = vartype;
        this.varval = varval;
    }


}


function updateSearchView() {
    let term = searchbar.value;
    let allpaths = Object.keys(path_attr_map);
    let counter = 0;
    let locked_views = {};

    console.log("----------------------------------------------");
    console.log("searching for term: " + term);
    console.log("----------------------------------------------");
    for (let i = 0; i < allpaths.length; i++) {
        let path = allpaths[i];
        if (path.includes(term)) {
            counter++;
            //console.log("-----------------------");
            //console.log("found term in path: " + path);
            document.querySelector("#" + path).style.display = "block";
            let path_fragments = path.split("-");
            if (path_fragments.length > 1){
                for (let j = path_fragments.length - 2; j >= 0; j--) {
                    //console.log("adding to locked views: " + path_fragments[j]);
                    if (j > 0){
                        let parent_path = "";
                        for (let k = 0; k <= j; k++) {
                            parent_path += path_fragments[k];
                            if( k != j) parent_path += "-";
                        }
                    } else {
                        locked_views[path_fragments[j]] = true;
                    }
                }
            }
        } else {
            document.querySelector("#" + path).style.display = "none";
        }

    }
    console.log("found " + counter + " elements");


    console.log("----------------------------------------------");
    console.log("showing implicit views");
    console.log("----------------------------------------------");
    for (const path in locked_views) {
        //console.log("making view " + path + " visible");
        document.querySelector("#" + path).style.display = "block";
    }
}

function unsetBoolVar() {
    let varcard = this.parentNode;
    let falsebtn = this;
    let path = varcard.querySelector(".varpath").innerHTML.replaceAll("-", ".");

    console.log("set " + path + " to false");
    const unsetcode = "console.log(window.wrappedJSObject.SugarCube.State.active.variables." + path + " = false)";
    const executing = browser.tabs.executeScript({
        code: unsetcode
    });
    executing.then(() => {
        let truebtn = varcard.querySelector(".truebtn");
        truebtn.classList.remove("btn-primary");
        truebtn.classList.add("btn-outline-primary");
        falsebtn.classList.remove("btn-outline-primary");
        falsebtn.classList.add("btn-primary");
    })

}

function setBoolVar() {
    let varcard = this.parentNode;
    let truebtn = this;
    let path = varcard.querySelector(".varpath").innerHTML.replaceAll("-", ".");
    console.log("set " + path + " to true");
    const setcode = "console.log(" + base_var_path + "." + path + " = true)";
    const executing = browser.tabs.executeScript({
        code: setcode
    });
    executing.then(() => {
        let falsebtn = varcard.querySelector(".falsebtn");
        falsebtn.classList.remove("btn-primary");
        falsebtn.classList.add("btn-outline-primary");
        truebtn.classList.remove("btn-outline-primary");
        truebtn.classList.add("btn-primary");
    })
}

function setNumbVar() {
    let varcard = this.parentNode.parentNode.parentNode;
    let path = varcard.querySelector(".varpath").innerHTML.replaceAll("-", ".");
    let val = varcard.querySelector("input").value;

    console.log("set " + path + " to " + val);

    const setcode = "console.log(" + base_var_path + "." + path + " = " + val + ")";
    const executing = browser.tabs.executeScript({
        code: setcode
    });
}

//TODO: last button
function keepNumbVar() {
    let varcard = this.parentNode.parentNode.parentNode;
    let path = varcard.querySelector(".varpath").innerHTML.replaceAll("-", ".");
    console.log("keep " + path + " at value");

}

function setStringVar() {
    let varcard = this.parentNode.parentNode.parentNode;
    let path = varcard.querySelector(".varpath").innerHTML.replaceAll("-", ".");
    let val = varcard.querySelector("input").value;
    console.log("set " + path + " to " + val);

    const setcode = "console.log(" + base_var_path + "." + path + " = '" + val + "')";
    const executing = browser.tabs.executeScript({
        code: setcode
    });
}

function toggle_collapse() {
    let toggle_list = this.parentNode.querySelector(".object_content");
    if (this.classList.contains("btn-primary")) {
        this.innerHTML = "Hide Content";
        this.classList.remove("btn-primary");
        this.classList.add("btn-outline-primary");
        toggle_list.style.display = "block";
    } else {
        this.classList.remove("btn-outline-primary");
        this.classList.add("btn-primary");
        this.innerHTML = "Show Content";
        toggle_list.style.display = "none";
    }
}


function recursivelyDisplayVars(varHolderAttr, varHolderElement, holderName = null) {
    //console.log("reached recursive Display");
    let prefix = "";
    if (holderName != null) {
        prefix = holderName + "-";
    }
    for (let i = 0; i < varHolderAttr.length; i++) {
        let attr = varHolderAttr[i];
        let name = attr.varname;
        let type = attr.vartype;
        let value = attr.varval;
        let targetElement;
        let varname_element;
        let value_element;
        let path_element;
        let btnset;
        let absolute_path = prefix + name;
        switch (type) {
            case "number":
                targetElement = numb_template.cloneNode(true).content;
                value_element = targetElement.querySelector("input");

                btnset = targetElement.querySelector(".setter");
                let btn_keep = targetElement.querySelector(".keeper");
                btnset.addEventListener("click", setNumbVar);
                btn_keep.addEventListener("click", keepNumbVar);
                value_element.value = value;
                break;
            case "string":
                targetElement = string_template.cloneNode(true).content;
                btnset = targetElement.querySelector("button");
                value_element = targetElement.querySelector("input");
                btnset.addEventListener("click", setStringVar);
                value_element.value = value;
                break;
            case "boolean":
                targetElement = bool_template.cloneNode(true).content;
                btnset = targetElement.querySelector(".truebtn");
                let btnunset = targetElement.querySelector(".falsebtn");
                if (!value) {
                    value_element = btnset;
                } else {
                    value_element = btnunset;
                }
                btnset.addEventListener("click", setBoolVar);
                btnunset.addEventListener("click", unsetBoolVar);

                value_element.classList.remove("btn-outline-primary");
                value_element.classList.add("btn-primary");
                break;
            case "object":
                targetElement = object_template.cloneNode(true).content;
                let btn = targetElement.querySelector("button");
                btn.addEventListener("click", toggle_collapse);
                try {
                    let inner_display = targetElement.querySelector(".object_content");

                    recursivelyDisplayVars(value, inner_display, absolute_path);
                } catch (e) {
                    console.log(e);
                    inner_display.innerHTML = "<p style='margin-left=10px'>error loading</p>"
                }
                break;
        }
        path_element = targetElement.querySelector(".varpath");
        varname_element = targetElement.querySelector(".card-title");
        path_element.innerHTML = absolute_path;
        //path_element.hidden = false;
        varname_element.innerHTML = name;
        targetElement.querySelector("div").id = absolute_path;
        varHolderElement.append(targetElement);
        path_attr_map[absolute_path] = attr;
    }
}


function parseVars(varObj) {
    //console.log("reached parseVars with: ");
    //console.log(varObj);
    let vars = []
    if (varObj == null) return vars;
    let keys = Object.keys(varObj);
    //console.log("got keys: ");
    //console.log(keys)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        //console.log("parsing key: " + key)
        let value = varObj[key];
        let type = typeof value;
        let attr_obj
        //console.log("parsing "+ key + ":  val:" + value + ", type:" + type + ";");
        switch (type) {
            case "number":
            case "string":
            case "boolean":
                attr_obj = new Attr_Var(key, type, value);
                vars.push(attr_obj);
                break;
            case "object":
                let subvars = parseVars(value);
                attr_obj = new Attr_Var(key, type, subvars);
                vars.push(attr_obj);
                break;
        }
        //console.log("finished parsing key: " + key);

    }
    //console.log("finished parsing obj");
    return vars;
}


function initSearch() {
    //console.log(searchbar);
    searchbar.addEventListener("input", updateSearchView);
}

function onExecuted(result) {
    //console.log("reached on Executed");
    //console.log(result);
    if (result.length > 0) {
        let returned_sc_vars = result[0];
        if (returned_sc_vars !== undefined) {
            sc_vars = parseVars(returned_sc_vars);
            //console.log(sc_vars);
            //displayAllVars();
            recursivelyDisplayVars(sc_vars, var_display);
            initSearch();
        }
    }
}


function onError(err) {
    console.error(err);
}


function execute_script() {
    const executing = browser.tabs.executeScript({
        file: "/content_scripts/sc_var_editor.js"
    });
    executing.then(onExecuted, onError);
}


try {
    execute_script();
} catch (e) {
    console.error(e);
}

