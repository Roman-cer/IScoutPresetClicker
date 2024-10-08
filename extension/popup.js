console.log("Clicker Init");
document.addEventListener('DOMContentLoaded', function () {
    console.log("added listener");
    chrome.storage.local.get(['buttonList', 'enabled'], function (result) {
        document.getElementById('buttonList').value = result.buttonList || 'PresetMonsters,180\nPresetTiles,180';
        document.getElementById('enabled').checked = result.enabled || false;
    })

    document.getElementById('saveSettings').addEventListener('click', function () {
        let buttonList = document.getElementById('buttonList').value;
        let enabled = document.getElementById('enabled').checked;
        chrome.storage.local.set({
            buttonList: buttonList,
            enabled: enabled
        }, function () {
            window.close();
        });
    })

})




