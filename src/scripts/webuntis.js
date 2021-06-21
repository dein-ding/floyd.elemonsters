const jsonPre = document.querySelector(".JSON");
const timetableWeek = document.querySelector(".timetableWeek");
const timegridElem = document.querySelector(".timegrid");
const sidebarToggle = document.querySelector("#sidebar-toggle");
let WebuntisdJsonResponse = getDummyResponse();
let day = 17;
let month = 5;
let year = 2021;

toggleSidebar = () => (sidebarToggle.checked = !sidebarToggle.checked);

next = () => {
	day++;
	fetchWebuntisData(`${year}-${month}-${day}`);
};
prev = () => {
	day--;
	fetchWebuntisData(`${year}-${month}-${day}`);
};

fetchWebuntisData = date => {
	/* fetch(
    `http://localhost:3000/webuntis/everything?username=GroßerSep25&password=20011025&date=${date}`
  )
    .then((data) => data.json())
    .then((jsonData) => {
      WebuntisdJsonResponse = jsonData;
      jsonPre.innerHTML = syntaxHighlight(jsonData);
      timetable.createElement.day(jsonData.timetable);
      timetable.createElement.timeStack(jsonData.timegrid);
    })
    .catch(console.warn); */
	jsonPre.innerHTML = syntaxHighlight(WebuntisdJsonResponse);
	timetable.render();
};

const timetable = {
	render: () => {
		timetable.createElement.timeStack(WebuntisdJsonResponse.timegrid);
		timetable.createElement.emptyShell(WebuntisdJsonResponse.timegrid);
		timetable.fillWithData(WebuntisdJsonResponse.timetable);
		// timetable.createElement.day(WebuntisdJsonResponse.timetable);
	},
	fillWithData: timetableWeek => {
		const timetableDayElems_ = document.querySelectorAll(".timetableDay");
		for (i in timetableWeek) {
			console.log("--------------------------");
			let timetableDay = timetableWeek[i];
			// timetableWeek[i].forEach(console.log)
			// console.log(timetableWeek[i])

			lesson_I = 0;
			for (x in timetableDayElems_[i].childNodes) {
				if (timetableDayElems_[i].childNodes[x].classList == "lesson") {
					let lesson = timetableDay[lesson_I];
					lesson_I++;
					// console.log(timetableDayElems_[i].childNodes[x]);

					if (lesson_I <= timetableDay.length) {
						if (lesson.status == "cancelled") timetableDayElems_[i].childNodes[x].classList.add("cancelled"); //prettier-ignore
						if (lesson.status == "irregular") timetableDayElems_[i].childNodes[x].classList.add("irregular"); //prettier-ignore
						if (lesson.status == "free") timetableDayElems_[i].childNodes[x].classList.add("free"); //prettier-ignore
						if (lesson.status == "") timetableDayElems_[i].childNodes[x].classList.add("regular"); //prettier-ignore

						if (lesson.status != "free")
                        timetableDayElems_[i].childNodes[x].innerHTML = `
                            <button class="more-info-btn"><i class="fad fa-info-circle"></i></button>
                            <h3 class="name">${lesson.name}</h3>
                            <p class="teacher">${lesson.teacher.toString().replace(/,/g, ", ")}</p>
                            <p class="room">${lesson.room.toString().replace(/,/g, ", ")}</p>
                        `; //prettier-ignore
					}
				}
			}
		}
	},
	createElement: {
		lesson: lesson => {
			let elem = document.createElement("div");
			elem.classList.add("lesson");
			if (lesson.status == "cancelled") elem.classList.add("cancelled");
			if (lesson.status == "irregular") elem.classList.add("irregular");
			if (lesson.status == "free") elem.classList.add("free");
			if (lesson.status == "") elem.classList.add("regular");

			if (lesson.status != "free")
			elem.innerHTML = `
                    <button class="more-info-btn"><i class="fad fa-info-circle"></i></button>
                    <h3 class="name">${lesson.name}</h3>
                    <p class="teacher">${lesson.teacher.toString().replace(/,/g, ", ")}</p>
                    <p class="room">${lesson.room.toString().replace(/,/g, ", ")}</p>
                `; //prettier-ignore

			return elem;
		},
		day: timetableDay => {
			const dayElem = document.createElement("div");
			dayElem.classList.add("timetableDay");
			dayElem.innerHTML = `
                    <div class="day">
                        <h2 style="margin-top: 0;">${WebuntisdJsonResponse.day} ← ${WebuntisdJsonResponse.requestQueries.dateReadable.replace(/-/g, ".")}</h2>
                    </div>
                `; //prettier-ignore

			timetableDay.forEach(lesson =>
				dayElem.append(timetable.createElement.lesson(lesson))
			);

			timetableWeek.append(dayElem);
		},
		emptyLesson: () => {},
		emptyShell: timegrid => {
			/* for (i = 0; i < 5; i++) {
				const dayElem = document.createElement("div");
				dayElem.classList.add("timetableDay");
				dayElem.innerHTML = `
                    <div class="day">
                        <h2 style="margin-top: 0;">Day</h2>
                    </div>
                `; //prettier-ignore

				WebuntisdJsonResponse.timegrid.forEach(lesson => {
					let emptyLesson = document.createElement("div");
					emptyLesson.classList.add("lesson");

					dayElem.append(emptyLesson);
				});

				timetableWeek.append(dayElem);
			} */
			const timetableDayElems =
				document.querySelectorAll(".timetableDay");

			timetableDayElems.forEach(elem => {
				timegrid.forEach(lesson => {
					let emptyLesson = document.createElement("div");
					emptyLesson.classList.add("lesson");

					elem.append(emptyLesson);
				});
			});
		},
		time: (startTime, endTime) => {
			const timeElem = document.createElement("div");
			timeElem.classList.add("time");
			timeElem.innerHTML = `
            <h3 class="startTime">${startTime}</h3>
            <h4 class="endTime">${endTime}</h4>
        `; //prettier-ignore

			timegridElem.append(timeElem);
		},
		timeStack: timegrid => {
			timegrid.forEach(time => {
				timetable.createElement.time(time.startTime, time.endTime);
			});
		},
	},
};

fetchWebuntisData(`${year}-${month}-${day}`);

function getDummyResponse() {
	return {
		requestQueries: {
			dateReadable: "2021-5-17",
			date: "2021-05-17T00:00:00.000Z",
			username: "GroßerSep25",
			password: "20011025",
			school: "OSZ KIM_Berlin",
			base_url: "urania.webuntis.com",
			homeschooling: false,
			no_conference: ["Sport", "Webtechnologien"],
		},
		day: "monday",
		timegrid: [
			{
				startTime: "08:00",
				endTime: "09:30",
			},
			{
				startTime: "09:50",
				endTime: "11:20",
			},
			{
				startTime: "11:40",
				endTime: "13:10",
			},
			{
				startTime: "13:40",
				endTime: "15:10",
			},
			{
				startTime: "15:20",
				endTime: "16:50",
			},
		],
		firstLesson: {
			status: "irregular",
			name: "DE Klausur Nachschreiber",
			room: "B 0.07",
			teacher: "",
			startTime: "13:40",
			endTime: "15:10",
			lessonNumber: 4,
		},
		timetable: [
			[
				{
					status: "cancelled",
					name: "Betriebswirtscahftliche Prozesse",
					room: "A 2.14",
					teacher: "Scheller",
					startTime: "08:00",
					endTime: "09:30",
					lessonNumber: 1,
				},
				{
					status: "",
					name: "Sport",
					room: "SP-NE",
					teacher: "Puhlmann",
					startTime: "09:50",
					endTime: "11:20",
					lessonNumber: 2,
				},
				{
					status: "free",
					name: "",
					room: "",
					teacher: "",
					startTime: "",
					endTime: "",
					lessonNumber: 3,
				},
				{
					status: "irregular",
					name: "DE Klausur Nachschreiber",
					room: "B 0.07",
					teacher: "",
					startTime: "13:40",
					endTime: "15:10",
					lessonNumber: 4,
				},
			],
			[
				{
					status: "",
					name: "Deutsch",
					room: "Online",
					teacher: "Hryniewicz",
					startTime: "08:00",
					endTime: "09:30",
					lessonNumber: 0,
					info: "Arbeitsauftrag im Lernraum",
				},
				{
					status: "",
					name: "Wirtschafts- und Sozialkunde",
					room: "Online",
					teacher: "Johow",
					startTime: "09:50",
					endTime: "11:20",
					lessonNumber: 0,
				},
				{
					status: "",
					name: "Mathematik",
					room: "Online",
					teacher: "Spieß",
					startTime: "11:40",
					endTime: "13:10",
					lessonNumber: 0,
					info: "Arbeitsauftrag im Lernraum: Coladose Aufgabe 1-4. Fristverlängerung: Abgabe bis Mi 19.5.",
				},
				{
					status: "",
					name: "Audiotechnik",
					room: "Online",
					teacher: "Johow",
					startTime: "13:40",
					endTime: "15:10",
					lessonNumber: 0,
				},
			],
			[
				{
					status: "cancelled",
					name: "Mediendesign",
					room: "B 3.04",
					teacher: "Lippert",
					startTime: "08:00",
					endTime: "09:30",
					lessonNumber: 0,
				},
				{
					status: "",
					name: "Videotechnik",
					room: "Online_",
					teacher: ["Monsh", "Biehl"],
					startTime: "09:50",
					endTime: "11:20",
					lessonNumber: 0,
					info: "FERNUNTERRICHT",
				},
				{
					status: "",
					name: "Englisch",
					room: "Online",
					teacher: "Riethdorf",
					startTime: "11:40",
					endTime: "13:10",
					lessonNumber: 0,
				},
				{
					status: "",
					name: "Mediendesign",
					room: "Online",
					teacher: "Lippert",
					startTime: "13:40",
					endTime: "15:10",
					lessonNumber: 0,
				},
			],
			[
				{
					status: "",
					name: "Videotechnik",
					room: "B 2.07",
					teacher: "Monshausen",
					startTime: "08:00",
					endTime: "09:30",
					lessonNumber: 0,
					info: "HYBRIDUNTERRICHT: Präsenz & https://www.lernraum-berlin.de/osz/mod/bigbluebuttonbn/view.php?id=1019052",
				},
				{
					status: "",
					name: "Audiotechnik",
					room: "B 1.17",
					teacher: ["Spieß", "Johow"],
					startTime: "09:50",
					endTime: "11:20",
					lessonNumber: 0,
				},
				{
					status: "",
					name: "Webtechnologien",
					room: "B 2.13",
					teacher: "Heinig",
					startTime: "11:40",
					endTime: "13:10",
					lessonNumber: 0,
				},
				{
					status: "",
					name: "Betriebswirtscahftliche Prozesse",
					room: ["B 2.08", "A 2.09"],
					teacher: ["Schel", "Stein"],
					startTime: "13:40",
					endTime: "15:10",
					lessonNumber: 0,
					info: "Klassenarbeit zum Thema: Handelskalkulation (alle Varianten!) Diese Klassenarbeit findet in Präsenz statt!!!",
				},
			],
			[
				{
					status: "",
					name: "Webtechnologien",
					room: "B 2.10",
					teacher: "Heinig",
					startTime: "08:00",
					endTime: "09:30",
					lessonNumber: 0,
				},
				{
					status: "",
					name: "Audiotechnik",
					room: "V 0.04",
					teacher: "Johow",
					startTime: "09:50",
					endTime: "11:20",
					lessonNumber: 0,
					info: "WSK Klassenarbeit",
				},
				{
					status: "",
					name: "Webtechnologien",
					room: ["B 2.06", "B 2.07"],
					teacher: ["Heinig", "Heinig"],
					startTime: "11:40",
					endTime: "13:10",
					lessonNumber: 0,
				},
				{
					status: "",
					name: "Webtechnologien",
					room: "B 2.07",
					teacher: ["Kuhl", "Heinig"],
					startTime: "13:40",
					endTime: "15:10",
					lessonNumber: 0,
				},
			],
		],
	};
}
