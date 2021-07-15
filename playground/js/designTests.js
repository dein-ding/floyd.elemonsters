////////////////////////////////////////// BUTTONS /////////////////////////////////////////////////

const buttons = document.querySelectorAll(".btn-card button")

const buttonTexts = ["I'm a button", "Click me!", "I'm a button too", "beep", "boob"]
getRandomButtonText = () => buttonTexts[Math.floor(Math.random() * buttonTexts.length)]


buttons.forEach((btn, i) => {
    btn.innerText = getRandomButtonText()
    btn.classList.add(`btn-${parseInt(i) + 1}`)
    btn.style.setProperty("--i", i)
})

var i = 0;
buttonStaggerBump = setInterval(() => {
    i = i >= buttons.length ? 0 : i;

    buttons[i].style.animation = "";
    buttons[i].style.animation = "bump 800ms ease-out"

    i++
}, 500)



//////////////////////////////// tintedBackgroundsContainer ///////////////////////////////////////

const tintedBackgroundsContainer = document.querySelector("#tintedBackgroundsContainer");

// unsplash url handeling
const imageSize = "600x500";
const imageSearchWords = ["nature", "water", "forest", "mountains", "beach", "bigsur", "city", "bikes", "car", "berlin", "trippy"];
getImageUrl = (keyword, imageSize) => `https://source.unsplash.com/${imageSize}/?${keyword}`;
const imageUrls = imageSearchWords.map(keyword => getImageUrl(keyword, imageSize));

const firstImage = document.querySelector("img#first")
firstImage.setAttribute('crossOrigin', '');
firstImage.onload = () => document.querySelector(".first.card").style.backgroundColor = getDominantColor(firstImage, "rgb", true)

let imageCounter = 0;

createImageCard = (keyword, i) => {
    const url = getImageUrl(keyword, imageSize);
    i ||= imageCounter;

    const card = document.createElement("div");
    tintedBackgroundsContainer.append(card);
    card.className = `card card-${i}`
    card.innerHTML = `
    <div class="background" style="background: url(${url});"></div>
    <h3>${keyword}</h3>
    <img class="image-${i}" src="${url}" crossOrigin="">
    `;

    imageCounter++
}

imageSearchWords.forEach(createImageCard)

addImageCard = async () => {
    const keyword = await custom.prompt("Add an image card", "Type in a keyword to search for images on unsplash with.")
    createImageCard(keyword)

    setTimeout(document.querySelector("#tintedBackgroundsContainer .add-image-btn").scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
    }), 4500)

}



/**
 * **Get the dominant/average color of an image**
 * 
 * Stack Overflow Question: https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript
 * @param {HTMLImageElement | string} image HTMLImageElement or URL to an image
 * @param {string} colorFormat "rgb" | "rgba" | "hex"
 * @param {boolean} log log the calculated value
 * @returns color string (rgb || rgba || hex)
 */
function getDominantColor(image, colorFormat, log) {
    let imageObject;

    if (typeof image == "string") {
        imageObject = new Image();
        imageObject.setAttribute('crossOrigin', '');
        imageObject.src = image;
    }
    else if (typeof image == "object") imageObject = image;
    else console.error("no valid image object or URL provided")


    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.append(canvas)

    canvas.width = 1;
    canvas.height = 1;

    //draw the image to one pixel and let the browser find the dominant color
    ctx.drawImage(imageObject, 0, 0, 1, 1);

    //get pixel color
    const i = ctx.getImageData(0, 0, 1, 1).data;

    canvas.remove();

    let rgb = `rgb(${i[0]},${i[1]},${i[2]})`;
    let rgba = `rgba(${i[0]},${i[1]},${i[2]},${i[3]})`;
    let hex = "#" + ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1);

    switch (colorFormat) {
        case "rgb":
            if (log) console.log("%c" + rgb, `color: ${rgb}`);
            return rgb;
        case "rgba":
            if (log) console.log("%c" + rgba, `color: ${rgb}`);
            return rgba;
        default:
            if (log) console.log("%c" + hex, `color: ${hex}`);
            return hex;
    }


}