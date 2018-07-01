function removeLastChild(element) {
  const lengthOfChildren = element.children.length;
  const lastIndex = lengthOfChildren - 1;
  const lastNode = element.children[lastIndex];

  element.removeChild(lastNode);
}

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function constructBorisChenRequest() {
  return new Request("https://francophone-toonie-97015.herokuapp.com/");
}

function isElementInViewport(el) {
  //special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }

  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /*or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /*or $(window).width() */
  );
}

function addBorisChenToTable(element, value) {
  let borischenTable = document.createElement("td");
  borischenTable.innerHTML = value;

  element.appendChild(borischenTable);
}

function getValue(element, borischenRankings) {
  const name = element
    .getElementsByClassName("Ta-start")[0]
    .getElementsByTagName("span")[1].innerText;

  if (!borischenRankings.hasOwnProperty(name)) return "";

  return borischenRankings[name];
}

function addToTable(table, borischenRankings) { 
  for (let i = 0; i < 300; i++) {
    const tableElement = table.children[i];

    removeLastChild(tableElement);

    const borisChenValue = getValue(tableElement, borischenRankings);

    addBorisChenToTable(tableElement, borisChenValue);
  }  
}

function addHtml(borischenRankings) {
  const tableHead = document.getElementsByClassName("Fz-xs Whs-nw Ta-end")[0];

  removeLastChild(tableHead);

  let borisChenHeader = document.createElement("th");
  borisChenHeader.setAttribute("class", "ys-stat");
  borisChenHeader.setAttribute("data-col", "values:borischen");
  borisChenHeader.setAttribute("data-dir", "1");

  let borischenDiv = document.createElement("div");
  borischenDiv.setAttribute("class", "ys-stat T-0 Pos-a P-4");
  borischenDiv.innerText = "Boris Chen Ranking";

  borisChenHeader.appendChild(borischenDiv);
  tableHead.appendChild(borisChenHeader);

  const tableBody = getElementByXpath(
    '//*[contains(@class, "ys-playertable ys-hidedrafted Cur-p Fz-s M-0 Condensed")]/tbody'
  );
  addToTable(tableBody, borischenRankings);
  let last_known_scroll_position = 0;
  let ticking = false;

  document.addEventListener("scroll", function(e) {
    last_known_scroll_position = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function() {
        console.log("here");
        addToTable(tableBody, borischenRankings);
        ticking = false;
      });

      ticking = true;
    }
  });
}

function waitForElementToDisplay(time, borischenRankings) {
  if (document.getElementsByClassName("Fz-xs Whs-nw Ta-end")[0] != undefined) {
    addHtml(borischenRankings);
    return;
  } else {
    setTimeout(function() {
      waitForElementToDisplay(time, borischenRankings);
    }, time);
  }
}
let last_known_scroll_position = 0;
let ticking = false;

window.addEventListener("scroll", function(e) {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      console.log("here");
      ticking = false;
    });

    ticking = true;
  }
});

fetch(constructBorisChenRequest())
  .then(response => response.json())
  .then(json => waitForElementToDisplay(100, json));
