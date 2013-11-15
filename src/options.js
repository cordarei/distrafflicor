var bg = chrome.extension.getBackgroundPage();
var settings = {};


/* Convenience functions */

function url_whitelist() {
    return document.querySelector("#url_whitelist");
}

function browse_time() {
    return document.querySelector("#browse_time");
}

function break_time() {
    return document.querySelector("#break_time");
}

// display a message in the '#message' element for 1 second
function message(msg, cls) {
    var span = document.querySelector("#message");
    span.innerHTML = msg;
    span.className = cls || '';
    span.style.display = 'inline';
    setTimeout(function() { span.removeAttribute('style'); }, 1000);
}

/* Load, save & validate */

function populate_fields() {
    settings = bg.load_settings();
    url_whitelist().value = settings.url_whitelist.join('\n');
    browse_time().value = settings.browsing_time;
    break_time().value = settings.cool_off_time;
}

function validate() {
    return true;
}

function save() {
    if (validate()) {
        settings.url_whitelist = url_whitelist().value.split('\n');
        settings.browsing_time = parseInt(browse_time().value);
        settings.cool_off_time = parseInt(break_time().value);
        bg.save_settings(settings);
        message('Saved.', 'success');
    } else {
        message('Validation error!', 'error');
    }
}


/* Event listeners */

document.addEventListener("DOMContentLoaded", populate_fields);
document.querySelector("#save").addEventListener("click", save);
