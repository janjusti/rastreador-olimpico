const today = new Date().toISOString().split('T')[0];
const olympicsDates = { "start": new Date('2024-07-24'), "end": new Date('2024-08-11') };
const paralympicsDates = { "start": new Date('2024-08-28'), "end": new Date('2024-09-08') };

class ScheduleEvent {
    constructor(unit, hasCustomCountry) {     
        this.hasCustomCountry = hasCustomCountry;   
        this.phaseName = unit.phaseName;
        this.eventUnitName = unit.eventUnitName;
        this.disciplineName = unit.disciplineName;
        this.startDate = new Date(unit.startDate);
        this.startText = unit.startText;
        this.status = unit.statusDescription;
        this.medalFlag = unit.medalFlag;
        this.competitors = unit.competitors;
        this.id = unit.id;
        this.mode = detectModeByDate(this.startDate);
        this.url = this.mode === 'olympics' ? 
            `https://olympics.com${unit.extraData.detailUrl}` :
            this.mode === 'paralympics' ? 
            `https://www.paralympic.org${unit.extraData.detailUrl}` : 
            null
    }
}

var URLparams = new URLSearchParams(window.location.search);

var filteredNOC = "BRA";
let sportsToFilter;
let NOCToFilter;
var fullData;
var medalsData = {};

function detectModeByDate(date) {
    if (date >= olympicsDates.start && date <= olympicsDates.end) {
        return 'olympics';
    } else if (date >= paralympicsDates.start && date <= paralympicsDates.end) {
        return 'paralympics';
    } else {
        return null;
    }
}

function clearStats() {
    fullData = {};
    medalsData = {};
    sportsToFilter = [];
    NOCToFilter = null;
    document.getElementById("filters").classList.remove('filter-active');
    document.getElementById("filters").innerHTML = "";
    document.getElementById("content").innerHTML = "Loading...";
}

document.addEventListener('DOMContentLoaded', (event) => {
    let datePicker = document.getElementById('datePicker');
    datePicker.value = today;
    datePicker.onchange = handleDateChange;
});

function handleDateChange() {
    clearStats();
    fetchData();
}

function start() {
    handleDateChange();
    interval = setInterval(fetchData, 5000);
}

function stop(message) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = message;
    const medalsDiv = document.getElementById('medals');
    medalsDiv.innerHTML = "";
    interval = clearInterval(interval);
}

function getSelectedDate() {
    var date = document.getElementById('datePicker')?.value;
    if (!date) {
        date = today;
    }
    return date
}

function generateDayURL() {
    var date = getSelectedDate();
    var dateObj = new Date(date);
    
    const mode = detectModeByDate(dateObj);
    const compType = mode === "olympics" ? "summer" : mode === "paralympics" ? "summer-para" : null;
    return compType ? `https://sph-s-api.olympics.com/${compType}/schedules/api/ENG/schedule/day/${date}` : null;
}

async function fetchMedals() {
    try {
        const currMode = detectModeByDate(new Date(getSelectedDate()));
        const url = (
            currMode === "olympics" ? 
            "https://olympics.com/OG2024/data/CIS_MedalNOCs~lang=ENG~comp=OG2024.json" :
            currMode === "paralympics" ? 
            "https://www.paralympic.org/OG2024/data/CIS_MedalNOCs~comp=PG2024~lang=ENG.json" :
            null
        )
        if (url === null) {
            return {};
        }
        const response = await fetch(url, {cache: "no-cache"});
        if (response.status !== 200) {
            return {};
        }
        const data = await response.json();
        if (data.medalNOC === undefined) {
            return {};
        }

        const lastMod = new Date(response.headers.get('Last-Modified'));
        const filteredList = data.medalNOC.filter(item => 
            item.gender === "TOT" && item.sport === "GLO"
        ).map(item => ({
            org: item.org,
            gold: item.gold,
            silver: item.silver,
            bronze: item.bronze,
            total: item.total,
            rank: item.rank
        }));

        const sortedList = filteredList.sort((a, b) => a.rank - b.rank);
        const newList = sortedList.slice(0, 5);
        const filteredIndex = sortedList.findIndex(item => item.org === filteredNOC);
        if (filteredIndex !== -1) {
            const filteredItem = sortedList[filteredIndex];

            if (filteredIndex > 0 && !newList.some(item => item.org === sortedList[filteredIndex - 1].org)) {
                newList.push(sortedList[filteredIndex - 1]);
            }
            if (filteredIndex < sortedList.length - 1 && !newList.some(item => item.org === sortedList[filteredIndex + 1].org)) {
                newList.push(sortedList[filteredIndex + 1]);
            }

            if (!newList.some(item => item.org === filteredNOC)) {
                newList.push(filteredItem);
            }
        }

        const finalSortedList = newList.sort((a, b) => a.rank - b.rank);

        return {"NOCs": finalSortedList, "last_mod": lastMod};
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


async function fetchData() {
    try {
        const dayURL = generateDayURL();
        if (dayURL === null) {
            stop("Nothing here today...");
            return;
        }
        let response = await fetch(dayURL, {cache: "no-cache"});
        if (response.status !== 200) {
            stop(`Error ${response.status} :(`);
            return;
        } 
        else if (interval === undefined && URLparams.get("onetime") === "false") {
            start();
        }
        const wasFullDataEmpty = isEmpty(fullData);
        fullData = await response.json();
        if (wasFullDataEmpty && !isEmpty(fullData)) {
            populateFilters();
        }
        medalsData = await fetchMedals();
        updatePage();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function isRealLive(unit) {
    return unit.liveFlag && ["interrupted"].every(item => item !== unit.status.toLowerCase())
}
function isRealPending(unit) {
    return !unit.liveFlag && ["finished", "cancelled"].every(item => item !== unit.status.toLowerCase())
}
function isRealFinished(unit) {
    return unit.status.toLowerCase() === "finished"
}

function filterData() {
    var filteredData = {"live": [], "pending": [], "finished": []};
    fullData.units.forEach(unit => {
        const hasCustomCountry = unit.competitors?.some(competitor => competitor.noc === filteredNOC);
        if (!hasCustomCountry && NOCToFilter !== null) {
            return;
        }
        if (sportsToFilter.length === 0) {
            if (isRealLive(unit)) {
                filteredData.live.push(new ScheduleEvent(unit, hasCustomCountry))
            }
            if (
                (unit.medalFlag != 0) ||
                (hasCustomCountry)
            ) {
                if (isRealPending(unit)) {
                    filteredData.pending.push(new ScheduleEvent(unit, hasCustomCountry))
                }
                else if (isRealFinished(unit)) {
                    filteredData.finished.push(new ScheduleEvent(unit, hasCustomCountry))
                }
            }
        } else if (sportsToFilter.includes(unit.disciplineName)) {            
            if (isRealLive(unit)) {
                filteredData.live.push(new ScheduleEvent(unit, false))
            }
            else if (isRealPending(unit)) {
                filteredData.pending.push(new ScheduleEvent(unit, false))
            }
            else if (isRealFinished(unit)) {
                filteredData.finished.push(new ScheduleEvent(unit, false))
            }
        }
    })
    return filteredData;
}

function populateFilters() {
    const filtersDiv = document.getElementById("filters");
    const uniqueDisciplines = [...new Set(fullData.units.map(unit => unit.disciplineName))].sort();

    const specialFilters = document.createElement("div");
    specialFilters.id = "special-filters";

    const allCheckbox = document.createElement("input");
    allCheckbox.type = "checkbox";
    allCheckbox.id = "all-checkbox";
    allCheckbox.addEventListener("change", function() {
        const checkboxes = disciplineFilters.querySelectorAll("input#discipline-checkbox");
        if (allCheckbox.checked) {
            disciplineFilters.classList.add('disabled')
            sportsToFilter = Array.from(checkboxes).map(checkbox => checkbox.value);
            filtersDiv.classList.add('filter-active');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
        } else {
            disciplineFilters.classList.remove('disabled');
            sportsToFilter = [];
            filtersDiv.classList.remove('filter-active');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }
        updatePage();
    });
    const allLabel = document.createElement("label");
    allLabel.textContent = "All";
    allLabel.appendChild(allCheckbox);
    specialFilters.appendChild(allLabel);

    const onlyNOCCheckbox = document.createElement("input");
    onlyNOCCheckbox.type = "checkbox";
    onlyNOCCheckbox.id = "onlyNOC-checkbox";
    onlyNOCCheckbox.addEventListener("change", function() {
        const contentDiv = document.getElementById("content");
        if (onlyNOCCheckbox.checked) {
            NOCToFilter = filteredNOC;
            contentDiv.classList.add('noc-filter-active');
        } else {
            NOCToFilter = null;
            contentDiv.classList.remove('noc-filter-active');
        }
        updatePage();
    });
    const onlyNOCLabel = document.createElement("label");
    onlyNOCLabel.textContent = `Only ${filteredNOC}`;
    onlyNOCLabel.appendChild(onlyNOCCheckbox);
    specialFilters.appendChild(onlyNOCLabel);

    filtersDiv.appendChild(specialFilters);

    const disciplineFilters = document.createElement("div");
    disciplineFilters.id = "discipline-filters";
    uniqueDisciplines.forEach(discipline => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "discipline-checkbox";
        checkbox.value = discipline;
        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
                sportsToFilter.push(checkbox.value);
            } else {
                sportsToFilter = sportsToFilter.filter(item => item !== checkbox.value);
            }
            if (sportsToFilter.length !== 0) {
                filtersDiv.classList.add('filter-active');
            } else {
                filtersDiv.classList.remove('filter-active');
            }
            updatePage();
            if (!checkbox.checked) {
                allCheckbox.checked = false;
            }
        });

        const label = document.createElement("label");
        label.textContent = discipline;
        label.appendChild(checkbox);

        disciplineFilters.appendChild(label);
    });

    filtersDiv.appendChild(disciplineFilters);
}


function populateMedals() {
    const medalsDiv = document.getElementById('medals');
    medalsDiv.innerHTML = '';

    if (medalsData.NOCs === undefined || medalsData.NOCs.length === 0) {
        return;
    }

    const table = document.createElement('table');
    const currMode = detectModeByDate(new Date(getSelectedDate()));
    const medalTableURL = (
        currMode === "olympics" ? 
        "https://olympics.com/en/paris-2024/medals" :
        currMode === "paralympics" ? 
        "https://www.paralympic.org/en/paris-2024-paralympics/medals" :
        null
    )
    table.setAttribute('onclick', `window.open('${medalTableURL}', '_blank').focus();`);
    const headerRow = document.createElement('tr');
    const headers = ['Rank', 'Country', 'Gold', 'Silver', 'Bronze', 'Total'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    medalsData.NOCs.forEach(item => {
        const row = document.createElement('tr');
        if (item.org === filteredNOC) {
            row.classList.add('filteredNOC');
        }
        const data = [
            item.rank, 
            item.org, 
            item.gold, 
            item.silver, 
            item.bronze, 
            item.total
        ];        
        data.forEach((text, index) => {
            const td = document.createElement('td');
            
            if (index === 1) {
                td.classList.add("country");
                const img = document.createElement('img');
                img.classList.add("flag");
                img.src = (
                    currMode === "olympics" ? 
                    `https://gstatic.olympics.com/s1/t_original/static/noc/oly/3x2/180x120/${text}.png` :
                    currMode === "paralympics" ? 
                    `https://www.paralympic.org/OG2024/assets/images/flags/PG2024/${text}.webp` :
                    null
                )
                td.appendChild(img);
                td.appendChild(document.createTextNode(text));
            } else {
                td.textContent = text;
            }

            row.appendChild(td);
        });
        table.appendChild(row);
    });
    
    const lastMod = document.createElement('span');
    const formattedDate = medalsData.last_mod.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(',', '');
    lastMod.innerText = `Latest update: ${formattedDate} (${calculateTimeDifference(medalsData.last_mod)})`

    medalsDiv.appendChild(table);
    medalsDiv.appendChild(lastMod);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour12: false });
}

function calculateTimeDifference(targetDateTime) {
    const now = new Date();
    const targetTime = new Date(targetDateTime);
    let difference = targetTime - now;

    const isFuture = difference >= 0;

    if (!isFuture) {
        difference = now - targetTime;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    let formattedTime = '';
    if (days > 0) {
        formattedTime += `${days}d`;
    }
    if (hours > 0 || days > 0) {
        formattedTime += `${hours}h`;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        formattedTime += `${minutes}m`;
    }
    if (seconds > 0 || (!days && !hours && !minutes)) {
        formattedTime += `${seconds}s`;
    }

    return isFuture ? `-${formattedTime}` : formattedTime;
}

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}

function liveEventsSort(a, b) {
    if (a.status === "Getting Ready" && a.hasCustomCountry === true) return -1;
    if (b.status === "Getting Ready" && b.hasCustomCountry === true) return 1;
    if (a.medalFlag !== 0 && a.hasCustomCountry === true) return -1;
    if (b.medalFlag !== 0 && b.hasCustomCountry === true) return 1;
    if (a.hasCustomCountry === true) return -1;
    if (b.hasCustomCountry === true) return 1;
    if (a.medalFlag !== 0 && a.status === "Getting Ready") return -1;
    if (b.medalFlag !== 0 && b.status === "Getting Ready") return 1;
    if (a.status === "Getting Ready") return -1;
    if (b.status === "Getting Ready") return 1;
    if (a.medalFlag !== 0) return -1;
    if (b.medalFlag !== 0) return 1;
    return -1;
}

function pendingEventsSort(a, b) {
    if (a.status !== "Scheduled" && b.status === "Scheduled") return 1;
    if (a.status === "Scheduled" && b.status !== "Scheduled") return -1;
    if (a.status !== "Rescheduled" && b.status === "Rescheduled") return 1;
    if (a.status === "Rescheduled" && b.status !== "Rescheduled") return -1;
    return 0;
}

function competitorsSort(a, b) {
    const positionA = a.results?.position ? parseInt(a.results?.position, 10) : null;
    const positionB = b.results?.position ? parseInt(b.results?.position, 10) : null;

    if (positionA !== null && positionB !== null) {
        return positionA - positionB;
    }
    if (positionA !== null) {
        return -1;
    }
    if (positionB !== null) {
        return 1;
    }
    return a.order - b.order;
}

function updatePage() {
    populateMedals();
    
    var data = filterData();
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    const categories = ['pending', 'live', 'finished'];
    categories.forEach(category => {
        let events = data[category];
        if (events.length === 0) {
            return;
        }
        const categoryDiv = document.createElement('div');
        categoryDiv.className = `${category}-container`;

        const title = document.createElement('h1');
        title.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        categoryDiv.appendChild(title);
        if (category === 'pending') {
            events = events.sort(pendingEventsSort);
        }
        if (category === 'live') {
            events = events.sort(liveEventsSort);
        }
        if (category === 'finished') {
            events = events.slice().reverse();
        }

        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';

            const startTime = formatTime(event.startDate);
            let elapsedTime = calculateTimeDifference(event.startDate);

            let competitorsHTML = '';
            let shownCompetitors = new Set();

            var competitors = event.competitors;
            if (competitors === undefined) {
                competitors = [];
            }
            competitors = competitors.sort(competitorsSort);

            competitors.slice(0, 4).forEach(competitor => {
                let additionalClass = competitor.noc === filteredNOC ? ' filteredNOC' : '';
                const position = competitor.order + 1;
                competitorsHTML += `<div class="competitors${additionalClass}">${position}: ${competitor.name} (${competitor.noc})`;
                if (competitor.results) {
                    let resultsHTML = '';
                    for (const [key, value] of Object.entries(competitor.results)) {
                        if (value) {
                            resultsHTML += `${key}: ${value}<br>`;
                        }
                    }
                    if (resultsHTML) {
                        competitorsHTML += `<br><div class="results">${resultsHTML}</div>`;
                    }
                }
                competitorsHTML += "</div>";
                shownCompetitors.add(competitor.name);
            });
            
            competitors.forEach(competitor => {
                if (competitor.noc === filteredNOC && !shownCompetitors.has(competitor.name)) {
                    competitorsHTML += `<div class="competitors filteredNOC">${competitor.order + 1}: ${competitor.name} (${competitor.noc})`;
                    if (competitor.results) {
                        let resultsHTML = '';
                        for (const [key, value] of Object.entries(competitor.results)) {
                            if (value) {
                                resultsHTML += `${key}: ${value}<br>`;
                            }
                        }
                        if (resultsHTML) {
                            competitorsHTML += `<br><div class="results">${resultsHTML}</div>`;
                        }
                    }
                    competitorsHTML += "</div>";
                    shownCompetitors.add(competitor.name);
                }
            });

            const eventTitleDiv = document.createElement('div');
            eventTitleDiv.className = 'eventTitle';
            eventTitleDiv.innerHTML = `<span>${event.disciplineName} - ${event.eventUnitName}</span>`;
            if (event.medalFlag != 0) {
                eventTitleDiv.classList.add('medal');
            }
            if (event.medalFlag === 1) {
                eventTitleDiv.classList.add('gold');
            }
            if (event.medalFlag === 3) {
                eventTitleDiv.classList.add('bronze');
            }
            if (event.status === "Getting Ready") {
                eventTitleDiv.classList.add('gettingReady');
            }
            eventTitleDiv.setAttribute('onclick', `window.open('${event.url}', '_blank').focus();`);

            const eventStatusDiv = document.createElement('div');
            eventStatusDiv.className = 'eventStatus';
            if (elapsedTime.startsWith("-")) {
                eventStatusDiv.classList.add("futureEvent");
            }
            eventStatusDiv.innerHTML = `${startTime} (${elapsedTime})<br>`;
            eventStatusDiv.innerHTML += `${event.status}${event.startText === "" ? "" : " (" + event.startText + ")"}`

            eventDiv.innerHTML = '';
            eventDiv.appendChild(eventTitleDiv);
            eventDiv.appendChild(eventStatusDiv);

            eventDiv.innerHTML += competitorsHTML;

            categoryDiv.appendChild(eventDiv);
        });

        contentDiv.appendChild(categoryDiv);
    });
    delete(data);
}

var interval;
start();