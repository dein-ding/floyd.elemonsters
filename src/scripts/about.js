(async () => {
	const { technologiesLearning } = await getFileAsync("/src/data/main.json", true);
	technologiesLearning.forEach((techIcon) => {
		const newIcon = document.createElement("div");
		newIcon.innerHTML = `<img src="${techIcon.imageUrl}" style="height: 30px;"></img>`;
		newIcon.className = "icon";
		newIcon.title = techIcon.name;
		document.querySelector("section.technologies .icon-stack").append(newIcon);
	});
})();
