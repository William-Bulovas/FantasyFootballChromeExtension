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
  return new Request(
    "https://jayzheng-ff-api.herokuapp.com/rankings?format=standard"
  );
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
  let name = element.children[2].children[2].innerText;
  if (element.children[2].children.length == 5) {
    console.log(element)
    name = element.children[2].children[3].innerText;
  }
  for (let i = 0; i < borischenRankings.length; i++) {
    const ranking = borischenRankings[i];
    if (name.toLowerCase() == ranking.name.toLowerCase()) {
      return ranking.rank;
    }
  }

  return "N/A";
}

function addToTable(table, borischenRankings) {
  for (let i = 0; i < table.children.length; i++) {
    const tableElement = table.children[i];

    if (!isElementInViewport(tableElement)) return;

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

fetch(constructBorisChenRequest())
  .then(response => response.json())
  .then(json => waitForElementToDisplay(100, json.rankings));
