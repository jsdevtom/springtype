var panelCreated = false;

function createPanelIfSpringTypeLoaded() {

    chrome.devtools.inspectedWindow.eval(`!!((window.$st))`, function(pageHasSpringType, err) {
        if (!pageHasSpringType) {
            return;
        }

        //set the icon by reload, if panel is already created
        setIconAndPopup('development');

        if (panelCreated) {
            return;
        }

        clearInterval(loadCheckInterval);
        panelCreated = true;
        chrome.devtools.panels.create('SpringType', '', 'panel.html', function(panel) {
            var stPanel = null;
            panel.onShown.addListener(function(window) {
                stPanel = window.panel;
            });
            panel.onHidden.addListener(function() {
                if (stPanel) {
                }
            });
        });

    });
}

function setIconAndPopup(buildType) {
    chrome.browserAction.setIcon({
        tabId: chrome.devtools.inspectedWindow.tabId,
        path: {
            '16': 'icons/icon16_' + buildType + '.png',
            '32': 'icons/icon32_' + buildType + '.png',
            '48': 'icons/icon48_' + buildType + '.png',
            '128': 'icons/icon128_' + buildType + '.png',
        },
    });
    chrome.browserAction.setPopup({
        tabId: chrome.devtools.inspectedWindow.tabId,
        popup: 'popups/' + buildType + '.html',
    });
}

chrome.devtools.network.onNavigated.addListener(function() {
    createPanelIfSpringTypeLoaded();
});

//https://developer.chrome.com/extensions/devtools#detecting-open-close
var loadCheckInterval = setInterval(function() {
    // endless loop to check if devtools open
    createPanelIfSpringTypeLoaded();
}, 1000);
