window.onload = () => {
	//elements
	const ausgabeDiv = document.querySelector("#ausgabeDiv");
	const pipetteCursor = document.querySelector("#pipetteCursor");
	const clipboardMessage = document.querySelector(".clipboardMessage");
	const clipboardMessageSpan = document.querySelector("#clipboardMessageSpan"); //prettier-ignore

	//sub elements
	const firstLiTag = document.querySelector("#firstLiTag");
	const colorTonesSelection = document.querySelector("#colorTonesSelection");

	//variables
	const CLIPBOARD_MESSAGE_ANIMATION_DURATION = 3000;
	var clpbrdMesgIsRunning = false;
	var isMobile = true;

	//display a warning if the user uses a mobile device
	if (screen.width <= 700) {
		//redirect to home page if the user clicks "cancel"
		custom
			.confirm("Attention", "This site works and looks better on desktop devices, continue?", "continue", "cancel")
			.then((response) => {
				isMobile = true;
			})
			.catch((response) => {
				location.href = sessionStorage.prevURL;
			});
	} else isMobile = false;

	//prevent right-click-menu from appearing
	document.addEventListener("contextmenu", (event) => {
		event.preventDefault();
	});

	//add some colorFields
	if (isMobile) addColorFields(15);
	else addColorFields(80);

	//change some text when on mobile
	if (isMobile) firstLiTag.innerHTML = "tap on colors to see their RGB values <i class='fa fa-eye-dropper'></i>";

	var lastEvent;

	//do some stuff when the mouse moves
	$("body").mousemove((event) => {
		//put the ausgabeDiv on the coordinates of the mouse if using desktop
		if (!isMobile) {
			ausgabeDiv.style.setProperty("top", event.pageY + 10 + "px");
			ausgabeDiv.style.setProperty("left", event.pageX + 10 + "px");
		}

		//put the pipette icon as cursor on the coordinates of the mouse
		pipetteCursor.style.setProperty("top", event.pageY - 33 + "px");
		pipetteCursor.style.setProperty("left", event.pageX - 5 + "px");

		//show pipette cursor when hovering over a colorField and using desktop
		if (event.target.dataset.description == "colorField" && isMobile == false) pipetteCursor.style.opacity = 1;
		else pipetteCursor.style.opacity = 0;

		if (event.target.dataset.description == "addDivButton") document.querySelector("#dontShowAusgabeDiv").checked = true;
		else document.querySelector("#dontShowAusgabeDiv").checked = false;

		if (
			event.target.dataset.description == "copyButton" ||
			event.target.dataset.description == "changeColorButton" ||
			event.target.id == "pipetteCursor"
		)
			event = lastEvent;

		RGB.output(event);
		lastEvent = event;
	});
	$("div").click((event) => {
		//do some stuff when buttons are clicked on
		switch (event.target.dataset.description) {
			//change color of colorField
			case "changeColorButton":
				event = lastEvent;
				//setting the color to a randomly genereated rgbValue
				$(event.target).css({ backgroundColor: RGB.generateValue() });
				RGB.output(event);
				break;

			//copy rgb value of colorField to clipboard
			case "copyButton":
				event = lastEvent;
				copyToClipboard(RGB.getValue(event.target));
				break;
		}
	});

	function copyToClipboard(text) {
		if (clpbrdMesgIsRunning) return; //check if there is an animation running and quit the function if yes

		//create dummy textarea to copy value
		var textarea = document.createElement("textarea");
		textarea.value = text;
		//append it to the body
		document.body.append(textarea);
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);

		//changing the message text if the text is NOT a RGB value
		if (text[0] + text[1] + text[2] + text[3] == "rgb(") {
			//setting the color of the icon to the RGB value
			document.querySelector(".fa-copy").style.color = text;
			clipboardMessageSpan.innerText = "RGB value copied!";
		} else {
			clipboardMessageSpan.innerText = "   Text copied!";
		}

		//display a small success animation
		clpbrdMesgIsRunning = true;
		clipboardMessage.style.animation = "clipboardMessage " + CLIPBOARD_MESSAGE_ANIMATION_DURATION + "ms";

		//reset animation
		resetClipboardMessageAnimation = setTimeout(() => {
			clipboardMessage.style.animation = false;
			clpbrdMesgIsRunning = false;
		}, CLIPBOARD_MESSAGE_ANIMATION_DURATION + 100);
	}
};

var firstTime = true;

function addColorFields(count, tone) {
	if (tone == undefined) tone = colorTonesSelection.value;

	for (var i = 0; i < count; i++) {
		//create new colorField element with randomly generated color
		var newDiv = document.createElement("div");
		newDiv.style = "background-color: " + RGB.generateValue(tone);
		//append them to the container
		document.querySelector(".colorContainer").append(newDiv);

		//adding buttons to the div
		newDiv.innerHTML =
			"<button class='copyButton' data-description='copyButton'><i class='fas fa-copy'></i></>" +
			"<button class='changeColorButton' data-description='changeColorButton'><i class='fas fa-random'></i></>";

		//adding custom attributes to the colorField
		newDiv.dataset.description = "colorField";
		newDiv.dataset.backgoundRGBValue = RGB.getValue(newDiv);
	}
	//scroll down to the newest div if its not the firstTime
	if (!firstTime) {
		newDiv.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	}
	firstTime = false;
}

const RGB = {
	//get backgroundColor from element
	getValue(element) {
		return window.getComputedStyle(element, null).getPropertyValue("background-color");
	},

	//return a generated rgbValue
	generateValue(tone) {
		if (tone == undefined) tone = "random";
		let R, G, B;

		switch (tone) {
			case "random":
				R = Math.random() * 255;
				G = Math.random() * 255;
				B = Math.random() * 255;
				break;

			case "gray":
				let grayValue = Math.random() * 255;
				R = grayValue;
				G = grayValue;
				B = grayValue;
				break;

			case "red":
				R = Math.random() * 200 + 55;

				G = R - (Math.random() * 150 + 20);
				B = R - (Math.random() * 150 + 20);
				break;

			case "green":
				G = Math.random() * 200 + 55;

				R = G - (Math.random() * 150 + 20);
				B = G - (Math.random() * 150 + 20);
				break;

			case "blue":
				B = Math.random() * 200 + 55;

				R = B - (Math.random() * 150 + 20);
				G = B - (Math.random() * 150 + 20);
				break;
		}
		return `rgb(${R}, ${G}, ${B})`;
	},

	//outputting the rgbValues to the ausgabeDiv
	output(event) {
		let rgbValue = RGB.getValue(event.target);
		//seperate each RGB value
		rgbValue = rgbValue
			.substring(4, rgbValue.length - 1)
			.replace(/ /g, "")
			.split(",");

		//displaying "..." when not hovering over a colorField
		if (event.target.dataset.description == "colorField") {
			document.getElementById("R").innerText = rgbValue[0];
			document.getElementById("G").innerText = rgbValue[1];
			document.getElementById("B").innerText = rgbValue[2];
		} else {
			document.getElementById("R").innerText = "...";
			document.getElementById("G").innerText = "...";
			document.getElementById("B").innerText = "...";
		}
	},
};
