window.addEventListener("load", async () => {
	/* just for testing */
	/* document
        .querySelector(":root")
        .style.setProperty("--navBarBackground", "rgba(0, 0, 0, .3)"); */
	//console.log(document.querySelector("body").dataset);

	if (!sessionStorage.hasBeenPrompted)
		setTimeout(() => {
			custom.confirm({
				title: "Attention",
				text: "This website is work in progress, so please be kind if there are bugs.",
				buttons: ["continue"],
			});
			sessionStorage.hasBeenPrompted = true;
		}, 500);

	const img = document.querySelector("section img");
	const imgUrl = /* img.src ||  */ "./src/assets/images/deinding collage.png";

	const imageObject = new Image();
	imageObject.setAttribute("crossOrigin", "");
	imageObject.src = imgUrl;

	// getDominantColor(img, "rgb", true);

	// document.querySelector("#readme-section").innerHTML = await getFileAsync("/README.md", false, true);

	const { technologiesLearning } = await getFileAsync("/src/data/main.json", true);
	technologiesLearning.forEach((tech) => {
		newIcon = document.createElement("div");
		newIcon.innerHTML = `<img src="${tech.imageUrl}" style="height: 30px;"></img>`;
		newIcon.className = "icon";
		newIcon.title = tech.name;
		document.querySelector("section.technologies .icon-stack").append(newIcon);
	});
});
