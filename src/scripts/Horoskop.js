//Inputs
const Name_input = document.getElementById("Name_input");
const Geburtstag_input = document.getElementById("Geburtsdatum_input");
const Geburtsmonat_input = document.getElementById("Geburtsmonat_input");
const kategorie_dropdown = document.getElementById("kategorie_dropdown");
//buttons
const submit_button = document.getElementById("submit_button");
const reload_button = document.getElementById("reload_button");
const cancel_button = document.getElementById("cancel_button");

//Outputs
const CONTAINER = document.getElementById("container");
const ausgabe_div = document.getElementById("ausgabe_div");
const Ausgabe = document.getElementById("Ausgabe");

//Variables
var mm, dd;
var sternzeichenIndex;
const data = JSON.parse(getFile("../../src/data/horoskopTexte.json"));
const sternzeichen = data.sternzeichen;
const kategorieText = data.kategorieText;

//Defaults
var defaultUsername = "Anonym";
var ausgeklappt = false;
var abbrechen_var = false;
const sysLogStyle = "color: rgb(203, 1, 196)";

const INPUT_DEFAULT_BACKGROUND_COLOR = "white";
const INPUT_READONLY_BACKGROUND_COLOR = "#a6a6a6";

const INPUT_ERROR_BORDER = "2px solid red";
const INPUT_DEFAULT_BORDER = "2px solid rgba(0, 0, 0, 0.427)";
const INPUT_ERROR_BOX_SHADOW = "0 0 10px red, 0 0 40px red, 0 0 60px red";

const AUSGABE_DEFAULT_FONT_COLOR = ausgabe_div.style.color;
const AUSGABE_ERROR_FONT_COLOR = "red";

const AUSGABEdiv_DEFAULT_WIDTH = ausgabe_div.style.width;
const AUSGABEdiv_DEFAULT_HEIGHT = ausgabe_div.style.height;

const CONTAINER_DEFAULT_WIDTH = CONTAINER.style.width;
const CONTAINER_DEFAULT_HEIGHT = CONTAINER.style.height;

// DeveloperMode
DevMode.callback = (devMode) => {
    if (devMode) {
        Name_input.value = "Dev";
        Geburtstag_input.value = "20";
        Geburtsmonat_input.value = "4";
        kategorie_dropdown.value = "Freundeskreis";
    } else {
        Name_input.value = "";
        Geburtstag_input.value = "";
        Geburtsmonat_input.value = "";
        kategorie_dropdown.value = "Auswählen";
    }
};

document.addEventListener("keydown", (event) => {
    //ENTER
    if (event.keyCode === 13) {
        event.preventDefault();
        klick();
    }
    //ESC
    if (event.keyCode === 27) {
        event.preventDefault();
        reload_button.click();
    }
});

klick = () => {
    switch (submit_button.innerHTML) {
        case "submit":
            submit();
            break;
        case "Weiter":
            weiter();
            break;
        case "Beenden":
            abbrechen();
            break;
    }
};

neuladen = () => {
    console.log("%c[reloaded]", sysLogStyle);
    animation("einklappen", "");
    setTimeout(() => {
        submit_button.innerHTML = "submit";
        submit_button.title = "Eingaben absenden";
    }, 800);
};

abbrechen = () => {
    console.log("%c[session cancled]", sysLogStyle);
    animation("einklappen", "");
    abbrechen_var = true;
};

weiter = () => {
    let text;
    switch (kategorie_dropdown.value) {
        case "Liebe":
            text = kategorieText.liebe[sternzeichenIndex];
            break;
        case "Karriere":
            text = kategorieText.karriere[sternzeichenIndex];
            break;
        case "Freundeskreis":
            text = kategorieText.freundeskreis[sternzeichenIndex];
            break;
    }
    animation("ausklappen", text);
    submit_button.innerHTML = "Beenden";
    submit_button.title = "Beenden";

    console.log("%c[continued to text]", sysLogStyle);
};

function submit() {
    console.group("%c[submitted]", sysLogStyle);

    //username zuweisen
    Name_input.value = Name_input.value ? Name_input.value : defaultUsername;

    ///////////////////// validation /////////////////////
    validateInput = (input, inputType) => {
        //checking for string input
        if (inputType == "dropdown")
            if (input != ("Auswählen" || "")) return true;
            else return false;

        //checking for numeric input
        input = parseInt(input);

        if (isNaN(input)) return false;
        switch (inputType) {
            case "day":
                if (input > 31) return false;
                else return true;

            case "month":
                if (input > 12) return false;
                else return true;
        }
    };

    console.log("day valid: " + validateInput(Geburtstag_input.value, "day"));
    console.log("month valid: " + validateInput(Geburtsmonat_input.value, "month")); //prettier-ignore
    console.log("dropdown valid: " + validateInput(kategorie_dropdown.value, "dropdown")); //prettier-ignore

    if (
        validateInput(Geburtstag_input.value, "day") &&
        validateInput(Geburtsmonat_input.value, "month") &&
        validateInput(kategorie_dropdown.value, "dropdown")
    ) {
        //Formatierung der Inputs mit Vornull
        let string = "0" + parseInt(Geburtstag_input.value);
        dd = string.slice(-2);
        string = "0" + parseInt(Geburtsmonat_input.value);
        mm = string.slice(-2);

        mmdd = parseInt(mm + dd);

        // ermitteln des Sternzeichens
        if (mmdd >= 121 && mmdd <= 219) sternzeichenIndex = 0; //Fische
        if (mmdd >= 220 && mmdd <= 320) sternzeichenIndex = 1; //Widder
        if (mmdd >= 321 && mmdd <= 420) sternzeichenIndex = 2; //Stier
        if (mmdd >= 421 && mmdd <= 520) sternzeichenIndex = 3; //Zwilinge
        if (mmdd >= 521 && mmdd <= 621) sternzeichenIndex = 4; //Krebs
        if (mmdd >= 622 && mmdd <= 722) sternzeichenIndex = 5; //Löwe
        if (mmdd >= 723 && mmdd <= 823) sternzeichenIndex = 6; //Jungfrau
        if (mmdd >= 824 && mmdd <= 923) sternzeichenIndex = 7; //Waage
        if (mmdd >= 924 && mmdd <= 1023) sternzeichenIndex = 8; //Skorpion
        if (mmdd >= 1024 && mmdd <= 1122) sternzeichenIndex = 9; //Schütze
        if (mmdd >= 1123 && mmdd <= 1221) sternzeichenIndex = 10; //Steinbock
        if ((mmdd >= 1222 && mmdd <= 1231) || (mmdd >= 101 && mmdd <= 120))
            sternzeichenIndex = 11; //Wassermann

        Geburtstag_input.style.border = INPUT_DEFAULT_BORDER;
        Geburtstag_input.value = dd;

        Geburtsmonat_input.style.border = INPUT_DEFAULT_BORDER;
        Geburtsmonat_input.value = mm;

        kategorie_dropdown.style.border = INPUT_DEFAULT_BORDER;

        console.log("Tierkreiszeichen: " + sternzeichen[sternzeichenIndex]);

        var ausgabeText = `${Name_input.value}, mit dem Tierkreiszeichen ${sternzeichen[sternzeichenIndex]},
                            hat am ${dd}.${mm} Geburtstag 
                            und die Kategorie ${kategorie_dropdown.value} gewählt.`;

        Ausgabe.style.color = AUSGABE_DEFAULT_FONT_COLOR;
        animation("ausklappen", ausgabeText);
    } else {
        ////////// Geburtstag /////////////
        if (validateInput(Geburtstag_input.value, "day"))
            Geburtstag_input.style.border = INPUT_DEFAULT_BORDER;
        else Geburtstag_input.style.border = INPUT_ERROR_BORDER;

        ////////// Geburtsmonat /////////////
        if (validateInput(Geburtsmonat_input.value, "month"))
            Geburtsmonat_input.style.border = INPUT_DEFAULT_BORDER;
        else Geburtsmonat_input.style.border = INPUT_ERROR_BORDER;

        ////////// Kategrorie //////////////
        if (validateInput(kategorie_dropdown.value, "dropdown"))
            kategorie_dropdown.style.border = INPUT_DEFAULT_BORDER;
        else kategorie_dropdown.style.border = INPUT_ERROR_BORDER;

        ausgabe_div.style.width = AUSGABEdiv_DEFAULT_WIDTH;
        ausgabe_div.style.height = AUSGABEdiv_DEFAULT_HEIGHT;
        CONTAINER.style.height = CONTAINER_DEFAULT_HEIGHT;

        Ausgabe.style.color = AUSGABE_ERROR_FONT_COLOR;
        animation("einklappen", "Eingaben überarbeiten!");
    }
    console.groupEnd();
}

function animation(ein_aus_klappen, ausgabe_text) {
    Ausgabe.innerHTML = "";
    switch (ein_aus_klappen) {
        case "einklappen":
            if (ausgeklappt == false) {
                Ausgabe.innerHTML = ausgabe_text;
                break;
            }
            //Einklappen
            dis_appear("AUS");

            let interval, interval2, interval3;

            var ausgabe_height = 154; // default height
            clearInterval(interval);

            interval = setInterval(() => {
                if (ausgabe_height == 60) {
                    clearInterval(interval);
                    Ausgabe.style.padding = "0px";
                    Ausgabe.innerHTML = ausgabe_text;

                    Name_input.readOnly = false;
                    Name_input.style.backgroundColor = INPUT_DEFAULT_BACKGROUND_COLOR;
                    Geburtstag_input.readOnly = false;
                    Geburtstag_input.style.backgroundColor = INPUT_DEFAULT_BACKGROUND_COLOR;
                    Geburtsmonat_input.readOnly = false;
                    Geburtsmonat_input.style.backgroundColor = INPUT_DEFAULT_BACKGROUND_COLOR;
                    kategorie_dropdown.disabled = false;
                    kategorie_dropdown.style.backgroundColor = INPUT_DEFAULT_BACKGROUND_COLOR;
                    document.querySelectorAll(".lockIcons").forEach(elem => elem.style.opacity = "0%")
                    if (abbrechen_var == true) {
                        submit_button.innerText = "submit";
                        DevMode.execute(); //resetting the inputs
                    }
                } else {
                    ausgabe_height--;
                    ausgabe_div.style.height = ausgabe_height + "px";
                }
            }, 3);

            var ausgabe_width = 250; // default width
            clearInterval(interval2);

            interval2 = setInterval(() => {
                if (ausgabe_width == 180) {
                    clearInterval(interval2);
                } else {
                    ausgabe_width--;
                    ausgabe_div.style.width = ausgabe_width + "px";
                }
            }, 6.5);

            var Container_height = 498; // default height
            clearInterval(interval3);

            interval3 = setInterval(() => {
                if (Container_height == 405) {
                    clearInterval(interval3);
                } else {
                    Container_height--;
                    CONTAINER.style.height = Container_height + "px";
                }
            }, 3);

            ausgeklappt = false;

            break;

        case "ausklappen":
            if (ausgeklappt == true) {
                Ausgabe.innerHTML = ausgabe_text;
            } else {
                //Ausklappen
                dis_appear("AN");

                Name_input.readOnly = true;
                Name_input.style.backgroundColor = INPUT_READONLY_BACKGROUND_COLOR;
                Geburtstag_input.readOnly = true;
                Geburtstag_input.style.backgroundColor = INPUT_READONLY_BACKGROUND_COLOR;
                Geburtsmonat_input.readOnly = true;
                Geburtsmonat_input.style.backgroundColor = INPUT_READONLY_BACKGROUND_COLOR;
                kategorie_dropdown.disabled = true;
                kategorie_dropdown.style.backgroundColor = INPUT_READONLY_BACKGROUND_COLOR;
                document.querySelectorAll(".lockIcons").forEach(elem => elem.style.opacity = "100%")

                let interval1, interval2, interval3;
                var ausgabe_height = 60; //default height
                clearInterval(interval1);

                interval1 = setInterval(() => {
                    if (ausgabe_height == 154) {
                        clearInterval(interval1);

                        submit_button.innerHTML = "Weiter";
                        submit_button.title = "weiter zum Text";

                        Ausgabe.style.padding = "8px";
                        Ausgabe.innerHTML = ausgabe_text;
                    } else {
                        ausgabe_height++;
                        //ausgabe_div.style.width = "250px";
                        ausgabe_div.style.height = ausgabe_height + "px";
                        //CONTAINER.style.height = "498px";
                    }
                }, 3);

                var ausgabe_width = 180; //default width
                clearInterval(interval2);

                interval2 = setInterval(() => {
                    if (ausgabe_width == 250) {
                        clearInterval(interval2);
                    } else {
                        ausgabe_width++;
                        ausgabe_div.style.width = ausgabe_width + "px";
                    }
                }, 6.5);

                var Container_height = 405; //default height
                clearInterval(interval3);

                interval3 = setInterval(() => {
                    if (Container_height == 498) {
                        clearInterval(interval3);
                    } else {
                        Container_height++;
                        CONTAINER.style.height = Container_height + "px";
                    }
                }, 3);
                ausgeklappt = true;
            }
            break;
    }
}

function dis_appear(AN_AUS) {
    switch (AN_AUS) {
        case "AN":
            document.getElementById("cancel_button").style.animation = "deckkraft 0.7s linear";
            document.getElementById("reload_button").style.animation = "deckkraft 0.7s linear";

            setTimeout(() => {
                document.getElementById("cancel_button").style.opacity = "100%";
                document.getElementById("cancel_button").style.animation = "";
                document.getElementById("reload_button").style.opacity = "100%";
                document.getElementById("reload_button").style.animation = "";

                document.getElementById("cancel_button").style.pointerEvents = "all";
                document.getElementById("reload_button").style.pointerEvents = "all";
            }, 650);
            break;
        case "AUS":
            document.getElementById("cancel_button").style.animation = "deckkraft 0.7s reverse";
            document.getElementById("reload_button").style.animation = "deckkraft 0.7s reverse";

            setTimeout(() => {
                document.getElementById("cancel_button").style.opacity = "0%";
                document.getElementById("reload_button").style.opacity = "0%";

                document.getElementById("cancel_button").style.pointerEvents = "none";
                document.getElementById("reload_button").style.pointerEvents = "none";
            }, 650);
            break;
    } //prettier-ignore
}
