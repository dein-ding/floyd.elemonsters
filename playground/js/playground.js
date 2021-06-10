const Time = {
	output: {
		days: {
			meter: document.querySelector(".timeOutputContainer .day"),
		},
		hours: {
			span: document.querySelector("#timeOutput span:first-of-type"),
			meter: document.querySelector(".timeOutputContainer .hour"),
		},
		minutes: {
			span: document.querySelector("#timeOutput span:nth-of-type(2n)"),
			meter: document.querySelector(".timeOutputContainer .minute"),
		},
		seconds: {
			span: document.querySelector("#timeOutput span:nth-of-type(3n)"),
			meter: document.querySelector(".timeOutputContainer .second"),
		},
	},
	start() {
		Time.refresh();
		Time.cycle = setInterval(Time.refresh, 50);

		document.querySelector("#timeOutput button").innerText = "stop";
		document.querySelector("#timeOutput button").onclick = () => Time.stop();
	},
	stop() {
		clearInterval(Time.cycle)
		document.querySelector("#timeOutput button").innerText = "start";
		document.querySelector("#timeOutput button").onclick = () => Time.start();
	},
	display(time) {
		Time.output.days.meter.value = time.getHours();

		Time.output.hours.span.innerText = ("0" + time.getHours()).slice(-2);
		Time.output.hours.meter.value = time.getMinutes();

		Time.output.minutes.span.innerText = ("0" + time.getMinutes()).slice(-2); //prettier-ignore
		Time.output.minutes.meter.value = time.getSeconds();

		Time.output.seconds.span.innerText = ("0" + time.getSeconds()).slice(-2); //prettier-ignore
		Time.output.seconds.meter.value = time.getMilliseconds();
	},
	refresh() {
		Time.display(new Date());
	},
};
Time.refresh();

sounds = () => {
    const sounds = [
        "../src/assets/sounds/die-sound.mp3",
        "../src/assets/sounds/Hahn.mp3",
        "../src/assets/sounds/Harfe.mp3",
        "../src/assets/sounds/Trompete.mp3",
        "../src/assets/sounds/Weckerpiepen.mp3",
    ];
    return sounds[ Math.floor(Math.random() * 5) ];
}

/* const ctx = new (window.AudioContext || window.webkitAudioContext)();
let audio_;
playback = () => {
	fetch(sounds())
		.then(data => data.arrayBuffer())
		.then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
		.then(decodedAudio => {
			audio_ = decodedAudio;
		});

	const playSound = ctx.createBufferSource();
	playSound.buffer = audio_;
	playSound.connect(ctx.destination);
	playSound.start(ctx.currentTime);

	console.log("playback");
};

const playButton = document.querySelector("#playButton");

playButton.addEventListener("click", playback); */

const audio = document.querySelector("audio")
const bt = document.querySelector("#playButton");

playAudio = () => {
    audio.play();
}

console.log(audio);
const startPlaying = () => {
    audio.src = sounds();
	audio.play();
};

bt.addEventListener("click", startPlaying);

// audio.addEventListener("playing", startPlaying);
audio.addEventListener("error", (err) => {
	console.log("error: " + err);
});


////////////////// PONG GAME ////////////////////////
/*  
    audio: {
        audioElem: audio,
        setSrc: (URL) => {
            URL ||= "../src/assets/sounds/die-sound.mp3";
            game.audio.audioElem.src = URL;
        },
        play: (URL) => {
            game.audio.setSrc(URL)
            game.audio.audioElem.play()
        },
        dummyAudio: "https://raw.githubusercontent.com/anars/blank-audio/master/500-milliseconds-of-silence.mp3",
        dummyPlay: () => {
            game.audio.audioElem.play()
            game.audio.audioElem.pause()
        }
    }, 
*/