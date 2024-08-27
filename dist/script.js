(()=>{const e=(new Date).toISOString().split("T")[0],t={start:new Date("2024-07-24"),end:new Date("2024-08-11")},n={start:new Date("2024-08-28"),end:new Date("2024-09-08")};class s{constructor(e,t){this.hasCustomCountry=t,this.phaseName=e.phaseName,this.eventUnitName=e.eventUnitName,this.disciplineName=e.disciplineName,this.startDate=new Date(e.startDate),this.startText=e.startText,this.status=e.statusDescription,this.medalFlag=e.medalFlag,this.competitors=e.competitors,this.id=e.id,this.mode=o(this.startDate),this.url="olympics"===this.mode?`https://olympics.com${e.extraData.detailUrl}`:"paralympics"===this.mode?`https://www.paralympic.org${e.extraData.detailUrl}`:null}}var a=new URLSearchParams(window.location.search),i="BRA";let l;var r,c;function o(e){return e>=t.start&&e<=t.end?"olympics":e>=n.start&&e<=n.end?"paralympics":null}function d(){r={},l=[],document.getElementById("filters").classList.remove("filter-active"),document.getElementById("filters").innerHTML="",document.getElementById("content").innerHTML="Loading...",m()}function u(){d(),c=setInterval(m,5e3)}function h(e){document.getElementById("content").innerHTML=e,c=clearInterval(c)}async function m(){try{const t=function(){var t=document.getElementById("datePicker")?.value;t||(t=e);const n=o(new Date(t)),s="olympics"===n?"summer":"paralympics"===n?"summer-para":null;return s?`https://sph-s-api.olympics.com/${s}/schedules/api/ENG/schedule/day/${t}`:null}();if(null===t)return void h("Nothing here today...");let n=await fetch(t,{cache:"no-cache"});if(200!==n.status)return void h(`Error ${n.status} :(`);void 0===c&&"false"===a.get("onetime")&&u();const s=g(r);r=await n.json(),s&&!g(r)&&function(){const e=document.getElementById("filters"),t=[...new Set(r.units.map((e=>e.disciplineName)))].sort(),n=document.createElement("input");n.type="checkbox",n.id="all-checkbox",n.addEventListener("change",(function(){e.querySelectorAll("input[type='checkbox']:not(#all-checkbox)").forEach((e=>{e.checked=n.checked;const t=new Event("change");e.dispatchEvent(t)}))}));const s=document.createElement("label");s.textContent="All",s.appendChild(n),e.appendChild(s),t.forEach((t=>{const s=document.createElement("input");s.type="checkbox",s.value=t,s.addEventListener("change",(function(){s.checked?l.push(s.value):l=l.filter((e=>e!==s.value)),0!==l.length?e.classList.add("filter-active"):e.classList.remove("filter-active"),$(),s.checked||(n.checked=!1)}));const a=document.createElement("label");a.textContent=t,a.appendChild(s),e.appendChild(a)}))}(),$()}catch(e){console.error("Error fetching data:",e)}}function p(e){return e.liveFlag&&["interrupted"].every((t=>t!==e.status.toLowerCase()))}function f(e){return!e.liveFlag&&["finished","cancelled"].every((t=>t!==e.status.toLowerCase()))}function v(e){return"finished"===e.status.toLowerCase()}function g(e){for(const t in e)if(Object.hasOwn(e,t))return!1;return!0}function y(e,t){return"Getting Ready"===e.status?-1:"Getting Ready"===t.status?1:0!==e.medalFlag&&!0===e.hasCustomCountry?-1:0!==t.medalFlag&&!0===t.hasCustomCountry?1:!0===e.hasCustomCountry?-1:!0===t.hasCustomCountry?1:0!==e.medalFlag?-1:0!==t.medalFlag?1:0}function E(e,t){return"Scheduled"!==e.status&&"Scheduled"===t.status?1:"Scheduled"===e.status&&"Scheduled"!==t.status?-1:"Rescheduled"!==e.status&&"Rescheduled"===t.status?1:"Rescheduled"===e.status&&"Rescheduled"!==t.status?-1:0}function w(e,t){const n=e.results?.position?parseInt(e.results?.position,10):null,s=t.results?.position?parseInt(t.results?.position,10):null;return null!==n&&null!==s?n-s:null!==n?-1:null!==s?1:e.order-t.order}function $(){var e,t=(e={live:[],pending:[],finished:[]},r.units.forEach((t=>{if(0===l.length){const n=t.competitors?.some((e=>e.noc===i));p(t)&&e.live.push(new s(t,n)),(0!=t.medalFlag||n)&&(f(t)?e.pending.push(new s(t,n)):v(t)&&e.finished.push(new s(t,n)))}else l.includes(t.disciplineName)&&(p(t)?e.live.push(new s(t,!1)):f(t)?e.pending.push(new s(t,!1)):v(t)&&e.finished.push(new s(t,!1)))})),e);const n=document.getElementById("content");n.innerHTML="",["pending","live","finished"].forEach((e=>{let s=t[e];if(0===s.length)return;const a=document.createElement("div");a.className=`${e}-container`;const l=document.createElement("h1");l.innerText=e.charAt(0).toUpperCase()+e.slice(1),a.appendChild(l),"live"!==e&&"finished"!==e||(s=s.slice().reverse()),"pending"===e&&(s=s.sort(E)),"live"===e&&(s=s.sort(y)),s.forEach((e=>{const t=document.createElement("div");t.className="event";const n=e.startDate.toLocaleTimeString("en-US",{hour12:!1});let s=function(e){const t=new Date,n=new Date(e);let s=n-t,a=s>=0;a||(s=t-n);const i=Math.floor(s/36e5),l=Math.floor(s%36e5/6e4),r=Math.floor(s%6e4/1e3),c=`${String(i).padStart(2,"0")}:${String(l).padStart(2,"0")}:${String(r).padStart(2,"0")}`;return a?`-${c}`:`${c}`}(e.startDate),l="",r=new Set;var c=e.competitors;void 0===c&&(c=[]),(c=c.sort(w)).slice(0,4).forEach((e=>{let t=e.noc===i?" filteredNOC":"";const n=e.order+1;if(l+=`<div class="competitors${t}">${n}: ${e.name} (${e.noc})`,e.results){let t="";for(const[n,s]of Object.entries(e.results))s&&(t+=`${n}: ${s}<br>`);t&&(l+=`<br><div class="results">${t}</div>`)}l+="</div>",r.add(e.name)})),c.forEach((e=>{if(e.noc===i&&!r.has(e.name)){if(l+=`<div class="competitors filteredNOC">${e.order+1}: ${e.name} (${e.noc})`,e.results){let t="";for(const[n,s]of Object.entries(e.results))s&&(t+=`${n}: ${s}<br>`);t&&(l+=`<br><div class="results">${t}</div>`)}l+="</div>",r.add(e.name)}}));const o=document.createElement("div");o.className="eventTitle",o.innerHTML=`<span>${e.disciplineName} - ${e.eventUnitName}</span>`,0!=e.medalFlag&&o.classList.add("medal"),1===e.medalFlag&&o.classList.add("gold"),3===e.medalFlag&&o.classList.add("bronze"),"Getting Ready"===e.status&&o.classList.add("gettingReady"),o.setAttribute("onclick",`window.open('${e.url}', '_blank').focus();`);const d=document.createElement("div");d.className="eventStatus",s.startsWith("-")&&d.classList.add("futureEvent"),d.innerHTML=`${n} (${s})<br>`,d.innerHTML+=`${e.status}${""===e.startText?"":" ("+e.startText+")"}`,t.innerHTML="",t.appendChild(o),t.appendChild(d),t.innerHTML+=l,a.appendChild(t)})),n.appendChild(a)})),delete t}document.addEventListener("DOMContentLoaded",(t=>{let n=document.getElementById("datePicker");n.value=e,n.onchange=d})),u()})();