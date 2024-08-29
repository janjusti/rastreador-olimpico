(()=>{const e=(new Date).toISOString().split("T")[0],t={start:new Date("2024-07-24"),end:new Date("2024-08-11")},n={start:new Date("2024-08-28"),end:new Date("2024-09-08")};class a{constructor(e,t){this.hasCustomCountry=t,this.phaseName=e.phaseName,this.eventUnitName=e.eventUnitName,this.disciplineName=e.disciplineName,this.startDate=new Date(e.startDate),this.startText=e.startText,this.status=e.statusDescription,this.medalFlag=e.medalFlag,this.competitors=e.competitors,this.id=e.id,this.mode=d(this.startDate),this.url="olympics"===this.mode?`https://olympics.com${e.extraData.detailUrl}`:"paralympics"===this.mode?`https://www.paralympic.org${e.extraData.detailUrl}`:null}}var s=new URLSearchParams(window.location.search),o="BRA";let r;var i,l,c={};function d(e){return e>=t.start&&e<=t.end?"olympics":e>=n.start&&e<=n.end?"paralympics":null}function u(){i={},c={},r=[],document.getElementById("filters").classList.remove("filter-active"),document.getElementById("filters").innerHTML="",document.getElementById("content").innerHTML="Loading...",g()}function m(){u(),l=setInterval(g,5e3)}function h(e){document.getElementById("content").innerHTML=e,document.getElementById("medals").innerHTML="",l=clearInterval(l)}function p(){var t=document.getElementById("datePicker")?.value;return t||(t=e),t}async function g(){try{const e=function(){var e=p();const t=d(new Date(e)),n="olympics"===t?"summer":"paralympics"===t?"summer-para":null;return n?`https://sph-s-api.olympics.com/${n}/schedules/api/ENG/schedule/day/${e}`:null}();if(null===e)return void h("Nothing here today...");let t=await fetch(e,{cache:"no-cache"});if(200!==t.status)return void h(`Error ${t.status} :(`);void 0===l&&"false"===s.get("onetime")&&m();const n=E(i);i=await t.json(),n&&!E(i)&&function(){const e=document.getElementById("filters"),t=[...new Set(i.units.map((e=>e.disciplineName)))].sort(),n=document.createElement("input");n.type="checkbox",n.id="all-checkbox",n.addEventListener("change",(function(){e.querySelectorAll("input[type='checkbox']:not(#all-checkbox)").forEach((e=>{e.checked=n.checked;const t=new Event("change");e.dispatchEvent(t)}))}));const a=document.createElement("label");a.textContent="All",a.appendChild(n),e.appendChild(a),t.forEach((t=>{const a=document.createElement("input");a.type="checkbox",a.value=t,a.addEventListener("change",(function(){a.checked?r.push(a.value):r=r.filter((e=>e!==a.value)),0!==r.length?e.classList.add("filter-active"):e.classList.remove("filter-active"),N(),a.checked||(n.checked=!1)}));const s=document.createElement("label");s.textContent=t,s.appendChild(a),e.appendChild(s)}))}(),c=await async function(){try{const e=d(new Date(p())),t="olympics"===e?"https://olympics.com/OG2024/data/CIS_MedalNOCs~lang=ENG~comp=OG2024.json":"paralympics"===e?"https://www.paralympic.org/OG2024/data/CIS_MedalNOCs~comp=PG2024~lang=ENG.json":null;if(null===t)return{};const n=await fetch(t,{cache:"no-cache"});if(200!==n.status)return{};const a=await n.json();if(void 0===a.medalNOC)return{};const s=new Date(n.headers.get("Last-Modified")),r=a.medalNOC.filter((e=>"TOT"===e.gender&&"GLO"===e.sport)).map((e=>({org:e.org,gold:e.gold,silver:e.silver,bronze:e.bronze,total:e.total,rank:e.rank}))).sort(((e,t)=>e.rank-t.rank)),i=r.slice(0,5),l=r.findIndex((e=>e.org===o));if(-1!==l){const e=r[l];l>0&&!i.some((e=>e.org===r[l-1].org))&&i.push(r[l-1]),l<r.length-1&&!i.some((e=>e.org===r[l+1].org))&&i.push(r[l+1]),i.some((e=>e.org===o))||i.push(e)}return{NOCs:i.sort(((e,t)=>e.rank-t.rank)),last_mod:s}}catch(e){console.error("Error fetching data:",e)}}(),N()}catch(e){console.error("Error fetching data:",e)}}function f(e){return e.liveFlag&&["interrupted"].every((t=>t!==e.status.toLowerCase()))}function v(e){return!e.liveFlag&&["finished","cancelled"].every((t=>t!==e.status.toLowerCase()))}function y(e){return"finished"===e.status.toLowerCase()}function C(e){const t=new Date,n=new Date(e);let a=n-t,s=a>=0;s||(a=t-n);const o=Math.floor(a/36e5),r=Math.floor(a%36e5/6e4),i=Math.floor(a%6e4/1e3),l=`${String(o).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(i).padStart(2,"0")}`;return s?`-${l}`:`${l}`}function E(e){for(const t in e)if(Object.hasOwn(e,t))return!1;return!0}function w(e,t){return"Getting Ready"===e.status&&!0===e.hasCustomCountry?-1:"Getting Ready"===t.status&&!0===t.hasCustomCountry?1:0!==e.medalFlag&&!0===e.hasCustomCountry?-1:0!==t.medalFlag&&!0===t.hasCustomCountry?1:!0===e.hasCustomCountry?-1:!0===t.hasCustomCountry?1:0!==e.medalFlag&&"Getting Ready"===e.status?-1:0!==t.medalFlag&&"Getting Ready"===t.status?1:"Getting Ready"===e.status?-1:"Getting Ready"===t.status?1:0!==e.medalFlag?-1:0!==t.medalFlag?1:-1}function L(e,t){return"Scheduled"!==e.status&&"Scheduled"===t.status?1:"Scheduled"===e.status&&"Scheduled"!==t.status?-1:"Rescheduled"!==e.status&&"Rescheduled"===t.status?1:"Rescheduled"===e.status&&"Rescheduled"!==t.status?-1:0}function $(e,t){const n=e.results?.position?parseInt(e.results?.position,10):null,a=t.results?.position?parseInt(t.results?.position,10):null;return null!==n&&null!==a?n-a:null!==n?-1:null!==a?1:e.order-t.order}function N(){!function(){const e=document.getElementById("medals");if(e.innerHTML="",void 0===c.NOCs||0===c.NOCs.length)return;const t=document.createElement("table"),n=document.createElement("tr");["Rank","Country","Gold","Silver","Bronze","Total"].forEach((e=>{const t=document.createElement("th");t.textContent=e,n.appendChild(t)})),t.appendChild(n),c.NOCs.forEach((e=>{const n=document.createElement("tr");e.org===o&&n.classList.add("filteredNOC"),[e.rank,e.org,e.gold,e.silver,e.bronze,e.total].forEach(((e,t)=>{const a=document.createElement("td");if(1===t){a.classList.add("country");const t=document.createElement("img");t.classList.add("flag"),t.src=`https://www.paralympic.org/OG2024/assets/images/flags/PG2024/${e}.webp`,a.appendChild(t),a.appendChild(document.createTextNode(e))}else a.textContent=e;n.appendChild(a)})),t.appendChild(n)}));const a=document.createElement("span"),s=c.last_mod.toLocaleString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).replace(",","");a.innerText=`Latest update: ${s} (${C(c.last_mod)})`,e.appendChild(t),e.appendChild(a)}();var e,t=(e={live:[],pending:[],finished:[]},i.units.forEach((t=>{if(0===r.length){const n=t.competitors?.some((e=>e.noc===o));f(t)&&e.live.push(new a(t,n)),(0!=t.medalFlag||n)&&(v(t)?e.pending.push(new a(t,n)):y(t)&&e.finished.push(new a(t,n)))}else r.includes(t.disciplineName)&&(f(t)?e.live.push(new a(t,!1)):v(t)?e.pending.push(new a(t,!1)):y(t)&&e.finished.push(new a(t,!1)))})),e);const n=document.getElementById("content");n.innerHTML="",["pending","live","finished"].forEach((e=>{let a=t[e];if(0===a.length)return;const s=document.createElement("div");s.className=`${e}-container`;const r=document.createElement("h1");r.innerText=e.charAt(0).toUpperCase()+e.slice(1),s.appendChild(r),"pending"===e&&(a=a.sort(L)),"live"===e&&(a=a.sort(w)),"finished"===e&&(a=a.slice().reverse()),a.forEach((e=>{const t=document.createElement("div");t.className="event";const n=e.startDate.toLocaleTimeString("en-US",{hour12:!1});let a=C(e.startDate),r="",i=new Set;var l=e.competitors;void 0===l&&(l=[]),(l=l.sort($)).slice(0,4).forEach((e=>{let t=e.noc===o?" filteredNOC":"";const n=e.order+1;if(r+=`<div class="competitors${t}">${n}: ${e.name} (${e.noc})`,e.results){let t="";for(const[n,a]of Object.entries(e.results))a&&(t+=`${n}: ${a}<br>`);t&&(r+=`<br><div class="results">${t}</div>`)}r+="</div>",i.add(e.name)})),l.forEach((e=>{if(e.noc===o&&!i.has(e.name)){if(r+=`<div class="competitors filteredNOC">${e.order+1}: ${e.name} (${e.noc})`,e.results){let t="";for(const[n,a]of Object.entries(e.results))a&&(t+=`${n}: ${a}<br>`);t&&(r+=`<br><div class="results">${t}</div>`)}r+="</div>",i.add(e.name)}}));const c=document.createElement("div");c.className="eventTitle",c.innerHTML=`<span>${e.disciplineName} - ${e.eventUnitName}</span>`,0!=e.medalFlag&&c.classList.add("medal"),1===e.medalFlag&&c.classList.add("gold"),3===e.medalFlag&&c.classList.add("bronze"),"Getting Ready"===e.status&&c.classList.add("gettingReady"),c.setAttribute("onclick",`window.open('${e.url}', '_blank').focus();`);const d=document.createElement("div");d.className="eventStatus",a.startsWith("-")&&d.classList.add("futureEvent"),d.innerHTML=`${n} (${a})<br>`,d.innerHTML+=`${e.status}${""===e.startText?"":" ("+e.startText+")"}`,t.innerHTML="",t.appendChild(c),t.appendChild(d),t.innerHTML+=r,s.appendChild(t)})),n.appendChild(s)})),delete t}document.addEventListener("DOMContentLoaded",(t=>{let n=document.getElementById("datePicker");n.value=e,n.onchange=u})),m()})();