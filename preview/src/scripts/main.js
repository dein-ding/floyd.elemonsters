const titleTag = document.querySelector("title");
const navBarContainer = document.querySelector("#nav-bar-container");
const bodyContainer = document.querySelector("#body-container");
const infoBanner = document.querySelector("#info-banner");

const footer = document.querySelector("footer");

getFile = (URL) => {
  var XHR = new XMLHttpRequest();
  XHR.open("GET", URL, false);
  XHR.send();

  return XHR.responseText;
};

async function getUserCount() {
  return new Promise((resolve, reject) => {
    let i = 1;
    let wait = setInterval(() => {
      // console.log(`waiting for user count... (${i})`);
      i++;
      if (i > 20) {
        clearInterval(wait);
        reject("could not fetch UserCount (besucher)");
      }

      if (window.besucher) {
        clearInterval(wait);
        resolve({
          onDomain: location.hostname,
          online: besucher[0],
          today: besucher[1],
          yesterday: besucher[2],
          ever: besucher[3],
          since: besucher[4],
        });
      }
    }, 200);
  });
}

//inject components
navBarContainer.innerHTML = getFile("/src/components/nav-bar.html");
if (infoBanner) infoBanner.innerHTML = getFile("/src/components/info-banner.html"); //prettier-ignore
// bodyContainer.innerHTML = `<img class="telefon" src="/src/assets/images/telefon.jpg" alt="telefon Kontakt" />` + bodyContainer.innerHTML; //prettier-ignore
footer.innerHTML = getFile("/src/components/footer.html");

//mark the active link
(
  document.querySelector(`[href="${location.pathname}"]`) ||
  document.querySelector(`[data-href="${location.pathname}"]`)
).classList.add("activeLink");

//create title suffix
if (location.pathname != "/")
titleTag.innerText = `${titleTag.innerText} | ${ `${location.pathname}`.replace("/", "").replace("/", "").replace("-", " ") }`; //prettier-ignore

//create link for favicon
const linkFavicon = document.createElement("LINK");
linkFavicon.rel = "shortcut icon";
linkFavicon.type = "image/gif";
linkFavicon.href = "/src/assets/images/taxi.gif";
document.head.append(linkFavicon);

//create script for user counter
const userCounterScript = document.createElement("script");
userCounterScript.id = "ebsr5556uh";
userCounterScript.src = `https://www.besucherzaehler-kostenlos.de/js/counter.js.php?count=1&id=taxi-hamm.de${ location.hostname == "127.0.0.1" || location.hostname == "floyd-preview.elemonsters.de" ? "(DevMode)" : "" }&start=0&design=5`; //prettier-ignore
document.head.append(userCounterScript);

getUserCount().then((userCount) => {
  document.querySelector(".userCount #today").innerText = userCount.today;
  document.querySelector(".userCount #yesterday").innerText = userCount.yesterday; //prettier-ignore
  document.querySelector(".userCount #ever").innerText = userCount.ever;
  document.querySelector(".userCount #since").innerText = userCount.since;
});
