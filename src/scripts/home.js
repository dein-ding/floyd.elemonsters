$(document).ready(async function () {
  /* just for testing */
  /* document
        .querySelector(":root")
        .style.setProperty("--navBarBackground", "rgba(0, 0, 0, .3)"); */
  //console.log(document.querySelector("body").dataset);

  setTimeout(() => {
    if (!sessionStorage.hasBeenPrompted) {
      custom.confirm(
        "Attention",
        "This website is work in progress, so be kind if there are bugs.",
        "continue"
      );
      sessionStorage.hasBeenPrompted = true;
    }
  }, 500);
});
