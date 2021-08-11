document.addEventListener("load", async () => {
	const { availablePages, hiddenPages } = getFileAsync("/src/data/main.json", true);
	const availablePagesFormatted = availablePages.map((string) =>
		string.replace(".html", "").replace(/\//g, "").replace(/-/g, " ")
	);
	const pageSet = new Set(availablePagesFormatted);

	class Animation {
		constructor(spanCount) {
			const firstSpan = document.querySelector("#pathPreview span");
			this.duration = parseInt(getComputedStyle(firstSpan, null).getPropertyValue("--animation-duration")); //prettier-ignore
			this.staggerDelay = parseInt(getComputedStyle(firstSpan, null).getPropertyValue("--stagger-delay")); //prettier-ignore
			this.toggleName = false;
			this.playInterval = null;
			this.intervalDelay = this.duration + this.staggerDelay * (spanCount + 1) + 1500;
			this.play = () => {
				document.querySelectorAll("#pathPreview span").forEach((span) => {
					span.style.setProperty(
						"animation",
						`swgiggle${
							this.toggleName ? "2" : ""
						} var(--animation-duration) var(--animation-timing-function) calc(var(--stagger-delay) * var(--i))`
					);
				});
				this.toggleName = !this.toggleName;
			};
			this.setPlayInterval = () => (this.playInterval = setInterval(this.play, this.intervalDelay));
			this.kill = () => clearInterval(this.playInterval);

			this.play();
			this.setPlayInterval();
		}
	}

	//add the not found path to a span
	const pathPreview = document.querySelector("#pathPreview");
	let exampleTypo = "";
	let animation;
	(addPathToSpan = () => {
		exampleTypo += "/exampleTypo";
		const failedUrl = `http://${location.host}${
			location.pathname == "/Page-Not-Found.html" ? exampleTypo : location.pathname
		}`;
		let failedUrlHtmlString = "";

		failedUrl.split("").forEach((char, i) => (failedUrlHtmlString += `<span style="--i:${i + 1}">${char}</span>`));
		pathPreview.innerHTML = `"${failedUrlHtmlString}"`;
		if (animation) animation.kill();
		animation = new Animation(failedUrl.length);
	})();
	pathPreview.onclick = addPathToSpan;

	//add pages from JSON file to options list
	const datalist = document.querySelector("#pages");
	availablePagesFormatted.forEach((page) => {
		const option = document.createElement("option");
		option.value = page;
		datalist.append(option);
	});

	//redirect to selected page on button click
	const goToPageBtn = document.querySelector("#goToPageBtn");
	const searchField = document.querySelector("#searchField");
	validateSearch = () => searchField.value && pageSet.has(searchField.value);
	goToPage = () => {
		if (validateSearch())
			location.href = `http://${location.host}/${availablePages[availablePagesFormatted.indexOf(searchField.value)]}`;
		else
			custom
				.confirm({ title: "Try the ones from the list.", buttons: ["Okay", "what list?"] })
				.catch((err) =>
					custom.confirm({
						text: "The list you get, when you type in the search field.",
						buttons: ["got it!", "still no clue"],
					})
				)
				.catch((err) =>
					custom.confirm({
						text: "Just use the navigation bar at the top of the website, for fuck sakes!",
						buttons: ["😳"],
					})
				);
	};
	goToPageBtn.onclick = goToPage;
	searchField.addEventListener("keydown", (e) => (e.key == "Enter" ? goToPage() : {}));
});
