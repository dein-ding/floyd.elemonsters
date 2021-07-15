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

fetchWebuntisData = (date) => {
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
    fillWithData: (timetableWeek) => {
        const timetableDayElems_ = document.querySelectorAll(".timetableDay");
        for (i in timetableWeek) {
            console.log("--------------------------");
            const timetableDay = timetableWeek[i];

            const unsortedChildNodes = timetableDayElems_[i].childNodes;
            let lessonChildNodes = [];
            unsortedChildNodes.forEach((childNode) => {
                if (childNode.classList == "lesson") lessonChildNodes.push(childNode);
            });
            console.log(lessonChildNodes);

            for (x in lessonChildNodes) {
                let lesson = timetableDay[x];
                let lessonNumber = lesson.lessonNumber;

                if (lessonNumber != x) continue;

                let currentChildNote = lessonChildNodes[x];

                if (x <= timetableDay.length) {
                    if (lesson.status == "cancelled") currentChildNote.classList.add("cancelled"); //prettier-ignore   
                    if (lesson.status == "irregular") currentChildNote.classList.add("irregular"); //prettier-ignore
                    if (lesson.status == "free") currentChildNote.classList.add("free"); //prettier-ignore
                    if (lesson.status == "") currentChildNote.classList.add("regular"); //prettier-ignore

                    if (lesson.status != "free")
                        currentChildNote.innerHTML = `
                    <button class="more-info-btn"><i class="fad fa-info-circle"></i></button>
                    <h3 class="name">${lesson.name}</h3>
                    <p class="teacher">${lesson.teacher.toString().replace(/,/g, ", ")}</p>
                    <p class="room">${lesson.room.toString().replace(/,/g, ", ")}</p>
                `; //prettier-ignore
                }
            }
        }
    },
    createElement: {
        lesson: (lesson) => {
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
        day: (timetableDay) => {
            const dayElem = document.createElement("div");
            dayElem.classList.add("timetableDay");
            dayElem.innerHTML = `
                    <div class="day">
                        <h2 style="margin-top: 0;">${WebuntisdJsonResponse.day} ← ${WebuntisdJsonResponse.requestQueries.dateReadable.replace(/-/g, ".")}</h2>
                    </div>
                `; //prettier-ignore

            timetableDay.forEach((lesson) =>
                dayElem.append(timetable.createElement.lesson(lesson))
            );

            timetableWeek.append(dayElem);
        },
        emptyLesson: () => { },
        emptyShell: (timegrid) => {
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
            const timetableDayElems = document.querySelectorAll(".timetableDay");

            timetableDayElems.forEach((elem) => {
                timegrid.forEach((lesson) => {
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
        timeStack: (timegrid) => {
            timegrid.forEach((time) => {
                timetable.createElement.time(time.startTime, time.endTime);
            });
        },
    },
};

fetchWebuntisData(`${year}-${month}-${day}`);

function getDummyResponse() {
    return JSON.parse(getFile("./src/data/webUntisDummyResponse.json"));
}
