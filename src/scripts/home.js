window.addEventListener("load", async () => {
	/* just for testing */
	/* document
        .querySelector(":root")
        .style.setProperty("--navBarBackground", "rgba(0, 0, 0, .3)"); */
	//console.log(document.querySelector("body").dataset);

	if (!sessionStorage.hasBeenPrompted)
		setTimeout(() => {
			custom.confirm("Attention", "This website is work in progress, so be kind if there are bugs.", "continue");
			sessionStorage.hasBeenPrompted = true;
		}, 500);

	const img = document.querySelector("section img");
	const imgUrl = /* img.src ||  */ "./src/assets/images/deinding collage.png";

	const imageObject = new Image();
	imageObject.setAttribute("crossOrigin", "");
	imageObject.src = imgUrl;

	// getDominantColor(img, "rgb", true);

	const readmeSection = document.querySelector("#readme-section");
	readmeSection.innerHTML = getFileAsync("/README.md", false, true);
});
