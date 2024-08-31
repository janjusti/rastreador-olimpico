(()=>{const e=(new Date).toISOString().split("T")[0],t={start:new Date("2024-07-24"),end:new Date("2024-08-11")},n={start:new Date("2024-08-28"),end:new Date("2024-09-08")};class a{constructor(e,t){this.hasCustomCountry=t,this.phaseName=e.phaseName,this.eventUnitName=e.eventUnitName,this.disciplineName=e.disciplineName,this.startDate=new Date(e.startDate),this.startText=e.startText,this.status=e.statusDescription,this.medalFlag=e.medalFlag,this.competitors=e.competitors,this.id=e.id,this.mode=u(this.startDate),this.url="olympics"===this.mode?`https://olympics.com${e.extraData.detailUrl}`:"paralympics"===this.mode?`https://www.paralympic.org${e.extraData.detailUrl}`:null}}var s=new URLSearchParams(window.location.search),i="BRA";let o,l;var c,r,d={};function u(e){return e>=t.start&&e<=t.end?"olympics":e>=n.start&&e<=n.end?"paralympics":null}function m(){c={},d={},o=[],l=null,document.getElementById("filters").classList.remove("filter-active"),document.getElementById("filters").innerHTML="",document.getElementById("content").innerHTML="Loading...",g()}function p(){m(),r=setInterval(g,5e3)}function h(e){document.getElementById("content").innerHTML=e,document.getElementById("medals").innerHTML="",r=clearInterval(r)}function f(){var t=document.getElementById("datePicker")?.value;return t||(t=e),t}async function g(){try{const e=function(){var e=f();const t=u(new Date(e)),n="olympics"===t?"summer":"paralympics"===t?"summer-para":null;return n?`https://sph-s-api.olympics.com/${n}/schedules/api/ENG/schedule/day/${e}`:null}();if(null===e)return void h("Nothing here today...");let t=await fetch(e,{cache:"no-cache"});if(200!==t.status)return void h(`Error ${t.status} :(`);void 0===r&&"false"===s.get("onetime")&&p();const n=w(c);c=await t.json(),n&&!w(c)&&function(){const e=document.getElementById("filters"),t=[...new Set(c.units.map((e=>e.disciplineName)))].sort(),n=document.createElement("div");n.id="special-filters";const a=document.createElement("input");a.type="checkbox",a.id="all-checkbox",a.addEventListener("change",(function(){const t=u.querySelectorAll("input#discipline-checkbox");a.checked?(u.classList.add("disabled"),o=Array.from(t).map((e=>e.value)),e.classList.add("filter-active"),t.forEach((e=>{e.checked=!0}))):(u.classList.remove("disabled"),o=[],e.classList.remove("filter-active"),t.forEach((e=>{e.checked=!1}))),b()}));const s=document.createElement("label");s.textContent="All",s.appendChild(a),n.appendChild(s);const r=document.createElement("input");r.type="checkbox",r.id="onlyNOC-checkbox",r.addEventListener("change",(function(){const e=document.getElementById("content");r.checked?(l=i,e.classList.add("noc-filter-active")):(l=null,e.classList.remove("noc-filter-active")),b()}));const d=document.createElement("label");d.textContent=`Only ${i}`,d.appendChild(r),n.appendChild(d),e.appendChild(n);const u=document.createElement("div");u.id="discipline-filters",t.forEach((t=>{const n=document.createElement("input");n.type="checkbox",n.id="discipline-checkbox",n.value=t,n.addEventListener("change",(function(){n.checked?o.push(n.value):o=o.filter((e=>e!==n.value)),0!==o.length?e.classList.add("filter-active"):e.classList.remove("filter-active"),b(),n.checked||(a.checked=!1)}));const s=document.createElement("label");s.textContent=t,s.appendChild(n),u.appendChild(s)})),e.appendChild(u)}(),d=await async function(){try{const e=u(new Date(f())),t="olympics"===e?"https://olympics.com/OG2024/data/CIS_MedalNOCs~lang=ENG~comp=OG2024.json":"paralympics"===e?"https://www.paralympic.org/OG2024/data/CIS_MedalNOCs~comp=PG2024~lang=ENG.json":null;if(null===t)return{};const n=await fetch(t,{cache:"no-cache"});if(200!==n.status)return{};const a=await n.json();if(void 0===a.medalNOC)return{};const s=new Date(n.headers.get("Last-Modified")),o=a.medalNOC.filter((e=>"TOT"===e.gender&&"GLO"===e.sport)).map((e=>({org:e.org,gold:e.gold,silver:e.silver,bronze:e.bronze,total:e.total,rank:e.rank}))).sort(((e,t)=>e.rank-t.rank)),l=o.slice(0,5),c=o.findIndex((e=>e.org===i));if(-1!==c){const e=o[c];c>0&&!l.some((e=>e.org===o[c-1].org))&&l.push(o[c-1]),c<o.length-1&&!l.some((e=>e.org===o[c+1].org))&&l.push(o[c+1]),l.some((e=>e.org===i))||l.push(e)}return{NOCs:l.sort(((e,t)=>e.rank-t.rank)),last_mod:s}}catch(e){console.error("Error fetching data:",e)}}(),b()}catch(e){console.error("Error fetching data:",e)}}function v(e){return e.liveFlag&&["interrupted"].every((t=>t!==e.status.toLowerCase()))}function y(e){return!e.liveFlag&&["finished","cancelled"].every((t=>t!==e.status.toLowerCase()))}function C(e){return"finished"===e.status.toLowerCase()}function E(e){const t=new Date,n=new Date(e);let a=n-t,s=a>=0;s||(a=t-n);const i=Math.floor(a/36e5),o=Math.floor(a%36e5/6e4),l=Math.floor(a%6e4/1e3),c=`${String(i).padStart(2,"0")}:${String(o).padStart(2,"0")}:${String(l).padStart(2,"0")}`;return s?`-${c}`:`${c}`}function w(e){for(const t in e)if(Object.hasOwn(e,t))return!1;return!0}function L(e,t){return"Getting Ready"===e.status&&!0===e.hasCustomCountry?-1:"Getting Ready"===t.status&&!0===t.hasCustomCountry?1:0!==e.medalFlag&&!0===e.hasCustomCountry?-1:0!==t.medalFlag&&!0===t.hasCustomCountry?1:!0===e.hasCustomCountry?-1:!0===t.hasCustomCountry?1:0!==e.medalFlag&&"Getting Ready"===e.status?-1:0!==t.medalFlag&&"Getting Ready"===t.status?1:"Getting Ready"===e.status?-1:"Getting Ready"===t.status?1:0!==e.medalFlag?-1:0!==t.medalFlag?1:-1}function $(e,t){return"Scheduled"!==e.status&&"Scheduled"===t.status?1:"Scheduled"===e.status&&"Scheduled"!==t.status?-1:"Rescheduled"!==e.status&&"Rescheduled"===t.status?1:"Rescheduled"===e.status&&"Rescheduled"!==t.status?-1:0}function N(e,t){const n=e.results?.position?parseInt(e.results?.position,10):null,a=t.results?.position?parseInt(t.results?.position,10):null;return null!==n&&null!==a?n-a:null!==n?-1:null!==a?1:e.order-t.order}function b(){!function(){const e=document.getElementById("medals");if(e.innerHTML="",void 0===d.NOCs||0===d.NOCs.length)return;const t=document.createElement("table"),n=u(new Date(f())),a="olympics"===n?"https://olympics.com/en/paris-2024/medals":"paralympics"===n?"https://www.paralympic.org/en/paris-2024-paralympics/medals":null;t.setAttribute("onclick",`window.open('${a}', '_blank').focus();`);const s=document.createElement("tr");["Rank","Country","Gold","Silver","Bronze","Total"].forEach((e=>{const t=document.createElement("th");t.textContent=e,s.appendChild(t)})),t.appendChild(s),d.NOCs.forEach((e=>{const n=document.createElement("tr");e.org===i&&n.classList.add("filteredNOC"),[e.rank,e.org,e.gold,e.silver,e.bronze,e.total].forEach(((e,t)=>{const a=document.createElement("td");if(1===t){a.classList.add("country");const t=document.createElement("img");t.classList.add("flag"),t.src=`https://www.paralympic.org/OG2024/assets/images/flags/PG2024/${e}.webp`,a.appendChild(t),a.appendChild(document.createTextNode(e))}else a.textContent=e;n.appendChild(a)})),t.appendChild(n)}));const o=document.createElement("span"),l=d.last_mod.toLocaleString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).replace(",","");o.innerText=`Latest update: ${l} (${E(d.last_mod)})`,e.appendChild(t),e.appendChild(o)}();var e,t=(e={live:[],pending:[],finished:[]},c.units.forEach((t=>{const n=t.competitors?.some((e=>e.noc===i));(n||null===l)&&(0===o.length?(v(t)&&e.live.push(new a(t,n)),(0!=t.medalFlag||n)&&(y(t)?e.pending.push(new a(t,n)):C(t)&&e.finished.push(new a(t,n)))):o.includes(t.disciplineName)&&(v(t)?e.live.push(new a(t,!1)):y(t)?e.pending.push(new a(t,!1)):C(t)&&e.finished.push(new a(t,!1))))})),e);const n=document.getElementById("content");n.innerHTML="",["pending","live","finished"].forEach((e=>{let a=t[e];if(0===a.length)return;const s=document.createElement("div");s.className=`${e}-container`;const o=document.createElement("h1");o.innerText=e.charAt(0).toUpperCase()+e.slice(1),s.appendChild(o),"pending"===e&&(a=a.sort($)),"live"===e&&(a=a.sort(L)),"finished"===e&&(a=a.slice().reverse()),a.forEach((e=>{const t=document.createElement("div");t.className="event";const n=e.startDate.toLocaleTimeString("en-US",{hour12:!1});let a=E(e.startDate),o="",l=new Set;var c=e.competitors;void 0===c&&(c=[]),(c=c.sort(N)).slice(0,4).forEach((e=>{let t=e.noc===i?" filteredNOC":"";const n=e.order+1;if(o+=`<div class="competitors${t}">${n}: ${e.name} (${e.noc})`,e.results){let t="";for(const[n,a]of Object.entries(e.results))a&&(t+=`${n}: ${a}<br>`);t&&(o+=`<br><div class="results">${t}</div>`)}o+="</div>",l.add(e.name)})),c.forEach((e=>{if(e.noc===i&&!l.has(e.name)){if(o+=`<div class="competitors filteredNOC">${e.order+1}: ${e.name} (${e.noc})`,e.results){let t="";for(const[n,a]of Object.entries(e.results))a&&(t+=`${n}: ${a}<br>`);t&&(o+=`<br><div class="results">${t}</div>`)}o+="</div>",l.add(e.name)}}));const r=document.createElement("div");r.className="eventTitle",r.innerHTML=`<span>${e.disciplineName} - ${e.eventUnitName}</span>`,0!=e.medalFlag&&r.classList.add("medal"),1===e.medalFlag&&r.classList.add("gold"),3===e.medalFlag&&r.classList.add("bronze"),"Getting Ready"===e.status&&r.classList.add("gettingReady"),r.setAttribute("onclick",`window.open('${e.url}', '_blank').focus();`);const d=document.createElement("div");d.className="eventStatus",a.startsWith("-")&&d.classList.add("futureEvent"),d.innerHTML=`${n} (${a})<br>`,d.innerHTML+=`${e.status}${""===e.startText?"":" ("+e.startText+")"}`,t.innerHTML="",t.appendChild(r),t.appendChild(d),t.innerHTML+=o,s.appendChild(t)})),n.appendChild(s)})),delete t}document.addEventListener("DOMContentLoaded",(t=>{let n=document.getElementById("datePicker");n.value=e,n.onchange=m})),p()})();