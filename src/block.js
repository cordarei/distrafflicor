(function () {
    function make_overlay() {
        if (document.getElementById('distrafflicor-overlay')) {
            return;
        }

        var overlay = document.createElement('div');
        overlay.id = 'distrafflicor-overlay';
        overlay.style.position = 'fixed';
        overlay.style.left = 0;
        overlay.style.top = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = 999999;

        overlay.style.backgroundColor = 'black';

        document.body.appendChild(overlay);
    }

    if (typeof document === "undefined") {
        window.addEventListener("DOMContentLoaded", make_overlay);
    } else {
        make_overlay();
    }
})();
