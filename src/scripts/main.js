//////// DevMode ///////
//prettier-ignore
var DevMode = {
    status: location.hostname == "127.0.0.1" ? true : sessionStorage.devModeStatus ? true : false,
    keepAcrossPages: false,
    callback: null,
    set(status) {
        this.status = status;
        this.execute();
    },
    toggle() {
        this.status = !this.status;
        this.execute();
    },
    execute() {
        console.group("%c DevMode ", this.consoleStyle)
        this.log();

        if (this.keepAcrossPages) sessionStorage.devModeStatus = this.status;
        else sessionStorage.removeItem("devModeStatus");

        if (this.callback) {
            let res = this.callback(this.status);
            if (res) text = res;
            else text = `settings ${this.status ? "applied" : "cleared"}`;
            
            console.log(`%c ${text} `, this.consoleStyle);
        }

        this.toggleItems(this.status);

        console.groupEnd();
    },
    log() {
        console.log(`%c ${this.status ? "enabled" : "disabled"} on: ${location.hostname} `, this.consoleStyle);
        if (!this.callback)
            console.warn("no DevMode callback available");
    },
    items: [],
    toggleItems(status) {
        const projectsDropdown = document.querySelector(".projects-dropdown");
        const devModeItem = document.querySelectorAll(".devModeItem")
        // console.log(this.items)
        
        switch (status) {
            case true:
                if (DevMode.items.length == 0) {
                    //adds a link to the playground page
                    let li = document.createElement("li");
                    li.classList.add("devModeItem");
                    li.innerHTML = `<a href="/playground" id="playgroundLink">playground</a>`;
                    projectsDropdown.append(li);
                    DevMode.items.push(li);
                    
                    //adds the devMode GUI elements
                    let devModeContainer = document.createElement("div")
                    devModeContainer.classList.add("devModeItem", "devModeContainer")
                    devModeContainer.innerHTML = `
                    <div class="toolbox">
                        <button class="quit" title="quit DevMode" onclick="DevMode.set(false)">
                            <i class="fas fa-power-off"></i>
                        </button>
                        <button class="log" title="log DevMode settings" onclick="DevMode.log()">
                            <i class="fas fa-info-circle"></i>
                        </button>
                        <button class="reExecute" title="reexecute DevMode settings" onclick="DevMode.execute()">
                            <i class="fas fa-redo-alt"></i>
                        </button>

                        <button onclick="location.href = 'webuntis.html'">
                            <i class="fad fa-calendar-alt"></i>
                        </button>

                        <button class="evalJS" onclick="test('eval')">
                            <i class="fab fa-js-square"></i>
                        </button>

                        <button title="show a prompt dialog" onclick="test('prompt')">
                            <i class="fas fa-keyboard"></i>
                        </button>
                        <button title="show a confirmation dialog" onclick="test('confirm')">
                            <i class="fad fa-window"></i>
                        </button>
                    </div>
                    <div class="userCountDisplay" style="display:none;"></div>
                    `
                    document.body.append(devModeContainer);
                    DevMode.items.push(devModeContainer);

                    let userCountDisplay = document.querySelector(".userCountDisplay")
                    getUserCountAsync().then((res) => {
                        userCountDisplay.innerHTML = `
                        <h3>UserCount</h3>
                        <p>on host: ${
                            res.onDomain.toString().length > 18
                                ? res.onDomain.toString().slice(0, 16) + "..."
                                : res.onDomain
                        }</P>
                        <p>Today: <b>${res.today}</b></P>
                        <p>Yesterday: ${res.yesterday}</P>
                        <p>Ever: ${res.ever}</P>
                        `;
                        userCountDisplay.style.display = "block";
                    });
                }
                break;
            case false:
                if (this.items) this.items.forEach((x) => x.remove())
                this.items = [];
                break;
        }
        // console.log(this.items)
        console.log(`%c items ${status ? "added" : "removed"} `, this.consoleStyle);
    },
    consoleStyle: 'color: rgb(3, 238, 31); background-color: black;',
};

$(document).ready(async () => {
    //elements
    const head = document.getElementsByTagName("HEAD")[0];
    const titleTag = document.querySelector("title");
    var navBarHeader = document.querySelector("#navBarHeader");
    var footer = document.querySelector("#footer");
    const body = document.body;

    //variables
    const data = JSON.parse(getFile("../../src/data/main.json"));

    getUserCountAsync()
        .then((res) => {
            console.groupCollapsed(
                `%c userCount: ${res.today}`,
                "color: orange; font-weight: 700;"
            );
            console.table(res);
            console.groupEnd();
        })
        .catch(console.warn);

    var locationURL = {
        prev: sessionStorage.currURL ? sessionStorage.currURL : undefined, //prettier-ignore
        curr: location.pathname,
    };
    sessionStorage.currURL = location.pathname;
    sessionStorage.prevURL = locationURL.prev;

    //create script for user counter
    const userCounterScript = document.createElement("script");
    userCounterScript.id = "ebsr5556uh";
    userCounterScript.src = `https://www.besucherzaehler-kostenlos.de/js/counter.js.php?count=1&id=floyd.elemonsters.de${ DevMode.status ? "(DevMode)" : "" }&start=0&design=5`; //prettier-ignore
    head.append(userCounterScript);

    //create link for favicon
    const linkFavicon = document.createElement("LINK");
    linkFavicon.rel = "shortcut icon";
    linkFavicon.type = "image/png";
    linkFavicon.href = "src/assets/images/icons/deinding_favicon.png";
    head.prepend(linkFavicon);

    // adds a prefix before the title
    titleTag.innerText = "dein.ding - " + titleTag.innerText;

    ////////////////////// Nav Bar //////////////////////
    //create new header if not already existing
    if (!navBarHeader) {
        navBarHeader = document.createElement("header");
        navBarHeader.id = "navBarHeader";
        document.body.prepend(navBarHeader);
    }
    navBarHeader.innerHTML = getFile("src/pageItems/navBar.html");

    //execute DevMode preferences
    if (DevMode.status) DevMode.execute();

    //adds the activeLink class to active links for the current page
    var activeLinks = body.dataset.activeLink;
    if (activeLinks[0] == "[") {
        activeLinks = eval(activeLinks);
        for (x in activeLinks) {
            document.querySelector(activeLinks[x]).classList.add("activeLink");
        }
    } else {
        console.log("else");
        activeLinks = activeLinks.toString().split(" ");
        activeLinks.forEach((item) => {
            // item.classList.add("activeLink");
        });
    }

    //adds a title and an alert to disabled links
    const disabledLink = document.querySelectorAll(".disabledLink");
    var disabledLinkMsg = "Diese Seite gibt es noch nicht :(";
    for (x in disabledLink) {
        disabledLink[x].title = disabledLinkMsg;
        disabledLink[x].onclick = () => {
            custom.confirm("", disabledLinkMsg, "Okay");
        };
    }

    //opens and closes the projects dropdown menu
    const projectsDrpdwntggl = document.querySelector(".projects-dropdown-toggle"); //prettier-ignore
    window.onclick = (event) => {
        if (event.target.matches(".prjct-tggl")) {
            if (projectsDrpdwntggl.checked == false)
                projectsDrpdwntggl.checked = true;
            else
                projectsDrpdwntggl.checked = false;
        } else projectsDrpdwntggl.checked = false;
    }; //prettier-ignore

    /////////////////////// footer ///////////////////////
    //create new footer if not already existing
    if (!footer) {
        footer = document.createElement("footer");
        footer.id = "pageFooter";
        document.body.append(footer);
    }
    footer.innerHTML = getFile("src/pageItems/footer.html");

    { //asigning URLs to links
    document.querySelector("footer .fa-soundcloud").href = data.links.soundcloud.href;
    document.querySelector("footer .fa-spotify").href = data.links.spotify.href;
    document.querySelector("footer .fa-instagram").href = data.links.instagram.href;
    } //prettier-ignore
});

test = async (type) => {
    switch (type) {
        case "confirm":
            custom
                .confirm(
                    "Attention",
                    "this is a confirmation dialog",
                    "Ok",
                    "leave me alone"
                )
                .then(console.info)
                .catch(console.info);
            break;
        case "prompt":
            console.info(
                "input recieved: " +
                    (await custom.prompt(
                        "Wait a sec,",
                        "this is a prompt for user input"
                    ))
            );
            break;
        case "eval":
            eval(
                await custom.prompt(
                    "evaluate JS",
                    "type in valid JavaScript for evaluation."
                )
            );
    }
};

getUserCount = () => {
    if (besucher)
        return {
            onDomain: location.hostname,
            online: besucher[0],
            today: besucher[1],
            yesterday: besucher[2],
            ever: besucher[3],
            since: besucher[4],
        };
    else return "not ready yet";
};

async function getUserCountAsync() {
    return new Promise((resolve, reject) => {
        let i = 1;
        let wait = setInterval(() => {
            // console.log(`waiting for user count... (${i})`);
            i++;
            if (i > 20) {
                clearInterval(wait);
                reject("could not fetch UserCount (besucher)");
            }

            if (window.besucher) {
                clearInterval(wait);
                resolve({
                    onDomain: location.hostname,
                    online: besucher[0],
                    today: besucher[1],
                    yesterday: besucher[2],
                    ever: besucher[3],
                    since: besucher[4],
                });
            }
        }, 200);
    });
}

getFile = (URL) => {
    var XHR = new XMLHttpRequest();
    XHR.open("GET", URL, false);
    XHR.send();

    //console.log("injected:" + XHR.responseText);
    return XHR.responseText;
};

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

/**
 * determine if a function call comes from the console
 */
fromConsole = () => {
    var stack;
    try {
        // Throwing the error for Safari's sake, in Chrome and Firefox
        // var stack = new Error().stack; is sufficient.
        throw new Error();
    } catch (e) {
        stack = e.stack;
    }
    if (!stack) return false;

    var lines = stack.split("\n");
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("at Object.InjectedScript.") >= 0) return true; // Chrome console
        if (lines[i].indexOf("@debugger eval code") == 0) return true; // Firefox console
        if (lines[i].indexOf("_evaluateOn") == 0) return true; // Safari console
        if (lines[i].indexOf("evaluateWithScopeExtension@[native code]") == 0)
            return true; // Safari console
    }
    return false;
};
/**
 * **manipulate color (RGB or HEX) values**
 *
 * documentation: https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 * @param {*} p
 * @param {*} c0 color 1
 * @param {*} c1 color 2
 * @param {*} l
 * @returns
 */
const pSBC = (p,c0,c1,l) => {
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
} //prettier-ignore
