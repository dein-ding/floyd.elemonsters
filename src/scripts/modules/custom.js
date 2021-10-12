/////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ NEEDS TO BE UPDATED FROM main.js ////////////////////////////////////////////////////\\\\\

/**
 * ## display custom dialogs
 */
export const customExt = {
	subFunctions: {
		testFunction(objOrString) {
			if (typeof objOrString == "string") console.log(objOrString);
			if (typeof objOrString == "object") {
				// const { title, text, primaryBtn, secondaryBtn }
			}
		},
		/**
		 *	format function arguments
		 * @param {string} data
		 * @returns {string}
		 */
		formatInput({ title, text, buttons, alertType, timeout }) {
			title = title == "" ? null : title;
			text = text == "" ? null : text;
			buttons = !buttons ? ["OK"] : !buttons[0] ? ["OK"] : buttons;
			alertType = alertType == "" || alertType == null ? "info" : alertType;
			timeout = timeout ? timeout : 4000;

			return { title, text, buttons, alertType, timeout };
		},
		createContainer() {
			const dialogContainer = document.createElement("div");
			dialogContainer.classList = "dialogContainer";
			document.body.prepend(dialogContainer);
			return dialogContainer;
		},
		/**
		 * 
		 * @param {{
			title: string;
			text: string;
			buttons: string[];
			alertType: string;
			timeout: number;
			}} param0 
		 * @param {"confirm" | "prompt" | "alert"} type 
		 * @returns 
		 */
		getDialogBody({ title, text, buttons, alertType, timeout }, type) {
			let result;
			dialogTextBody = () => `
				<div class='dialogText'>
					<h3>${escapeHTML(title)}</h3>
					<p>${escapeHTML(text)}</p>
				</div>
			`;
			switch (type) {
				case "confirm":
					result = `
						<div class='dialog'>
							${dialogTextBody()}
							<div class='dialogInput'>
								${buttons
									.map((btnText, i) =>
										`<button onclick='custom.subFunctions.buttonPressed(${i})'>${escapeHTML(btnText)}</button>`)
									.join("\n")
								}
							</div>
						</div>
					`; //prettier-ignore
					break;
				case "prompt":
					result = `
						<div class='dialog prompt'>
							${dialogTextBody()}
							<div class='dialogInput'>
								<input class="promptInput" type="text">
								<button onclick='custom.subFunctions.buttonPressed()'>OK</button>
							</div>
						</div>
					`; //prettier-ignore
					break;
				case "alert":
					result = `
						<div class='dialog alert ${alertType}'>
							${alertType == "success"
								? `<i class="far fa-check-circle"></i>`
								: alertType == "warning"
								? `<i class="far fa-exclamation-circle"></i>`
								: alertType == "error"
								? `<i class="far fa-exclamation-triangle"></i>`
								: `<i class="far fa-info-circle"></i>`
							}
							<button class="close-alert-box" onclick="closeAlertBox()"><i class="far fa-times"></i></button>
							<div class='dialogText'>
								<h2>${escapeHTML(title)}</h2>
								<p>${escapeHTML(text)}</p>
							</div>
							<div class='progress-bar'>
								<div class='progress' style="animation: progress ${timeout}ms linear"></div>
							</div>
						</div>
					`; //prettier-ignore
			}
			return result.replace(/undefined/g, "");
		},
		container: () => document.querySelector(".dialogContainer"),
		dialog: () => document.querySelector(".dialog"),
		allElements: () => ({
			container: custom.subFunctions.container(),
			dialog: custom.subFunctions.dialog(),

			dialogText: document.querySelector(".dialogText"),
				title: document.querySelector(".dialogText h2, .dialogText h3"),
				text: document.querySelector(".dialogText p"),
			dialogInput: document.querySelector(".dialogInput"),
				buttons: [...document.querySelectorAll(".dialogInput button")].reverse(),
				input: document.querySelector(".dialogInput input")
		}), //prettier-ignore
		/**
		 * @param {"IN" | "OUT"} state
		 */
		animation(state) {
			if (state == "IN") {
				setTimeout(() => custom.subFunctions.container().classList.add("appear"), 1);
				setTimeout(() => custom.subFunctions.dialog().classList.add("appear"), 30);
			}
			if (state == "OUT") {
				custom.subFunctions.dialog().classList.remove("appear");
				setTimeout(() => custom.subFunctions.container().classList.remove("appear"), 40);
				setTimeout(() => custom.subFunctions.container().remove(), 300);
			}
		},
		keyboardClick(e) {
			const { btns } = custom.subFunctions;
			if (e.key == "Enter" || e.key == "Escape") {
				e.stopPropagation();
				e.preventDefault();
				if (e.key == "Enter") custom.subFunctions.buttonPressed(btns.length - 1);
				if (e.key == "Escape" && btns.length > 1 && btns[0]) custom.subFunctions.buttonPressed(0);
			}
		},
		KeyboardClickListener(state, btns) {
			if (state == "add") document.addEventListener("keydown", custom.subFunctions.keyboardClick, { capture: true });
			if (state == "remove")
				document.removeEventListener("keydown", custom.subFunctions.keyboardClick, { capture: true });
		},
	},
	/**
	 * ## presents a custom alert dialog
	 * @param {{
			title: string;
			text: string;
			buttons: string[];
			}} data
	 * @param {() =>} callback 
	 * @returns {Promise<string>} button response
	 */
	confirm: ({ title, text, buttons }, callback = () => {}) => {
		//format function arguments
		const args = custom.subFunctions.formatInput({ title, text, buttons });

		//create container and insert body
		custom.subFunctions.createContainer().innerHTML = custom.subFunctions.getDialogBody(args, "confirm");
		custom.subFunctions.animation("IN");

		callback(custom.subFunctions.allElements());

		const btns = args.buttons;
		custom.subFunctions.btns = btns; //loading the buttons into global scope

		return new Promise((resolve, reject) => {
			custom.subFunctions.KeyboardClickListener("add", btns);
			//loading the button event function into global scope
			custom.subFunctions.buttonPressed = (res) => {
				if (res == 0) resolve(btns[0]);
				else reject(btns[res]);
				custom.subFunctions.KeyboardClickListener("remove");
				custom.subFunctions.animation("OUT");
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
		//format function arguments
		const args = custom.subFunctions.formatInput({ title, text });

		//create container and insert body
		custom.subFunctions.createContainer().innerHTML = custom.subFunctions.getDialogBody(args, "prompt");
		custom.subFunctions.animation("IN");

		//focus the input field for faster workflow
		document.querySelector(".promptInput").select();

		return new Promise((resolve, _reject) => {
			click = (event) => {
				if (event.key == "Enter") {
					event.stopPropagation();
					event.preventDefault();
					custom.subFunctions.buttonPressed();
				}
			};
			document.addEventListener("keydown", click, { capture: true });

			custom.subFunctions.buttonPressed = () => {
				resolve(document.querySelector(".promptInput").value);
				document.removeEventListener("keydown", click, { capture: true });
				custom.subFunctions.animation("OUT");
			};
		});
	},
	/**
	 * ## Displays an alert box that disapears after the specified timeout
	 * @param {{
			title: string,
			text: string,
			alertType: string
			}} param0 alertType can either be ”success" | "info" | "warning" | "error"
	 * @param {number} timeout time in ms after wich the alert box disapears *[defaults to 3000]*
	 */
	alert({ title, text, alertType, timeout }) {
		//format function arguments
		const args = custom.subFunctions.formatInput({ title, text, alertType, timeout });

		//create container and insert body
		custom.subFunctions.createContainer().innerHTML = custom.subFunctions.getDialogBody(args, "alert");
		custom.subFunctions.animation("IN");

		const timeoutHandler = setTimeout(() => custom.subFunctions.animation("OUT"), args.timeout);
		closeAlertBox = () => {
			clearTimeout(timeoutHandler);
			custom.subFunctions.animation("OUT"), args.timeout;
		};
	},
};
