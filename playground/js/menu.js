const head = document.querySelector("head");
const fontAwsomeLink = document.createElement("link");
fontAwsomeLink.rel = "stylesheet";
fontAwsomeLink.href =
    "https://pro.fontawesome.com/releases/v5.13.0/css/all.css";
head.prepend(fontAwsomeLink);

const mainContainer = document.querySelector(".main-container");
const sidebar = document.createElement("div");
sidebar.classList.add("sidebar");
document.body.prepend(sidebar);

const linkButtons = `<a href="index.html" class="indexLink">index</a>
                   <a href="tagLibrary.html" class="tagLibraryLink">tagLibrary</a>
                   <a href="PHP-playground.php" class="phpPlaygroundLink">PHP playground</a>
                   <a href="playground.html" class="playgroundLink">playground</a>
                   <a href="../${sessionStorage.currURL}">return to main</a>
                   `; //prettier-ignore

sidebar.innerHTML = linkButtons;

document.querySelector(document.body.dataset.activeLink).classList.add("active");