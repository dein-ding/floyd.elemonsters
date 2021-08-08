log = console.log;

window.onload = async () => {
	//elements
	const head = document.getElementsByTagName("HEAD")[0];
	const titleTag = document.querySelector("title");
	var navBarHeader = document.querySelector("#navBarHeader");
	var footer = document.querySelector("#footer");
	const body = document.body;

	//variables
	const data = await getFileAsync("/src/data/main.json", true);

	var locationURL = {
		prev: sessionStorage.currURL ? sessionStorage.currURL : undefined,
		curr: location.pathname,
	};
	sessionStorage.currURL = location.pathname;
	sessionStorage.prevURL = locationURL.prev;

	// //create script for user counter
	// const userCounterScript = document.createElement("script");
	// userCounterScript.id = "ebsr5556uh";
	// userCounterScript.src = `https://www.besucherzaehler-kostenlos.de/js/counter.js.php?count=1&id=floyd.elemonsters.de${DevMode.status ? "(DevMode)" : ""}&start=0&design=5`; //prettier-ignore
	// head.append(userCounterScript);

	//create link for favicon
	const linkFavicon = document.createElement("LINK");
	linkFavicon.rel = "shortcut icon";
	linkFavicon.type = "image/png";
	linkFavicon.href = "/src/assets/images/icons/deinding_favicon.png";
	head.prepend(linkFavicon);

	// adds a suffix after the title
	titleTag.innerText = titleTag.innerText + " - dein.ding";

	if (body.dataset.mainBackground == "true") {
		if (DevMode.status) console.info("%cbackground image injected", "color: yellow");
		const mainBackground = document.createElement("div");
		mainBackground.classList.add("main-background");
		body.prepend(mainBackground);
	}

	////////////////////// Nav Bar //////////////////////
	//create new header if not already existing
	if (!navBarHeader) {
		navBarHeader = document.createElement("header");
		navBarHeader.id = "navBarHeader";
		body.prepend(navBarHeader);
	}
	navBarHeader.innerHTML = await getFileAsync("/src/components/navBar.html"); //inject navBar component

	//execute DevMode preferences
	if (DevMode.status) DevMode.execute();

	// add DevMode keybinding
	body.addEventListener("keydown", (e) => {
		if (e.key == "™" && e.shiftKey && e.altKey) {
			console.log("%cDevMode Shortcut used", DevMode.consoleStyle);

			e.preventDefault();
			DevMode.toggle();
		}
	});

	//adds the activeLink class to active links for the current page
	let activeLinks = body.dataset.activeLink;
	if (activeLinks)
		activeLinks.split(" ").forEach((selector) => document.querySelector(selector).classList.add("activeLink"));

	//adds a title and an alert to disabled links
	const disabledLinkMsg = "This site does not exsist yet :(";
	document.querySelectorAll(".disabledLink").forEach((item) => {
		item.title = disabledLinkMsg;
		item.onclick = () => {
			custom.confirm("", disabledLinkMsg, "Okay");
		};
	});

	//opens and closes the projects dropdown menu
	const projectsDrpdwntggl = document.querySelector(".projects-dropdown-toggle"); //prettier-ignore
	window.onclick = (event) => {
		if (event.target.matches(".prjct-tggl")) projectsDrpdwntggl.checked = !projectsDrpdwntggl.checked;
		else projectsDrpdwntggl.checked = false;
	};

	/////////////////////// footer ///////////////////////
	//create new footer if not already existing
	if (!footer) {
		footer = document.createElement("footer");
		footer.id = "pageFooter";
		body.append(footer);
	}
	//inject footer component
	footer.innerHTML = await getFileAsync("/src/components/footer.html");
	if (body.dataset.mainBackground == "true") footer.style.color = "white";

	data.links.forEach((link) => {
		newLink = document.createElement("a");
		newLink.className = link.FaSelector;
		newLink.href = link.link;
		newLink.title = `${link.name}/${link.username}`;

		document.querySelector("footer .social-links").append(newLink);
	});

	// document.querySelector("footer .fa-soundcloud").href = data.links.soundcloud.href;
	// document.querySelector("footer .fa-spotify").href = data.links.spotify.href;
	// document.querySelector("footer .fa-instagram").href = data.links.instagram.href;
};
/**
 * @param {string}  selector html element selector
 */
removeElement = (selector) => document.querySelectorAll(selector).forEach((item) => item.remove());

////////////////// DevMode /////////////////
const DevMode = {
	status:
		location.hostname == "127.0.0.1" || location.hostname == "localhost"
			? true
			: sessionStorage.devModeStatus
			? true
			: false,
	keepAcrossPages: false,
	callback: null,
	/**
	 * ### set DevMode status
	 * @param {boolean} status
	 * @param {number} delay sets the delay in ms after which DevMode is executed [defaults to 0]
	 */
	set(status, delay = 0) {
		this.status = status;
		setTimeout(() => {
			this.execute();
		}, delay);
	},
	/**
	 * ### toggle DevMode status
	 * @param {number} delay sets the delay in ms after which DevMode is executed [defaults to 0]
	 */
	toggle(delay = 0) {
		this.status = !this.status;
		setTimeout(() => {
			this.execute();
		}, delay);
	},
	execute() {
		console.group("%c DevMode ", this.consoleStyle);
		this.log();

		if (this.keepAcrossPages) sessionStorage.devModeStatus = this.status;
		else sessionStorage.removeItem("devModeStatus");

		if (this.callback) {
			let res = this.callback(this.status);
			if (res) text = res;
			else text = `settings ${this.status ? "applied" : "cleared"}`;

			console.log(`%c ${text} `, this.consoleStyle);
		}

		document.querySelectorAll(".devModeSwitch").forEach((item) => (item.checked = this.status));

		this.toggleItems(this.status);

		console.groupEnd();
	},
	log() {
		console.log(`%c ${this.status ? "enabled" : "disabled"} on: ${location.hostname} `, this.consoleStyle);
		if (!this.callback) console.info("no DevMode callback available");
	},
	GUI: {
		switchInNavBar: true,
		navUlInnerHTML: null,
		toggle() {
			const devModeGuiToggle = document.querySelector("#devModeGuiToggle");
			devModeGuiToggle.checked = !devModeGuiToggle.checked;
		},
	},
	items: [],
	toggleItems(status) {
		const projectsDropdown = document.querySelector(".projects-dropdown");
		const navUl = document.querySelector("#navBarHeader nav ul");
		//   console.log(this.items)

		switch (status) {
			case true:
				if (DevMode.items.length == 0) {
					//adds a link to the playground page
					let li = document.createElement("li");
					li.classList.add("devModeItem");
					li.innerHTML = `<a href="/playground" id="playgroundLink">playground</a>`;
					projectsDropdown.append(li);
					DevMode.items.push(li);

					removeElement(".devModeSwitchNavBarItem");
					navUl.innerHTML = navUl.innerHTML + `
						<li class="devModeSwitchNavBarItem"></li>
						<li class="devModeItem navBarDevItem">
							<div class="devModeOutterContainer">
								<a id="devModeGuiToggleLabel" title="DevMode dashboard" onclick="DevMode.GUI.toggle()">
									<i class="fad fa-code"></i>
								</a>
								<input type="checkbox" id="devModeGuiToggle" style="display: none;">
								<div class="devModeContainer">
									<div class="shortcutHint">
										<h2>Shortcut: <span class="keyboard-key">⎇</span> <span class="keyboard-key">⇧</span> <span class="keyboard-key">D</span></h2>
									</div>
									<div class="devModeSettings">
										<div class="toggleSwitch">
											<input type="checkbox" id="devModeSwitch1" class="devModeSwitch" checked onchange="DevMode.set(this.checked, 400)" style="display: none" />
											<label class="switch" for="devModeSwitch1">
												<span class="slider"></span>
											</label>
											DevMode
										</div>
										<div class="toggleSwitch">
											<input type="checkbox" id="devMode-NavBarSwitch-Toggle" ${DevMode.GUI.switchInNavBar == true ? "checked" : ""} onchange="DevMode.GUI.switchInNavBar = this.checked; DevMode.execute();" style="display: none" />
											<label class="switch" for="devMode-NavBarSwitch-Toggle">
												<span class="slider"></span>
											</label>
											DevMode switch in NavBar
										</div>
									</div>
									<div class="toolbox">
										<button class="log" title="log DevMode settings" onclick="DevMode.log()">
											<i class="fas fa-info-circle"></i>
										</button>
										<button class="reExecute" title="reexecute DevMode settings" onclick="DevMode.execute()">
											<i class="fas fa-redo-alt"></i>
										</button>
										<button class="host-link-btn" title="Link to the hosted version of this page" onclick="DevMode.toolboxFunctions.hostLink()">
											<i class="fad fa-globe"></i>
											<a style="display: none;" target="_blank" id="hostLink"></a>
										</button>
					
										<button onclick="location.href = 'webuntis.html'">
											<i class="fad fa-calendar-alt"></i>
										</button>
					
										<button title="show a prompt dialog" onclick="DevMode.toolboxFunctions.prompt()">
											<i class="fas fa-keyboard"></i>
										</button>
										<button title="show a confirmation dialog" onclick="DevMode.toolboxFunctions.confirm()">
											<i class="fad fa-window"></i>
										</button>
									</div>
									<div class="userCountDisplay">
									<h3>UserCount</h3>
									<p>on host: init...</P>
									<p>Today: init...</P>
									<p>Yesterday: init...</P>
									<p>Ever: init...</P>
									</div>
								</div>
							</div>
						</li>
					`; //prettier-ignore
					DevMode.items.push(document.querySelector(".navBarDevItem"));
				}
				const devModeSwitchNavBarItem = document.querySelector(".devModeSwitchNavBarItem");
				if (devModeSwitchNavBarItem)
					devModeSwitchNavBarItem.innerHTML = DevMode.GUI.switchInNavBar == true ? `
						<div class="toggleSwitch">
							<input type="checkbox" id="devModeSwitch" class="devModeSwitch" checked onchange="DevMode.set(this.checked, 200)" style="display: none" />
							<label class="switch" for="devModeSwitch" title="toggle DevMode">
								<span class="slider"></span>
							</label>
						</div >
					` : ""; //prettier-ignore

				// create script for user counter
				removeElement("#ebsr5556uh");
				const userCounterScript = document.createElement("script");
				userCounterScript.id = "ebsr5556uh";
				userCounterScript.src = `https://www.besucherzaehler-kostenlos.de/js/counter.js.php?count=1&id=floyd.elemonsters.de${DevMode.status ? "(DevMode)" : ""}&start=0&design=5`; //prettier-ignore
				document.head.append(userCounterScript);

				const userCountDisplay = document.querySelector(".userCountDisplay");
				userCountDisplay.innerHTML = userCount.getString("loading");
				userCount
					.get()
					.then((res) => (userCountDisplay.innerHTML = userCount.getString("success", res)))
					.catch((err) => {
						console.warn(err);
						userCountDisplay.innerHTML = userCount.getString("failed");
					});
				break;
			case false:
				removeElement(".devModeItem");
				// if (this.items) this.items.forEach((item) => item.remove());
				this.items = [];
				break;
		}

		// console.log(this.items);
		// console.log(document.querySelectorAll(".devModeItem"));

		console.log(`%c items ${status ? "added" : "removed"} `, this.consoleStyle);
	},
	toolboxFunctions: {
		confirm: async () =>
			custom
				.confirm("Attention", "this is a confirmation dialog", "Ok", "leave me alone")
				.then(console.info)
				.catch(console.info),
		prompt: async () =>
			console.info("input recieved: " + (await custom.prompt("Wait a sec,", "this is a prompt for user input"))),
		eval: async () => eval(await custom.prompt("evaluate JS", "type in valid JavaScript for evaluation.")),
		hostLink: () => {
			const hostLinkElem = document.querySelector("#hostLink");
			hostLinkElem.href = `http://floyd.elemonsters.de/${window.location.pathname}`;
			hostLinkElem.click();
		},
	},
	consoleStyle: "color: rgb(3, 238, 31); background-color: black;",
};

const userCount = {
	get: async () =>
		new Promise((resolve, reject) => {
			let i = 0;
			const wait = setInterval(() => {
				i++;

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
				if (i > 20) {
					clearInterval(wait);
					reject("could not fetch UserCount (besucher)");
				}
			}, 200);
		}),
	getString: (status, data) =>
		status == "loading" ? `
			<h3>UserCount</h3>
			<p>on host: ${location.hostname.toString().length > 18 ? location.hostname.slice(0, 12) + "..." : location.hostname}</P>
			<p>Today: Loading...</P>
			<p>Yesterday: Loading...</P>
			<p>Ever: Loading...</P>
		` :
		status == "success" ? `
			<h3>UserCount</h3>
			<p>on host: ${data.onDomain.toString().length > 18 ? data.onDomain.slice(0, 12) + "..." : data.onDomain}</p>
			<p>Today: <b>${data.today}</b></p>
			<p>Yesterday: ${data.yesterday}</p>
			<p>Ever: ${data.ever}</p>
		` : `
			<h3>UserCount</h3>
			<p>on host: ${location.hostname.toString().length > 18 ? location.hostname.slice(0, 12) + "..." : location.hostname}</p>
			<p>Today: ${(failed = "<span style='color:red'>failed to load</span>")}</p>
			<p>Yesterday: ${failed}</p>
			<p>Ever: ${failed}</p>
		`, //prettier-ignore
};

/**
 * Get content of the given URL **synchronously**.
 * @param {string} URL
 * @returns {string} content of file (plain text)
 */
getFile = (URL) => {
	const XHR = new XMLHttpRequest();
	XHR.open("GET", URL, false);
	XHR.send();

	return XHR.responseText;
};

/**
 * Get content of the given URL **asynchronously**.
 * @param {string} URL
 * @param {boolean} isJson wether the content should be parsed as JSON. [defaults to false]
 * @param {boolean} log wether the content should be logged [defaults to false]
 * @returns {string | object} content of file
 */
getFileAsync = async (URL, isJson = false, log = false) =>
	fetch(URL).then((res) => {
		let data = isJson ? res.json() : res.text();

		if (log) data.then(console.info);
		return data;
	});
// (async () => {
// 	getFileAsync("/src/css/pong.css", false, true);
// 	getFileAsync("/src/data/main.json", true, true);
// })();

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

		//add the text
		document.querySelector(".dialogText p").innerText = text;

		document.querySelector(".dialog").classList.add("appear");
		$(".dialogContainer").fadeTo(200, 1);

		return new Promise((resolve, reject) => {
			clickPrimary = (event) => {
				event.stopPropagation();
				if (event.keyCode === 13) {
					//ENTER
					event.preventDefault();
					buttonPressed("primary");
				}
				if (event.keyCode === 27 && secondaryBtn) {
					//ESC
					event.preventDefault();
					buttonPressed("secondary");
				}
			};

			document.addEventListener("keydown", clickPrimary, { capture: true });

			buttonPressed = (response) => {
				if (response == "primary") resolve(primaryBtn);
				if (response == "secondary") reject(secondaryBtn);

				document.removeEventListener("keydown", clickPrimary, {
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
		body.prepend(dialogContainer);

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
				event.stopPropagation();
				if (event.keyCode === 13) {
					event.preventDefault();
					buttonPressed();
				}
			};

			document.addEventListener("keydown", click, { capture: true });

			buttonPressed = () => {
				let input = document.querySelector(".promptInput").value;
				resolve(input);

				document.removeEventListener("keydown", click, { capture: true });

				document.querySelector(".dialog").classList.remove("appear");
				$(".dialogContainer").fadeTo(200, 0);
				setTimeout(() => {
					body.removeChild(dialogContainer);
				}, 300);
			};
		});
	},
};

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////  COPIED FROM STACK OVERFLOW /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

/**
 * determine if a function call comes from the console
 */
fromConsole = () => {
	var stack;
	try {
		// Throwing the error for Safari's sake, in Chrome and Firefox
		// var stack = new Error().stack; is sufficient.
		throw new Error();
	} catch (e) {
		stack = e.stack;
	}
	if (!stack) return false;

	var lines = stack.split("\n");
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].indexOf("at Object.InjectedScript.") >= 0) return true; // Chrome console
		if (lines[i].indexOf("@debugger eval code") == 0) return true; // Firefox console
		if (lines[i].indexOf("_evaluateOn") == 0) return true; // Safari console
		if (lines[i].indexOf("evaluateWithScopeExtension@[native code]") == 0) return true; // Safari console
	}
	return false;
};

/**
 * **manipulate color (RGB or HEX) values**
 *
 * documentation: https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 * @param {*} p
 * @param {*} c0 color 1
 * @param {*} c1 color 2
 * @param {*} l
 * @returns
 */
pSBC = (p, c0, c1, l) => {
  let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
  if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
  if (!this.pSBCr) this.pSBCr = (d) => {
    let n = d.length, x = {};
    if (n > 9) {
      [r, g, b, a] = d = d.split(","), n = d.length;
      if (n < 3 || n > 4) return null;
      x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
    } else {
      if (n == 8 || n == 6 || n < 4) return null;
      if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
      d = i(d.slice(1), 16);
      if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
      else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
    } return x
  };
  h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
  if (!f || !t) return null;
  if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
  else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
  a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
  if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
  else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
} //prettier-ignore

/**
 * @param {string} content string to be checked for valid JSON
 * @returns {boolean}
 */
function isJSON(content) {
	try {
		let parse = JSON.parse(content);
		if (parse && typeof parse === "object") {
			return true;
		}
	} catch (error) {
		console.info("Not able to parse JSON: " + error);
	}
	return false;
}

/**
 * **get
 * @param {string | object} json the JSON string or object you want to syntax highlight
 * @param {number} indentation the number of spaces to
 * @returns {string} HTML string
 */
function syntaxHighlight(json, indentation = 4) {
	if (typeof json == "string") json = JSON.parse(json);

	json = JSON.stringify(json, null, indentation);

	let regexTypes =
		/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
	return json.replace(regexTypes, (match) => {
		let type = "number";
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				type = "key";
			} else {
				type = "string";
				let matchWithoutQuotes = match.slice(1, -1); // Cut first and last quotes
				match = '"' + escapeHTML(matchWithoutQuotes) + '"'; // Escape characters that are markup sensitive

				// Highlight URLs
				let regexURLs = /(https?:\/\/|ftp:\/\/|file:\/\/|www\.)[^\s,;:]+[^\s".,;:]/g;
				match = match.replace(regexURLs, (url) => {
					return `<a href="${url}" target="_blank" class="link" style="color: unset;">${url}</a>`;
				});
			}
		} else if (/true|false/.test(match)) {
			type = "boolean";
		} else if (/null/.test(match)) {
			type = "null";
		}
		return `<span class="${type}">${match}</span>`;
	});
}

/**
 * **Get the dominant/average color of an image**
 *
 * Stack Overflow Question: https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript
 * @param {HTMLImageElement | string} image HTMLImageElement or URL to an image
 * @param {string} colorFormat "rgb" | "rgba" | "hex"
 * @param {boolean} log log the calculated value
 * @returns color string (rgb || rgba || hex)
 */
function getDominantColor(image, colorFormat = "hex", log = false) {
	let imageObject;

	if (typeof image == "string") {
		imageObject = new Image();
		imageObject.setAttribute("crossOrigin", "");
		imageObject.src = image;
	} else if (typeof image == "object") imageObject = image;
	else {
		console.error("no valid image object or URL provided");
		return;
	}

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	document.body.append(canvas);

	canvas.width = 1;
	canvas.height = 1;

	//draw the image to one pixel and let the browser find the dominant color
	ctx.drawImage(imageObject, 0, 0, 1, 1);

	//get pixel color
	const i = ctx.getImageData(0, 0, 1, 1).data;

	canvas.remove();

	let rgb = `rgb(${i[0]},${i[1]},${i[2]})`;
	let rgba = `rgba(${i[0]},${i[1]},${i[2]},${i[3]})`;
	let hex = "#" + ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1);

	switch (colorFormat) {
		case "rgb":
			if (log) console.log("%c" + rgb, `color: ${rgb}`);
			return rgb;

		case "rgba":
			if (log) console.log("%c" + rgba, `color: ${rgb}`);
			return rgba;

		case "hex":
			if (log) console.log("%c" + hex, `color: ${hex}`);
			return hex;
	}
}

escapeHTML = (unsafe) =>
	unsafe.replace(/[&<"']/g, (match) => {
		switch (match) {
			case "&":
				return "&amp;";
			case "<":
				return "&lt;";
			case '"':
				return "&quot;";
			case "'":
				return "&apos;";
			default:
				return match;
		}
	});
