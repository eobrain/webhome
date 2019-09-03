// Set up links between articles to add a left or right sliding
// animation.
var sideways = function (direction) {
    var elements = document.getElementsByClassName("go-" + direction);
    var n = elements.length;
    var _loop_1 = function (i) {
        var go = elements[i];
        go.onclick = function (e) {
            document.body.classList.add("move-" + direction);
            var href = go.getAttribute("href");
            setTimeout(function () { return document.location.href = href; }, 200);
            return false;
        };
    };
    for (var i = 0; i < n; i++) {
        _loop_1(i);
    }
};
sideways("left");
sideways("right");
