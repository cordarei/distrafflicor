//
// DistrAffliCor - background script
//


// Settings

var default_settings = {
    browsing_time: 20,
    cool_off_time: 10,
    url_whitelist: []
};

function save_settings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
}

function load_settings() {
    var settings = localStorage.getItem('settings');
    if (settings) {
        return JSON.parse(settings);
    } else {
        return JSON.parse(JSON.stringify(default_settings));
    }
}


// Utility Functions

function url_is_http(url) {
    return url.match(/^http/);
}

function url_matches_whitelist(url, whitelist) {
    var parts = url.split("://");
    var scheme = parts[0];
    url = parts[1];

    if (url.match(/^localhost/)) {
        return true;
    }

    var matched = false;
    whitelist.forEach(function (white_url) {
        if (url.match(white_url)) {
            matched = true;
        }
    });
    return matched;
}

// add a random amount to a time
// 'time' is in minutes
function add_random_extra_time(time) {
    // add a random margin to the cool off time up to 1/4 of the base time,
    // clipped between 1 and 10 minutes
    var margin = time / 4;
    if (margin < 1) margin = 1;
    if (margin > 10) margin = 10;

    return time + Math.round( Math.random() * margin );
}


// Main Procedure

var current_settings = load_settings();
var timer = null; //saves the interval return value
var state = "browsing"; // or "cool_off"
var ticks = 0; //number of ticks (time) in the current state
var cool_off_time_with_margin = add_random_extra_time(current_settings.cool_off_time);


function block_tab(tab) {
    if (!url_matches_whitelist(tab.url, current_settings.url_whitelist) && url_is_http(tab.url)) {
        chrome.tabs.executeScript(tab.id, {file:'block.js'});
    }
}

function unblock_tab(tab) {
    if (url_is_http(tab.url)) {
        chrome.tabs.executeScript(tab.id, {file:'unblock.js'});
    }
}

// call `do_fun` on each tab
function do_for_all_tabs(do_fun) {
    chrome.windows.getAll({populate:true}, function (windows) {
        windows.forEach(function (win) {
            win.tabs.forEach(do_fun);
        });
    });
}

// convenience wrapper
function block_tabs() {
    do_for_all_tabs(block_tab);
}

// convenience wrapper
function unblock_tabs() {
    do_for_all_tabs(unblock_tab);
}


function update() {
    // first update ticks
    if (state === "cool_off") {
        // always count time during cool off
        ticks++;
    } else {
        // if not idle and not viewing whitelist site, count as browsing time
        chrome.idle.queryState(60, function(idle_state) {
            if (idle_state === "active") {
                // check if the active tab's URL matches the whitelist
                chrome.tabs.query({ 'lastFocusedWindow': true, 'active': true }, function (tabs) {
                    tabs.forEach(function (tab) {
                        if (!url_matches_whitelist(tab.url, current_settings.url_whitelist)) {
                            ticks++;
                        }
                    });
                });
            }
        });
    }

    // now check elapsed time
    var minutes_elapsed = ticks / 60;

    if (state === "browsing") {
        if (minutes_elapsed >= current_settings.browsing_time) {
            block_tabs();
            state = "cool_off";
            ticks = 0;
        }
    } else {
        if (minutes_elapsed >= cool_off_time_with_margin) {
            unblock_tabs();
            state = "browsing";
            ticks = 0;

            //reload settings after every browsing->cool_off cycle
            current_settings = load_settings();
            cool_off_time_with_margin = add_random_extra_time(current_settings.cool_off_time);
        }
    }
}

// start timer
timer = setInterval(update, 1000);

// add event listener to re-block tabs when user reloads or opens new tab
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (state === "cool_off") {
        block_tab(tab);
    }
});
