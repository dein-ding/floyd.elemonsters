log = console.log;
const dummyWebuntisData = getFile("/src/data/webUntisDummyResponse.json");

const loadData = document.querySelector(".load-data");
toggleLoadDataMenu = (state) => {
	if (state === true) loadData.classList.add("show");
	if (state === false) loadData.classList.remove("show");
	else loadData.classList.toggle("show");
};
document.addEventListener("keydown", (e) => {
	if (e.key == "Escape") toggleLoadDataMenu(false);
	if (e.code == "KeyL" && e.altKey) {
		e.preventDefault();
		toggleLoadDataMenu();
	}
});

const jsonPre = document.querySelector(".JSON");
const source = document.querySelector(".source :is(h1, h2, h3, h4, h5, h6)");
let i = 0;
const json = {
	display: (json_, source) => {
		json.displayJson(json_);
		json.displaySource(escapeHTML(source));
		toggleLoadDataMenu(false);
	},
	displaySource: (source_ = `source (${i++})`) => (source.innerHTML = source_),
	displayJson: (json) => (jsonPre.innerHTML = json == "clear" ? "{\n\n}" : syntaxHighlight(json)),
	displayState: (state) => {
		switch (state) {
			case "loading":
				json.displaySource(`<span class="loading">Loading<span>...</span></span>`);
				break;
			case "failed":
				json.displaySource(`<span style="color: var(--danger-clr);">Failed to load.</span>`);
				json.displayJson("clear");
				break;
			default:
				json.displaySource(escapeHTML(state));
		}
	},
	fetchRequest: async (url) => {
		json.displayState("loading");
		try {
			const res = await fetch(url);

			if (res.status == 200) {
				try {
					let jsonParsed = await res.json();
					json.display(jsonParsed, url);
				} catch (err) {
					throw `The response from the server is not json.`;
					throw err;
				}
			} else
				throw `Failed to load: The server responded with a status of ${res.status}${
					res.status == 404 ? " (Not Found)" : ""
				}`;
		} catch (err) {
			custom.confirm("Something went wrong.", err, "Ok");
			console.warn(err);
			json.displayState("failed");
		}
	},
	FileInput: document.querySelector("#jsonFileInput"),
	StringInput: document.querySelector("#jsonStringInput"),
	RequestInput: document.querySelector("#jsonRequestInput"),
};

///////////////////////////////////// File input ///////////////////////////////////
json.FileInput.onchange = async (e) =>
	json.display(
		await e.target.files[0].text(),
		`local/${e.target.value.split("\\")[e.target.value.split("\\").length - 1]}`
	);

///////////////////////////////////// direct input ///////////////////////////////////
json.StringInput.addEventListener("click", (e) => json.StringInput.select());
json.StringInput.parse = (prompt = false) => {
	let defaultSource = "[manual input]";
	if (isJSON(json.StringInput.value)) {
		json.display(json.StringInput.value, defaultSource);
		json.StringInput.blur();
	} else if (prompt) {
		json.StringInput.value = "";
		custom.confirm("this is not a JSON string", "", "Ok");
	}
};
json.StringInput.oninput = (event) => json.StringInput.parse();
json.StringInput.addEventListener("keydown", (e) => {
	if (e.key == "Enter") {
		e.preventDefault();
		json.StringInput.parse(true);
	}
});

///////////////////////////////////// Load from URL input ///////////////////////////////////
json.RequestInput.addEventListener("click", (e) => json.RequestInput.select());
json.RequestInput.addEventListener("keydown", (e) => {
	if (e.key == "Enter") json.fetchRequest(json.RequestInput.value);
});
// adjust the width of the input field
(json.RequestInput.oninput = (e) => (json.RequestInput.style.width = json.RequestInput.value.length + 3 + "ch"))();
// one default load, so the json-viewer has something to show
json.fetchRequest(json.RequestInput.value);
