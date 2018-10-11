// Set up links between articles to add a left or right sliding
// animation.
const sideways = (direction) => {

    const elements = document.getElementsByClassName("go-" + direction);
    const n = elements.length;
    for (let i = 0; i < n; i++) {
	const go = elements[i] as HTMLElement;
	go.onclick = (e) => {
	    document.body.classList.add("move-" + direction);
	    const href = go.getAttribute("href");
	    setTimeout(() => document.location.href = href, 200);
	    return false;
	};
    }
}
sideways("left");
sideways("right");
