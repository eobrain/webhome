

const firstWord = (s) => s.substr(0, s.indexOf(' '));


const detailsElements = document.getElementsByTagName("DETAILS");
const detailsCount = detailsElements.length;
for (let i = 0; i < detailsCount; i++) {
  const details = detailsElements[i] as HTMLDetailsElement;
  details.addEventListener("toggle", (toggleEvent) => {
    if (details.open) {
      const fileName = firstWord(details.textContent.trim()) + ".html";

      const xhr = new XMLHttpRequest();
      xhr.onload = xhrEvent => {
        details.insertAdjacentHTML("beforeend", xhr.responseText);
      };
      xhr.open("GET", fileName);
      xhr.send();
    }
  });
}
