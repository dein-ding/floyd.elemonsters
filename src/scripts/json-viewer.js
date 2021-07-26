log = console.log;

const jsonPre = document.querySelector(".JSON");
jsonPre.innerHTML = highlight(getFile("/src/data/webUntisDummyResponse.json"));

const jsonStringInput = document.querySelector("#jsonStringInput");
const jsonFileInput = document.querySelector("#jsonFileInput");

jsonStringInput.oninput = (event) => {
	if (isJSON(jsonStringInput.value)) {
		jsonPre.innerHTML = highlight(jsonStringInput.value);
		jsonStringInput.blur();
	}
};
jsonStringInput.addEventListener("keydown", (e) => {
	if (e.key == "Enter") {
		e.preventDefault();
		jsonStringInput.blur();
		if (isJSON(jsonStringInput.value)) jsonPre.innerHTML = highlight(jsonStringInput.value);
		else {
			jsonStringInput.value = "";
			custom.confirm("this is not a JSON string", "", "Ok");
		}
	}
});

function isJSON(content) {
	try {
		var parse = JSON.parse(content);
		if (parse && typeof parse === "object") {
			return parse;
		}
	} catch (error) {
		console.info("Not able to parse JSON: " + error);
	}
	return false;
}

function highlight(json, indentation = 4) {
	if (typeof json == "string") json = JSON.parse(json);
	json = JSON.stringify(json, null, indentation);

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
