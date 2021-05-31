const head = document.querySelector("head");
const fontAwsomeLink = document.createElement("link");
fontAwsomeLink.rel = "stylesheet";
fontAwsomeLink.href =
    "https://pro.fontawesome.com/releases/v5.13.0/css/all.css";
head.prepend(fontAwsomeLink);

const mainContainer = document.querySelector(".main-container");
var sidebar = document.createElement("div");
sidebar.classList.add("sidebar");
document.body.prepend(sidebar);

var linkButtons = `<a href="index.html">index</a>
                   <a href="tagLibrary.html">tagLibrary</a>
                   <a href="PHP-playground.php">PHP playground</a>
                   <a href="playground.html">playground</a>
                   <a href="../${sessionStorage.currURL}">return to main</a>
                   `; //prettier-ignore

sidebar.innerHTML = linkButtons;
