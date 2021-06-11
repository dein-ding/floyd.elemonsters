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
        if (secondaryBtn == (undefined || "" || "no btn"))
            secondaryBtn = undefined;

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

        //adds the text
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

            document.addEventListener("keydown", clickPrimary, {capture: true});

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
        document.body.prepend(dialogContainer);

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

            document.addEventListener("keydown", click, {capture: true});

            buttonPressed = () => {
                let input = document.querySelector(".promptInput").value;
                resolve(input);

                document.removeEventListener("keydown", click, {capture: true});

                document.querySelector(".dialog").classList.remove("appear");
                $(".dialogContainer").fadeTo(200, 0);
                setTimeout(() => {
                    document.body.removeChild(dialogContainer);
                }, 300);
            };
        });
    },
};