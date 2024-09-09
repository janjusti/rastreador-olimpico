(()=>{const e="2024-09-08",t=m("2024-07-24","2024-08-11"),n=m("2024-08-28","2024-09-08");class a{constructor(e,t){this.hasCustomCountry=t,this.phaseName=e.phaseName,this.eventUnitName=e.eventUnitName,this.disciplineName=e.disciplineName,this.startDate=new Date(e.startDate),this.startText=e.startText,this.order=e.order,this.status=e.statusDescription,this.medalFlag=e.medalFlag,this.competitors=e.competitors,this.id=e.id,this.mode=p(this.startDate),this.url="olympics"===this.mode?`https://olympics.com${e.extraData.detailUrl}`:"paralympics"===this.mode?`https://www.paralympic.org${e.extraData.detailUrl}`:null}}var s=new URLSearchParams(window.location.search),i=s.has("NOC")?s.get("NOC"):"BRA";let l,o,c;var d,r,u={};function m(e,t){return{start:new Date(`${e} 00:00:00`),end:new Date(`${t} 23:59:59`)}}function p(e){return e>=t.start&&e<=t.end?"olympics":e>=n.start&&e<=n.end?"paralympics":null}function h(e){const t=new Date(datePicker.value);t.setDate(t.getDate()+e),datePicker.value=t.toISOString().split("T")[0],g()}function g(){d={},u={},l=[],o=null,c=!1,document.getElementById("filters").classList.remove("filter-active"),document.getElementById("filters").innerHTML="",document.getElementById("content").innerHTML="Loading...",C()}function f(){g(),r=setInterval(C,5e3)}function v(e){document.getElementById("content").innerHTML=e,document.getElementById("medals").innerHTML="",r=clearInterval(r)}function y(){var t=document.getElementById("datePicker")?.value;return t||(t=e),t}async function C(){try{const e=function(){const e=s.get("customDayURL");if(null!==e)return e;var t=y();const n=p(new Date(t)),a="olympics"===n?"summer":"paralympics"===n?"summer-para":null;return a?`https://sph-s-api.olympics.com/${a}/schedules/api/ENG/schedule/day/${t}`:null}();if(null===e)return void v("Nothing here today...");let t=await fetch(e,{cache:"no-cache"});if(200!==t.status)return void v(`Error ${t.status} :(`);void 0===r&&"false"===s.get("onetime")&&f();const n=x(d);(d=await t.json()).units=d.units.filter((e=>!e.competitors?.some((e=>""===e.name)))),n&&!x(d)&&function(){const e=document.getElementById("filters"),t=[...new Set(d.units.map((e=>e.disciplineName)))].sort(),n=document.createElement("div");n.id="special-filters";const a=$("all-checkbox","All",(function(){const t=u.querySelectorAll("input#discipline-checkbox");this.checked?(u.classList.add("disabled"),l=Array.from(t).map((e=>e.value)),e.classList.add("filter-active"),t.forEach((e=>{e.checked=!0}))):(u.classList.remove("disabled"),l=[],e.classList.remove("filter-active"),t.forEach((e=>{e.checked=!1}))),O()}));n.appendChild(a);const s=$("onlyNOC-checkbox",`Only ${i}`,(function(){const e=document.getElementById("content");this.checked?(o=i,e.classList.add("noc-filter-active")):(o=null,e.classList.remove("noc-filter-active")),O()}));n.appendChild(s);const r=$("onlyMedals-checkbox","Only Medals",(function(){const e=document.getElementById("content");this.checked?(c=!0,e.classList.add("medals-filter-active")):(c=!1,e.classList.remove("medals-filter-active")),O()}));n.appendChild(r),e.appendChild(n);const u=document.createElement("div");u.id="discipline-filters",u.addEventListener("scroll",(function(){u.scrollTop>0?u.classList.add("scrolled"):u.classList.remove("scrolled")})),t.forEach((t=>{const n=document.createElement("input");n.type="checkbox",n.id="discipline-checkbox",n.value=t,n.addEventListener("change",(function(){n.checked?l.push(n.value):l=l.filter((e=>e!==n.value)),0!==l.length?e.classList.add("filter-active"):e.classList.remove("filter-active"),O()}));const a=document.createElement("label");a.textContent=t,a.appendChild(n),u.appendChild(a)})),e.appendChild(u)}(),u=await async function(){try{const e=p(new Date(y())),t="olympics"===e?"https://olympics.com/OG2024/data/CIS_MedalNOCs~lang=ENG~comp=OG2024.json":"paralympics"===e?"https://www.paralympic.org/OG2024/data/CIS_MedalNOCs~comp=PG2024~lang=ENG.json":null;if(null===t)return{};const n=await fetch(t,{cache:"no-cache"});if(200!==n.status)return{};const a=await n.json();if(void 0===a.medalNOC)return{};const s=new Date(n.headers.get("Last-Modified"));return{NOCs:a.medalNOC.filter((e=>"TOT"===e.gender&&"GLO"===e.sport)).map((e=>({org:e.org,gold:e.gold,silver:e.silver,bronze:e.bronze,total:e.total,rank:e.rank}))).sort(((e,t)=>e.rank-t.rank)),last_mod:s}}catch(e){console.error("Error fetching data:",e)}}(),O()}catch(e){console.error("Error fetching data:",e)}}function E(e){return e.liveFlag&&["interrupted"].every((t=>t!==e.status.toLowerCase()))}function w(e){return!e.liveFlag&&["finished","cancelled"].every((t=>t!==e.status.toLowerCase()))}function L(e){return"finished"===e.status.toLowerCase()}function $(e,t,n){const a=document.createElement("input");a.type="checkbox",a.id=e,a.addEventListener("change",n);const s=document.createElement("label");return s.textContent=t,s.appendChild(a),s}function N(e){return 7*e.gold+3*e.silver+1*e.bronze}function k(){const e=document.getElementById("medals");let t=document.getElementById("medalsContent");t||(t=document.createElement("div"),t.id="medalsContent",e.appendChild(t)),t.innerHTML="";let n=document.getElementById("medalsConfigs");if(!n){n=document.createElement("div"),n.id="medalsConfigs",e.insertBefore(n,t);let a=document.createElement("div");a.id="medalsRadioButtons",["default","weighted","total"].forEach((e=>{const t=document.createElement("label"),n=document.createElement("input");var s;n.type="radio",n.name="medalMode",n.value=e,"default"===e&&(n.checked=!0),n.onchange=()=>k(),t.appendChild(n),t.appendChild(document.createTextNode((s=e).charAt(0).toUpperCase()+s.slice(1))),a.appendChild(t)}));let s=document.createElement("div");s.id="medalsCheckboxes";const i=document.createElement("label"),l=document.createElement("input");l.type="checkbox",l.id="showAllCheckbox",l.onchange=()=>k(),i.appendChild(l),i.appendChild(document.createTextNode("Show all")),s.appendChild(i),n.appendChild(a),n.appendChild(s)}if(void 0===u.NOCs||0===u.NOCs.length)return;const a=document.querySelector('input[name="medalMode"]:checked')?.value||"default";let s=u.NOCs.map((e=>({...e})));"weighted"===a?(s.sort(((e,t)=>{const n=N(e);return N(t)-n})),s.forEach((e=>{e.total=`${N(e)}pts`}))):"total"===a&&s.sort(((e,t)=>t.total-e.total)),s.forEach(((e,t)=>{e.rank=t+1}));const l=document.getElementById("showAllCheckbox").checked?s:s.slice(0,5),o=s.findIndex((e=>e.org===i));if(-1!==o){const e=s[o];o>0&&!l.some((e=>e.org===s[o-1].org))&&l.push(s[o-1]),o<s.length-1&&!l.some((e=>e.org===s[o+1].org))&&l.push(s[o+1]),l.some((e=>e.org===i))||l.push(e)}s=l.sort(((e,t)=>e.rank-t.rank));const c=document.createElement("table"),d=p(new Date(y())),r="olympics"===d?"https://olympics.com/en/paris-2024/medals":"paralympics"===d?"https://www.paralympic.org/en/paris-2024-paralympics/medals":null;c.setAttribute("onclick",`window.open('${r}', '_blank').focus();`);const m=document.createElement("tr");["Rank","Country","Gold","Silver","Bronze","Total"].forEach((e=>{const t=document.createElement("th");t.textContent=e,m.appendChild(t)})),c.appendChild(m),s.forEach(((e,t)=>{const n=document.createElement("tr");e.org===i&&n.classList.add("filteredNOC"),[e.rank,e.org,e.gold,e.silver,e.bronze,e.total].forEach(((e,t)=>{const a=document.createElement("td");if(1===t){a.classList.add("country");const t=document.createElement("img");t.classList.add("flag"),t.src="olympics"===d?`https://gstatic.olympics.com/s1/t_original/static/noc/oly/3x2/180x120/${e}.png`:"paralympics"===d?`https://www.paralympic.org/OG2024/assets/images/flags/PG2024/${e}.webp`:null,a.appendChild(t),a.appendChild(document.createTextNode(e))}else a.textContent=e;n.appendChild(a)})),c.appendChild(n)}));const h=document.createElement("span"),g=u.last_mod.toLocaleString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).replace(",","");h.innerText=`Latest update: ${g} (${b(u.last_mod)})`,t.appendChild(c),t.appendChild(h)}function b(e){const t=new Date,n=new Date(e);let a=n-t;const s=a>=0;s||(a=t-n);const i=Math.floor(a/864e5),l=Math.floor(a%864e5/36e5),o=Math.floor(a%36e5/6e4),c=Math.floor(a%6e4/1e3),d=`${i>0?String(i).padStart(2,"0")+"d":""}${l>0||i>0?String(l).padStart(2,"0")+"h":""}${o>0||l>0||i>0?String(o).padStart(2,"0")+"m":""}${String(c).padStart(2,"0")+"s"}`;return s?`-${d}`:d}function x(e){for(const t in e)if(Object.hasOwn(e,t))return!1;return!0}function T(e,t){return"Getting Ready"===e.status&&!0===e.hasCustomCountry?-1:"Getting Ready"===t.status&&!0===t.hasCustomCountry?1:0!==e.medalFlag&&!0===e.hasCustomCountry?-1:0!==t.medalFlag&&!0===t.hasCustomCountry?1:!0===e.hasCustomCountry?-1:!0===t.hasCustomCountry?1:0!==e.medalFlag&&"Getting Ready"===e.status?-1:0!==t.medalFlag&&"Getting Ready"===t.status?1:"Getting Ready"===e.status?-1:"Getting Ready"===t.status?1:0!==e.medalFlag?-1:0!==t.medalFlag?1:-1}function D(e,t){return"Scheduled"!==e.status&&"Scheduled"===t.status?1:"Scheduled"===e.status&&"Scheduled"!==t.status?-1:"Rescheduled"!==e.status&&"Rescheduled"===t.status?1:"Rescheduled"===e.status&&"Rescheduled"!==t.status?-1:0}function S(e,t){const n=e.results?.position?parseInt(e.results?.position,10):null,a=t.results?.position?parseInt(t.results?.position,10):null;return null!==n&&null!==a?n-a:null!==n?-1:null!==a?1:e.order-t.order}function O(){k();var e,t=(e={live:[],pending:[],finished:[]},d.units.forEach((t=>{const n=t.competitors?.some((e=>e.noc===i));(n||null===o)&&(c&&0===t.medalFlag||(0===l.length?(E(t)&&e.live.push(new a(t,n)),(0!=t.medalFlag||n)&&(w(t)?e.pending.push(new a(t,n)):L(t)&&e.finished.push(new a(t,n)))):l.includes(t.disciplineName)&&(E(t)?e.live.push(new a(t,!1)):w(t)?e.pending.push(new a(t,!1)):L(t)&&e.finished.push(new a(t,!1)))))})),e);const n=document.getElementById("content");n.innerHTML="",["pending","live","finished"].forEach((e=>{let a=t[e];if(0===a.length)return;const s=document.createElement("div");s.className=`${e}-container`;const l=document.createElement("h1");l.innerText=e.charAt(0).toUpperCase()+e.slice(1),s.appendChild(l),"pending"===e&&(a=a.sort(D)),"live"===e&&(a=a.sort(T)),"finished"===e&&(a=a.slice().reverse()),a.forEach((t=>{const n=document.createElement("div");n.className="event";const a=t.startDate.toLocaleTimeString("en-US",{hour12:!1});let l=b(t.startDate),o="",c=new Set;var r=t.competitors;void 0===r&&(r=[]),(r=r.sort(S)).slice(0,4).forEach((e=>{let t=e.noc===i?" filteredNOC":"";const n=e.order+1;if(o+=`<div class="competitors${t}">${n}: ${e.name} (${e.noc})`,e.results){let t="";for(const[n,a]of Object.entries(e.results))a&&(t+=`${n}: ${a}<br>`);t&&(o+=`<br><div class="results">${t}</div>`)}o+="</div>",c.add(e.name)})),r.forEach((e=>{if(e.noc===i&&!c.has(e.name)){if(o+=`<div class="competitors filteredNOC">${e.order+1}: ${e.name} (${e.noc})`,e.results){let t="";for(const[n,a]of Object.entries(e.results))a&&(t+=`${n}: ${a}<br>`);t&&(o+=`<br><div class="results">${t}</div>`)}o+="</div>",c.add(e.name)}}));const u=document.createElement("div");u.className="eventTitle",u.innerHTML=`<span>${t.disciplineName} - ${t.eventUnitName}</span>`,0!=t.medalFlag&&u.classList.add("medal"),1===t.medalFlag&&u.classList.add("gold"),3===t.medalFlag&&u.classList.add("bronze"),u.setAttribute("onclick",`window.open('${t.url}', '_blank').focus();`),u.style.color=function(e){let t=0;for(let n=0;n<e.length;n++)t=e.charCodeAt(n)+((t<<5)-t);let n="#";for(let e=0;e<3;e++){let a=t>>8*e&255;a=0===e?Math.max(180,a):Math.max(60,a),n+=("00"+a.toString(16)).slice(-2)}return n}(t.disciplineName);const m=document.createElement("div");if(m.className="eventStatus",l.startsWith("-")&&m.classList.add("futureEvent"),m.innerHTML=`${a} (${l})<br>`,m.innerHTML+=`${t.status}${""===t.startText?"":" ("+t.startText+")"}`,"pending"===e){const e=d.units.filter((e=>!e.liveFlag&&"FINISHED"!==e.status&&(new Date(e.startDate)<t.startDate||new Date(e.startDate).getTime()===t.startDate.getTime()&&e.order<t.order)&&e.disciplineName===t.disciplineName&&e.id!==t.id)).length,n=d.units.filter((e=>e.liveFlag&&e.disciplineName===t.disciplineName&&e.id!==t.id)).length;e+n>0&&(m.innerHTML+=`: ${e}+${n} to go`),0===e&&m.classList.add("nextEvent")}"Getting Ready"===t.status&&m.classList.add("gettingReady"),n.innerHTML="",n.appendChild(u),n.appendChild(m),n.innerHTML+=o,s.appendChild(n)})),n.appendChild(s)})),delete t}document.addEventListener("DOMContentLoaded",(t=>{let n=document.getElementById("datePicker");n.value=e,n.onchange=g;const a=document.getElementById("prevBtn"),s=document.getElementById("nextBtn");a.addEventListener("click",(()=>h(-1))),s.addEventListener("click",(()=>h(1)))})),f()})();