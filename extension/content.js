
var ButtonList;
var Queue = [];

console.log("Init All");

document.addEventListener('DOMContentLoaded', function () {
    console.log("Init Clicker");
    chrome.storage.local.get(['buttonList', 'enabled'], function (result) {
        var Enabled = result.enabled || false;
        ButtonList = result.buttonList || 'PresetMonsters,180\nPresetTiles,180';
        if (Enabled && ButtonList != '') {
            parseButtonList();
            initPlugin();
        }
    })
})

function initPlugin(buttonText) {
    console.log("Init Plugin");
    console.log(ButtonList);

    setTimeout(processQueue, 10000);

}

function processQueue() {

    var itm = Queue.shift();
    Queue.push(itm);
    switchPreset(itm.name);
    setTimeout(processQueue, itm.interval * 1000);

}

async function switchPreset(name) {
    console.log("Switching Preset: " + name);

    try {

        if (!getButtonScript("Presets list")) { return; }
        await delay(500);
        if (!getPresetScript(name)) { return; }
        await delay(500);
        getButtonScript("Apply");
        return true;
    } catch (error) {
        console.error('Error in switchPreset:', error);
        return false; // Failure
    }

}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getButtonScript(buttonText) {
    try {
        console.log('Clicking Button ' + buttonText);
        var buttons = document.querySelectorAll('button');

        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText === buttonText) {
                buttons[i].click();
                console.log('Clicked ' + buttonText);
                return true; // Success
            }
        }

        // No matching button found
        console.log('Button not found: ' + buttonText);
        return false;

    } catch (error) {
        console.error('Error in getButtonScript:', error);
        return false; // Failure
    }
}

function getPresetScript(presetName) {
    try {
        console.log('Preparing to click Preset ' + presetName);
        var elements = document.querySelectorAll('.flex.cursor-pointer div.text-gray-700.flex-grow.px-4.py-2.text-sm');

        for (var i = 0; i < elements.length; i++) {
            console.log('Element: ' + i + '  ' + elements[i].innerText);

            if (elements[i].innerText === presetName) {
                console.log('Clicking Preset ' + presetName);
                elements[i].click();
                return true; // Success
            }
        }

        // No matching preset found
        console.log('Preset not found: ' + presetName);
        return false;

    } catch (error) {
        console.error('Error in getPresetScript:', error);
        return false; // Failure
    }
}

function parseButtonList() {
    if (ButtonList == '') { return; }
    const lines = ButtonList.split('\n');

    for (const line of lines) {
        const parts = line.split(',');
        if (parts.length === 2) {
            const name = parts[0].trim();
            const delay = parseInt(parts[1].trim());
            if (!isNaN(delay)) {
                Queue.push(new PresetItem(name, delay));
            }
        }
    }
    ButtonList = '';
}

class PresetItem {
    constructor(name = '', interval = 60) {
        this.name = name;
        this.interval = interval;
    }
}
