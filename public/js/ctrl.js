/*		GLOBAL ASSETS		*/

const q = name => document.getElementById(name);
const qs = name => document.querySelectorAll(name);


/*  UI Builder */
 
const ui_builder = () => {
    let els = document.querySelectorAll('[data-ui]'), ui = [], insert_into = ui;
 
    for (let i = 0; i < els.length; i++) {
        let group = els[i].getAttribute('data-ui-group');
 
        if (group) {
            if (!ui['g_' + group]) {
                ui['g_' + group] = [];
            }
 
            insert_into = ui['g_' + group];
        }
        else {
            insert_into = ui;
        }
 
        insert_into[els[i].getAttribute('data-ui')] = els[i];
    }
 
    return ui;
};