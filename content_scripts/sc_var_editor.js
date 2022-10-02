{
    let sc_specific = true; // --> for the other mode to work you need to change the base_var_path in popup.js
    let wrappedJSObject = window.wrappedJSObject;
    if (sc_specific) {
        let sugarCube = wrappedJSObject.SugarCube;
        //console.log(test)
        let vars_sc = sugarCube.State.active.variables;
        vars_sc;
    } else {
        // TODO: support for all JS-Objects, currently broken
        let transferContainer = {};
        let js_keys = Object.keys(wrappedJSObject);

        for (let key in wrappedJSObject) {
            if(key == "self" || key == "external" || key == "document") continue;
            if (Object.prototype.hasOwnProperty.call(wrappedJSObject, key)) {
                let val = wrappedJSObject[key];
                if (typeof val == "object")
                    transferContainer[key] = val;
            }
        }
        console.log(transferContainer);
        wrappedJSObject.SugarCube;
    }
}

