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

function url_matches_whitelist(url, whitelist) {
    //TODO: implement
    return false;
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

// execute the 'block.js' for all tabs that don't match the whitelist
function block_tabs() {
    chrome.windows.getAll({populate:true}, function (windows) {
        windows.forEach(function (win) {
            win.tabs.forEach(function(tab) {
                if (!url_matches_whitelist(tab.url, current_settings.url_whitelist)) {
                    chrome.tabs.executeScript(tab.id, {file:'block.js'})
                }
            });
        });
    });
}

function unblock_tabs() {
    chrome.windows.getAll({populate:true}, function (windows) {
        windows.forEach(function (win) {
            win.tabs.forEach(function(tab) {
                chrome.tabs.executeScript(tab.id, {file:'unblock.js'})
            });
        });
    });
}

function update() {

    // first update ticks
    chrome.idle.queryState(60, function(idle_state) {
        if (idle_state === "active") {
            // check if the active tab's URL matches the whitelist
            chrome.tabs.query({ 'lastFocusedWindow': true, 'active': true }, function (tabs) {
                tabs.forEach(function (tab) {
                    if (url_matches_whitelist(tab.url, current_settings.url_whitelist)) {
                        // time spent on whitelisted pages counts as "cooling off" and not browsing time
                        if (state === "cool_off") {
                            ticks++;
                        }
                    } else {
                        // time spent on non-whitelisted sites counts during both browsing and
                        // cool off, because during cool off they should be hidden anyway
                        ticks++;
                    }
                });
            });
        } else {
            if (state === "cool_off") {
                ticks++;
            }
            // time spent idle shouldn't count toward browsing time
        }
    });

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
    if (state === "cool_off" && !url_matches_whitelist(tab.url)) {
        chrome.tabs.executeScript(tab.id, {file: 'block.js'})
    }
});
