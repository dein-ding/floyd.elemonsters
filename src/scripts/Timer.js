//inputs
const hour_input = document.getElementById("hour_input");
const minute_input = document.getElementById("minute_input");
const second_input = document.getElementById("second_input");
const alarmSound_options = document.getElementById("alarmSound_options");
const hue_rotation_slider = document.getElementById("hue_rotation_slider");
const alertTextInput = document.getElementById("alertTextInput");
//checkboxes
const checkColorchange = document.getElementById("check_changeColor");
const checkBlinkText = document.getElementById("check_blinkText");
const checkAlarmSound = document.getElementById("check_alarmSound");
const checkAlertText = document.getElementById("checkAlertText");
//buttons
const start_button = document.getElementById("start_button");
const stop_button = document.getElementById("stop_button");

//outputs
const countdown = document.getElementById("countdown");
const hour_output = document.getElementById("hour_output");
const minute_output = document.getElementById("minute_output");
const second_output = document.getElementById("second_output");
const progress = document.getElementById("progress");
const audio = document.getElementById("audio");

//other elements
const bodyDiv = document.getElementById("body_div");
const settings_dropDown = document.getElementById("settings_dropdown");

//Constances
const alarmSoundURL = "src/assets/sounds/",
    alarmSoundSuffix = ".mp3";

//variables
var hour, minute, second;
var hourInMS, minuteInMS, secondInMS, totalTimeInMS;
var totalTimeInSeconds, intrinsicTime, progressPercentage;
var running = false,
    show_dropdown = false;

// developer mode
DevMode.callback = (devMode) => {
    if (devMode) {
        second_input.value = 2;
        alertTextInput.value = "mein Mitteilungstext der recht kurz ist";
        checkAlarmSound.checked = false;
        checkAlertText.checked = true;
    } else {
        second_input.value = "";
        alertTextInput.value = "";
        checkAlarmSound.checked = true;
        checkAlertText.checked = false;
    }
};

///////////////////////// testing //////////////////////////////
/* $(document).ready(function () {
    alert("added new option for testing");
    newOption = document.createElement("option");
    newOption.innerText = "test 123";
    document.getElementById("alarmSound_options").append(newOption);
}); */
////////////////////////////////////////////////////////////////

document.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        click_();
    }
});

alertTextInput.oninput = () => {
    checkAlertText.checked = true;
};

//decide wich function to call
function click_() {
    switch (start_button.innerHTML) {
        case "Start":
            start_func();
            break;
        case "Pause":
            pause_func();
            break;
        case "Weiter":
            resume_func();
            break;
    }
}
//start timer
var intervalVar;
function start_func() {
    //check if there is an input
    if (
        hour_input.value == "" &&
        minute_input.value == "" &&
        second_input.value == ""
    )
        return;
    //check if the timer is already running
    if (running == true) return;

    running = true;
    countdown.style.animation = false;

    //check if hours are valid and format them
    if (hour_input.value > 0 && hour_input.value < 24) {
        let string = "0" + Math.round(hour_input.value);
        hour = string.slice(-2);
    } else {
        if (hour_input.value > 23) hour = 23;
        else hour = "00";
    }
    //check if minutes are valid and format them
    if (minute_input.value > 0 && minute_input.value < 60) {
        let string = "0" + Math.round(minute_input.value);
        minute = string.slice(-2);
    } else {
        if (minute_input.value > 59) minute = 59;
        else minute = "00";
    }
    //check if seconds are valid and format them
    if (second_input.value > 0 && second_input.value < 60) {
        let string = "0" + Math.round(second_input.value);
        second = string.slice(-2);
    } else {
        if (second_input.value > 59) second = 59;
        else second = "00";
    }
    //Output to inputfields and Countdown
    Output_func(hour, minute, second, false, 100);

    //convert to millseconds
    hourInMS = hour * 3600000;
    minuteInMS = minute * 60000;
    secondInMS = second * 1000;
    totalTimeInMS = hourInMS + minuteInMS + secondInMS;

    totalTimeInSeconds = totalTimeInMS / 1000;
    intrinsicTime = totalTimeInSeconds;

    progress.style.animation = "progress " + intrinsicTime + "s linear";

    if (checkColorchange.checked == true)
        bodyDiv.style.animation = "hueRotate " + intrinsicTime + "s linear";

    intervalVar = setInterval(() => {
        if (totalTimeInSeconds == 0) Timeout_func();
        else {
            totalTimeInSeconds--;
            //get percentage
            progressPercentage = (totalTimeInSeconds / intrinsicTime) * 100;

            if (second != 0) {
                second--;
            } else if (minute != 0 && second == 0) {
                second = 59;
                minute--;
            } else if (hour != 0 && minute == 0) {
                hour--;
                minute = 59;
                second = 59;
            }

            /* minute = Math.floor(totalTimeInSeconds / 60);
            second = totalTimeInSeconds % 60; */

            Output_func(hour, minute, second, true, progressPercentage);
        }
    }, 1000);
}

//things to happen after timeout
function Timeout_func() {
    clearInterval(intervalVar);
    Output_func("", "", "", false, 100);
    running = false;

    if (checkAlertText.checked) {
        custom.confirm("Timeout!", alertTextInput.value, "Ok").then((res) => {
            clearInterval(countUpInt);
        });

        var countUp = {
            s: 0,
            min: 0,
        };
        var countUpInt = setInterval(() => {
            countUp.s++;
            if (countUp.s == 60) {
                countUp.s = 0;
                countUp.min++;
            }

            document.querySelector(".dialogText h3").innerText =
                `Timeout since ${countUp.min > 0 ? countUp.min + "min" : ""} ${countUp.s}s!`; //prettier-ignore
        }, 1000);
    }

    bodyDiv.style.animation = false;
    progress.style.animation = false;

    if (checkBlinkText.checked == true)
        countdown.style.animation = "blink 2s linear";

    if (checkAlarmSound.checked == true) {
        audio.src = alarmSoundURL + alarmSound_options.value + alarmSoundSuffix;
        audio.play();
    }
}
//Output to inputfields and Countdown
function Output_func(hour, minute, second, running, progressPercentage) {
    if (running == false) {
        hour_input.value = hour;
        minute_input.value = minute;
        second_input.value = second;
    }
    hour = ("00" + hour).slice(-2);
    minute = ("00" + minute).slice(-2);
    second = ("00" + second).slice(-2);
    //countdown.innerHTML = hour + ":" + minute + ":" + second;
    hour_output.innerHTML = hour;
    minute_output.innerHTML = minute;
    second_output.innerHTML = second;

    //progress.style.width = progressPercentage + "%";
}
function preview_alarmSound_func() {
    audio.src = alarmSoundURL + alarmSound_options.value + alarmSoundSuffix;
    audio.play();
}
function hueRotation() {
    bodyDiv.style.filter = "hue-rotate(" + hue_rotation_slider.value + "deg)";
    checkColorchange.checked = false;
}
checkColorchange.addEventListener("click", function (event) {
    hue_rotation_slider.value = 0;
    bodyDiv.style.filter = "hue-rotate(0deg)";
});

/* function toggle_settings_view() {
    if (settings_dropDown.style.display == "none")
        settings_dropDown.style.display = "block";
    else settings_dropDown.style.display = "none";
} */
/* window.onclick = function() {
    if (settings_dropDown.style.display === "block")
        settings_dropDown.style.display = "none"; 
} */
//clear timeout and outputs
function stop_func() {
    clearInterval(intervalVar);
    Output_func("", "", "", false, 100);

    bodyDiv.style.animation = false;
    progress.style.animation = false;

    running = false;
    //location.reload();
}

//Just to test the Slider
/* function range() {
    progress.style.width =  document.getElementById("range").value + "%";
} */
