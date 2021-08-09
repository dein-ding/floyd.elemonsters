window.addEventListener("load", () => {
	const output = document.querySelector("#output");
	var numbers = "";

	addChar = (character) => {
		numbers += character;

		output.innerText = numbers;
	};

	calculate = () => {
		if (numbers) {
			output.innerText = eval(numbers);
			numbers = eval(numbers);
		}
	};

	clearAll = () => {
		numbers = "";
		output.innerText = "";
	};

	//add keybindings
	document.addEventListener("keydown", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			calculate();
		}
		if (event.keyCode === 191 || event.keyCode === 111) {
			event.preventDefault();
			addChar("/");
		}
		if (event.keyCode === 106 || event.keyCode === 221) {
			event.preventDefault();
			addChar("*");
		}
		if (event.keyCode === 109 || event.keyCode === 189) {
			event.preventDefault();
			addChar("-");
		}
		if (event.keyCode === 27) {
			event.preventDefault();
			clearAll();
		}
		if (event.keyCode === 105 || event.keyCode === 57) {
			event.preventDefault();
			addChar("9");
		}
		if (event.keyCode === 104 || event.keyCode === 56) {
			event.preventDefault();
			addChar("8");
		}
		if (event.keyCode === 103 || event.keyCode === 55) {
			event.preventDefault();
			addChar("7");
		}
		if (event.keyCode === 102 || event.keyCode === 54) {
			event.preventDefault();
			addChar("6");
		}
		if (event.keyCode === 101 || event.keyCode === 53) {
			event.preventDefault();
			addChar("5");
		}
		if (event.keyCode === 100 || event.keyCode === 52) {
			event.preventDefault();
			addChar("4");
		}
		if (event.keyCode === 99 || event.keyCode === 51) {
			event.preventDefault();
			addChar("3");
		}
		if (event.keyCode === 98 || event.keyCode === 50) {
			event.preventDefault();
			addChar("2");
		}
		if (event.keyCode === 97 || event.keyCode === 49) {
			event.preventDefault();
			addChar("1");
		}
		if (event.keyCode === 96 || event.keyCode === 48) {
			event.preventDefault();
			addChar("0");
		}
		if (event.keyCode === 110 || event.keyCode === 186 || event.keyCode === 190) {
			event.preventDefault();
			addChar(".");
		}
		if (event.keyCode === 107 || event.keyCode === 187) {
			event.preventDefault();
			addChar("+");
		}
	});
});
