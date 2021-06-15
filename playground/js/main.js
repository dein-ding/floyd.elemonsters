//elements
const head = document.getElementsByTagName("HEAD")[0];
const titleTag = document.querySelector("title");
const body = document.body;
const root = document.querySelector(":root");
const videoContainer = document.querySelector(".videoContainer");

// adds a prefix before the title
titleTag.innerText = "playground - " + titleTag.innerText;

// defaults currURL to "/" if it wasn't visited before
sessionStorage.currURL = sessionStorage.currURL ? sessionStorage.currURL : "/";

////////////////////// Nav Bar //////////////////////
var navBarContainer = document.querySelector(".nav-bar-container");
//create new header if not already existing
if (!navBarContainer) {
  navBarContainer = document.createElement("header");
  navBarContainer.classList.add("nav-bar-container");
  document.body.prepend(navBarContainer);
}
navBarContainer.innerHTML = getFile("./components/nav-bar.html");

document.querySelector("#return-to-main").href = `../${sessionStorage.currURL}`;
document
  .querySelector(document.body.dataset.activeLink)
  .classList.add("active");

const toggleColorSlider = document.querySelector("#toggleColorSlider");
const colorSlider = document.querySelectorAll("#colorSlider");

//settings
const toggleSettings = document.querySelector("#toggleSettings");
const keepColorSwitch = document.querySelector("#keepColorSwitch");

const searchbar = document.querySelector(".search-bar");
const cancelSearchIcon = document.querySelector(".cancel-icon");
const googleQuery = document.querySelector("#google-query");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
main = () => {
  //set the color theme
  if (eval(window.localStorage.keepColor))
    colorTheme.setHue(window.localStorage.defaultHue);
  else colorTheme.setRandomHue();

  //////////////////////////// nav-bar ////////////////////////////

  /////////////// search-bar ///////////////
  searchbar.addEventListener("keydown", (event) => {
    if (event.keyCode == 13) {
      // ENTER
      searchbar.blur();
      if (searchbar.value)
        custom
          .confirm("search for this on google?", searchbar.value, "Yes", "No") //prettier-ignore
          .then(() => {
            const query = searchbar.value.toString().replace(" ", "+");
            googleQuery.href = `https://www.google.com/search?q=${query}`;
            googleQuery.click();
          })
          .catch(() => searchbar.select());
    }

    if (event.keyCode == 27) {
      // ESC
      if (searchbar.value == "") searchbar.blur();
      searchbar.value = "";
    }
  });
  cancelSearchIcon.onclick = () => {
    searchbar.select();
    searchbar.value = "";
  };

  ///////////////// links /////////////////
  document
            .querySelectorAll(".dummy")
            .forEach( item => item.onclick = () => custom.confirm("this is just a dummy link", "", "OK") ); //prettier-ignore
};

const colorTheme = {
  hue: 120,
  /**
   * **sets the color-theme for the whole website**
   * @param {number} hue the hue-value the color-theme is gonna be set to
   */
  setHue: (hue) => {
    colorTheme.hue = hue;
    root.style.setProperty("--primary-clr-hue", hue);
    root.style.setProperty("--dialogBgHue", hue);
    if (videoContainer) videoContainer.style.filter = `hue-rotate(${hue}deg)`;

    colorSlider[0].value =
      root.style.getPropertyValue("--primary-clr-hue") || colorTheme.hue;
    colorSlider[1].value =
      root.style.getPropertyValue("--primary-clr-hue") || colorTheme.hue;

    window.localStorage.defaultHue = hue;

    console.log(`%c colorTheme changed: (${ ("00" + colorTheme.hue).slice(-3) }) 🀫🀫🀫`, `color: hsl(${colorTheme.hue}, 100%, 70%); font-family: menlo;`); //prettier-ignore
  },
  setRandomHue: () => colorTheme.setHue(Math.floor(Math.random() * 360)),
  change: (state) => {
    if (state == "close") {
      toggleColorSlider.checked = false;
      return;
    }

    toggleColorSlider.checked = !toggleColorSlider.checked;

    colorSlider[0].value =
      root.style.getPropertyValue("--primary-clr-hue") || colorTheme.hue;
    colorSlider[0].oninput = () => colorTheme.setHue(colorSlider[0].value);
  },
};

const settings = {
  toggle: (state) => {
    if (state == "close") {
      toggleSettings.checked = false;
      return;
    }

    toggleSettings.checked = !toggleSettings.checked;
    if (toggleSettings.checked) settings.show();
  },
  show: () => {
    settings.init();

    keepColorSwitch.oninput = () => {
      if (keepColorSwitch.checked) {
        settings.storage.defaultHue = colorTheme.hue;
        settings.storage.keepColor = true;
      } else {
        settings.storage.defaultHue = null;
        settings.storage.keepColor = false;
      }

      for (const key in settings.storage) {
        if (Object.hasOwnProperty.call(settings.storage, key)) {
          const value = settings.storage[key];
          window.localStorage.setItem(key, value);
        }
      }

      console.log(window.localStorage);
    };

    colorSlider[1].oninput = () => colorTheme.setHue(colorSlider[1].value);
  },
  init: () => {
    keepColorSwitch.checked = eval(window.localStorage.keepColor);
  },
  storage: {
    defaultHue: 120,
    keepColor: false,
  },
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getFile(URL) {
  let XHR = new XMLHttpRequest();
  XHR.open("GET", URL, false);
  XHR.send();

  return XHR.responseText;
}

main();

const custom = {
  /**
   * **presents a custom alert dialog**
   * @param {string} title leave empty string or "no title" for no title
   * @param {string} text
   * @param {string} primaryBtn
   * @param {string} secondaryBtn leave empty string, undefined or "no btn" for no secondary button
   * @returns {Promise<string>} button response
   */
  confirm: (title, text, primaryBtn, secondaryBtn) => {
    //input formatting
    if (title == ("" || "no title")) title = undefined;
    if (secondaryBtn == (undefined || "" || "no btn")) secondaryBtn = undefined;

    //create container
    var dialogContainer = document.createElement("div");
    dialogContainer.classList.add("dialogContainer");
    dialogContainer.style.opacity = 0;
    document.body.prepend(dialogContainer);

    //create the actual pop up dialog
    dialogContainer.innerHTML = `
        <div class='dialog'>
            <div class='dialogText'>
                <h3>${title ? title : ""}</h3>
                <p></p>
            </div>
            <div class='dialogInput'>
                ${!secondaryBtn ? "" : `<button onclick='buttonPressed("secondary")'>${secondaryBtn}</button>`} 
                <button onclick='buttonPressed("primary")'>${primaryBtn}</button>
            </div>
        </div>
    `; //prettier-ignore

    //adds the text
    document.querySelector(".dialogText p").innerText = text;

    document.querySelector(".dialog").classList.add("appear");
    $(".dialogContainer").fadeTo(200, 1);

    return new Promise((resolve, reject) => {
      click = (event) => {
        if (event.keyCode == 13) {
          event.preventDefault();
          event.stopPropagation();
          buttonPressed("primary");
        }
        if (event.keyCode == 27) {
          event.preventDefault();
          event.stopPropagation();
          buttonPressed("secondary");
        }
      };

      document.addEventListener("keydown", click, { capture: true });

      buttonPressed = (response) => {
        if (response == "primary") resolve(primaryBtn);
        if (response == "secondary") reject(secondaryBtn);

        document.removeEventListener("keydown", click, {
          capture: true,
        });

        document.querySelector(".dialog").classList.remove("appear");
        $(".dialogContainer").fadeTo(200, 0);
        setTimeout(() => {
          document.body.removeChild(dialogContainer);
        }, 300);
      };
    });
  },
  /**
   * **presents a custom prompt dialog for user input**
   * @param {string} title leave empty string or "no title" for no title
   * @param {string} text
   * @returns {Promise<string>} input value
   */
  prompt: (title, text) => {
    //input formatting
    if (title == ("" || "no title")) title = undefined;

    //create container
    var dialogContainer = document.createElement("div");
    dialogContainer.classList.add("dialogContainer");
    dialogContainer.style.opacity = 0;
    document.body.prepend(dialogContainer);

    //create the actual pop up dialog
    dialogContainer.innerHTML = `
        <div class='dialog'>
            <div class='dialogText prompt'>
                <h3>${title ? title : ""}</h3>
                <p>${text}</p>
            </div>
            <div class='dialogInput prompt'>
                <input class="promptInput" type="text">
                <button onclick='buttonPressed()'>OK</button>
            </div>
        </div>
        `; //prettier-ignore

    //focus the input field for faster workflow
    document.querySelector(".promptInput").select();

    document.querySelector(".dialog").classList.add("appear");
    $(".dialogContainer").fadeTo(200, 1);

    return new Promise((resolve, reject) => {
      click = (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
          event.stopPropagation();
          buttonPressed();
        }
      };

      document.addEventListener("keydown", click, { capture: true });

      buttonPressed = () => {
        let input = document.querySelector(".promptInput").value;
        resolve(input);

        document.removeEventListener("keydown", click, {
          capture: true,
        });

        document.querySelector(".dialog").classList.remove("appear");
        $(".dialogContainer").fadeTo(200, 0);
        setTimeout(() => {
          document.body.removeChild(dialogContainer);
        }, 300);
      };
    });
  },
  /**
   * **presents a custom prompt dialog for a slider input**
   * @param {string} title leave empty string or "no title" for no title
   * @param {string} text
   * @returns {Promise<number>} input value
   */
  slider: (title, text, sliderVal, callback) => {
    //input formatting
    if (title == ("" || "no title")) title = undefined;

    //create container
    var dialogContainer = document.createElement("div");
    dialogContainer.classList.add("dialogContainer");
    dialogContainer.style.opacity = 0;
    document.body.prepend(dialogContainer);

    //create the actual pop up dialog
    dialogContainer.innerHTML = `
        <div class='dialog'>
            <div class='dialogText prompt'>
                <h3>${title ? title : ""}</h3>
                <p>${text}</p>
            </div>
            <div class='dialogInput prompt'>
                <input class="sliderInput colorSlider" id="colorSlider" type="range" value="${sliderVal}" min="0" max="360">
                <button onclick='buttonPressed()'>OK</button>
            </div>
        </div>
        `; //prettier-ignore

    const sliderInput = document.querySelector(".sliderInput");
    sliderInput.oninput = () => {
      callback(sliderInput.value);
    };

    document.querySelector(".dialog").classList.add("appear");
    $(".dialogContainer").fadeTo(200, 1);

    return new Promise((resolve, _reject) => {
      click = (event) => {
        if (event.keyCode === 13 || event.keyCode === 27) {
          event.preventDefault();
          event.stopPropagation();
          buttonPressed();
        }
      };

      document.addEventListener("keydown", click, { capture: true });

      buttonPressed = () => {
        resolve(document.querySelector(".sliderInput").value);

        document.removeEventListener("keydown", click, {
          capture: true,
        });

        document.querySelector(".dialog").classList.remove("appear");
        $(".dialogContainer").fadeTo(200, 0);
        setTimeout(() => {
          document.body.removeChild(dialogContainer);
        }, 300);
      };
    });
  },
};
