const jsonPre = document.querySelector(".JSON");
const timetableGUI = document.querySelector(".timetable");
let WebuntisdJsonResponse;
let day = 17;

next = () => {
  day++;
  fetchWebuntisData(day);
};
prev = () => {
  day--;
  fetchWebuntisData(day);
};

fetchWebuntisData = (date) => {
  fetch(
    `http://localhost:3000/webuntis/timetable?username=HaremsFlo07&password=20041007&date=${date}`
  )
    .then((data) => data.json())
    .then((jsonData) => {
      WebuntisdJsonResponse = jsonData;
      jsonPre.innerHTML = syntaxHighlight(jsonData);
      timetable.createElement.day(jsonData.timetable);
    })
    .catch(console.warn);
};

const timetable = {
  createElement: {
    lesson: (lesson) => {
      let elem = document.createElement("div");
      elem.classList.add("lesson");
      if (lesson.status == "cancelled") elem.classList.add("cancelled");
      if (lesson.status == "irregular") elem.classList.add("irregular");

      elem.innerHTML = `
                    <button class="more-info-btn"><i class="fad fa-info-circle"></i></button>
                    <h3 class="name">${lesson.name}</h3>
                    <p class="teacher">${lesson.teacher.toString().replace(/,/g, ", ")}</p>                
                    
                    <p class="time">${lesson.startTime} - ${lesson.endTime}</p>
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

      timetableGUI.append(dayElem);
    },
  },
};

fetchWebuntisData("2021-6-23");
