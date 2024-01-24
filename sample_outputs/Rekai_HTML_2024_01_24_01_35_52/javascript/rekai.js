
// JS for Copy Buttons

// Function to copy text from a specific element to clipboard and show a tooltip
function copyTextByElementId(elementId, buttonId) {
  var textToCopy = document.getElementById(elementId).textContent.trim();
  var copyButton = document.getElementById(buttonId);
  navigator.clipboard.writeText(textToCopy);
  showTooltip(copyButton, "Copied!");
};

var copyableElements = document.querySelectorAll(".copy-on-click");

copyableElements.forEach(function (copyableElement) {
  copyableElement.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.metaKey) {
      handleMouseOver(event, this);
      this.focus();
    }
  });
  copyableElement.addEventListener("keyup", function (event) {
    handleMouseOut(event, this);
    this.focus();
  });
  copyableElement.addEventListener("mouseover", function (event) {
    copyableElement.setAttribute("tabindex", "0");
    this.focus();
    handleMouseOver(event, this);
  });
  copyableElement.addEventListener("mouseout", function (event) {
    handleMouseOut(event, this);
    this.removeAttribute("tabindex");
  });
  copyableElement.addEventListener("click", function (event) {
    copyTextOnClick(event, this);
  });
});

function copyTextOnClick(event, element) {
  // Check if the Control (or Command) key is pressed
  if (event.ctrlKey || event.metaKey) {
    var textToCopy = element.textContent.trim();
    navigator.clipboard.writeText(textToCopy);
    showTooltip(element, "Copied!");
  }
};

function handleMouseOver(event, element) {
  if (event.ctrlKey || event.metaKey) {
    element.classList.add("hovered");
  }
};

function handleMouseOut(event, element) {
    element.classList.remove("hovered");
};


// JS for Tooltip

// Function to show a tooltip with a message
function showTooltip(element, message) {
  const tooltip = document.createElement("div");
  tooltip.textContent = message;
  tooltip.style.position = "absolute";
  tooltip.style.background = "black";
  tooltip.style.color = "white";
  tooltip.style.padding = "5px 10px";
  tooltip.style.borderRadius = "5px";
  tooltip.style.fontSize = "10px";
  tooltip.style.whiteSpace = "nowrap";
  tooltip.style.transform = "translateY(-100%)";
  tooltip.style.top = `${element.offsetTop - tooltip.offsetHeight - 10}px`;
  tooltip.style.left = `${element.offsetLeft + element.offsetWidth/4}px`;
  tooltip.style.zIndex = "2000";

  element.parentElement.appendChild(tooltip);

  // Remove the tooltip after 1.2 seconds
  setTimeout(() => {
    tooltip.remove();
  }, 1200); // Remove after 1.2 seconds
};


// JS for Jisho Links

var jishoLinks = document.querySelectorAll(".jisho-link");

jishoLinks.forEach(function (jishoLink) {
  jishoLink.onclick = function (event) {
    event.preventDefault();
    var iframe = document.getElementById("sidebar-iframe");
    var originalJishoLink = this.href;
    // modify link to align with dark mode
    if (localStorage.getItem("darkModeEnabled") === "true") {
      var modifiedJishoLink = originalJishoLink + "?color_theme=dark";
    } else {
      var modifiedJishoLink = originalJishoLink + "?color_theme=light";
    }
    iframe.src = modifiedJishoLink;
  };
});


// JS for Top Bar Toggle Buttons
function updateButtonClasses() {
  const toggleButtons = document.querySelectorAll(".top-bar-button");
  toggleButtons.forEach(function (toggleButton) {
    toggleButton.classList.add("toggle-button-enabled");
  });
};

updateButtonClasses();

function toggleDisplay(button, elementClass, displayType) {
  elements = document.querySelectorAll(elementClass);
  elements.forEach(function (element) {
    if (element.style.display === "none") {
      element.style.display = displayType;
      button.classList.add("toggle-button-enabled");
    } else {
      element.style.display = "none";
      button.classList.remove("toggle-button-enabled");
    }
  });
};

function toggleRightSidebar() {
  const root = document.documentElement;
  const rightSidebarContainer = document.getElementById("right-sidebar");
  const toggleSidebarButton = document.getElementById("toggle-sidebar-button");

  if (rightSidebarContainer.classList.contains('sidebar-expanded')) {
    root.style.setProperty('--sidbar-percent-width', '0%');
    root.style.setProperty('--sidebar-display', 'none');
    root.style.setProperty('--sidebar-gap', '0px')
    root.style.setProperty('--sidebar-placeholder-opacity', '0');
    toggleSidebarButton.textContent = "Show OmniBar";
    rightSidebarContainer.className = "right-sidebar sidebar-collapsed";
  } else  {
    root.style.setProperty('--sidbar-percent-width', '33%');
    root.style.setProperty('--sidebar-display', 'block');
    root.style.setProperty('--sidebar-gap', '10px')
    root.style.setProperty('--sidebar-placeholder-opacity', '1');
    toggleSidebarButton.textContent = "Hide OmniBar";
    rightSidebarContainer.className = "right-sidebar sidebar-expanded";
  }
};

// JS for dark mode

function setDarkMode(isDarkModeEnabled) {
  var root = document.documentElement;
  if (isDarkModeEnabled) {
    root.classList.add("dark-mode");
    // reload jisho
    var jishoIframe = document.getElementById("sidebar-iframe");
    jishoIframe.src = "https://jisho.org/?color_theme=dark";
    localStorage.setItem("darkModeEnabled", true)

  } else {
    root.classList.remove("dark-mode");
    // reload jisho
    var jishoIframe = document.getElementById("sidebar-iframe");
    jishoIframe.src = "https://jisho.org/?color_theme=light";
    localStorage.setItem("darkModeEnabled", false)
  }
};

function toggleDarkMode() {
  var root = document.documentElement;
  var isDarkModeEnabled = root.classList.contains("dark-mode");

  // invert the boolean
  isDarkModeEnabled = !isDarkModeEnabled;

  // Call function that updates dark mode class on root
  setDarkMode(isDarkModeEnabled);
};

// Set initial dark mode state based on local storage
function initializeDarkMode() {
  var isDarkModeEnabled = localStorage.getItem("darkModeEnabled");

  if (isDarkModeEnabled) {
    setDarkMode(true);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
};

// Call initializeDarkMode on page load
initializeDarkMode();

// JS for expanding and collapsing cards
function expandParaCard(paraCardID) {
  const paraCard = document.getElementById(paraCardID);
  paraCard.classList.add("expanded");
  paraCard.querySelector(".line-card-container").classList.remove("collapsed");
  paraCard.querySelector(".line-card-container").style.maxHeight = paraCard.querySelector(".line-card-container").scrollHeight + 1000 + "px";
  button = paraCard.querySelector(".expand-collapse-button");
  button.textContent = "Collapse";
  };

function collapseParaCard(paraCardID) {
  const paraCard = document.getElementById(paraCardID);
  paraCard.classList.remove("expanded");
  paraCard.querySelector(".line-card-container").classList.add("collapsed");
  paraCard.querySelector(".line-card-container").style.maxHeight = "0px";
  button = paraCard.querySelector(".expand-collapse-button");
  button.textContent = "Expand";
  };

function expandCollapseCard(cardID) {
  paraCard = document.getElementById(cardID);
  // para cards do not have .expanded class by default. But line-card-containers have .collapsed by default
  lineCardContainer = paraCard.querySelector(".line-card-container");
  if (lineCardContainer.classList.contains("collapsed")) {
    expandParaCard(cardID);
  } else {
    collapseParaCard(cardID);
  }
  };

function expandAllParas() {
  const paraCards = document.querySelectorAll(".para-card");
  paraCards.forEach((paraCard) => {
    paraCardID = paraCard.id;
    expandParaCard(paraCardID);
    });
  };

function collapseAllParas() {
  const paraCards = document.querySelectorAll(".para-card");
  paraCards.forEach((paraCard) => {
    paraCardID = paraCard.id;
    collapseParaCard(paraCardID);
    });
  };

function expandCollapseLineContents(lineID) {
  const line = document.getElementById(lineID);
  const lineContent = line.querySelector(".line-card-contents-container");
  lineContent.classList.toggle("collapsed");
  if (lineContent.classList.contains("collapsed")) {
    lineContent.style.maxHeight = "0px";  
  } else {
    lineContent.style.maxHeight = lineContent.scrollHeight + 1000 + "px";
  }
  };

function addParaContentExpandOnClickEvent() {
  const paraRawDivs = document.querySelectorAll(".master-raw");
  const paraPreProDivs = document.querySelectorAll(".master-preprocessed");
  const paraHeaderLeftDivs = document.querySelectorAll(".card-header-left-half");
  const paraHeaderMiddleDivs = document.querySelectorAll(".card-header-mid-section");
  paraRawDivs.forEach((paraRawDiv) => {
    paraRawDiv.addEventListener("click", () => {
      paraCard = paraRawDiv.parentElement;
      if (paraCard.classList.contains("expanded")) {
        return
      } else {
        expandParaCard(paraCard.id);
      }
    })
  });
  paraPreProDivs.forEach((paraPreProDiv) => {
    paraPreProDiv.addEventListener("click", () => {
      paraCard = paraPreProDiv.parentElement;
      if (paraCard.classList.contains("expanded")) {
        return
      } else {
        expandParaCard(paraCard.id);
      }
    })
  });
  paraHeaderLeftDivs.forEach((paraHeaderLeftDiv) => {
    paraHeaderLeftDiv.addEventListener("click", () => {
      paraCardHeader = paraHeaderLeftDiv.parentElement;
      paraCard = paraCardHeader.parentElement;
      if (paraCard.classList.contains("expanded")) {
        collapseParaCard(paraCard.id);
      } else {
        expandParaCard(paraCard.id);
      }
    })
  });
};

// Add click events to the para card divs so that divs can be more easily expanded
addParaContentExpandOnClickEvent()

// JS for wavesurfer audio player and audiobuttons

var audioButtons = document.querySelectorAll(".audioButton");

// Function to update the button state with new text and class
function updateButtonState(button, newText, newClassName) {
  button.textContent = newText;
  button.className = newClassName;
};

// Function to reset the button state to default
function resetButtonState(button) {
  var defaultText = "▶ TTS";
  var defaultClassName = "audioButton audioButton-play";
  updateButtonState(button, defaultText, defaultClassName);
};

// Set initial button state to default for all audio buttons
audioButtons.forEach(function (audioButton) {
  resetButtonState(audioButton);
});

document.addEventListener('DOMContentLoaded', () => {
  const lineCards = document.querySelectorAll('.line-card');
  let currentlyPlayingWaveSurfer = null;

  function updateButtonState(button, newText, newClassName) {
    button.textContent = newText;
    button.className = newClassName;
  }

  function resetButtonState(button) {
    var defaultText = "▶ TTS";
    var defaultClassName = "audioButton audioButton-play";
    updateButtonState(button, defaultText, defaultClassName);
  }

  lineCards.forEach((container, index) => {
    const audioElement = container.querySelector('.audioPlayer');
    const waveformContainer = container.querySelector('.audio-waveform');
    const audioBase64Ogg = audioElement.getAttribute('base64ogg');

    // Create a Blob from the base64 data
    var binaryData = atob(audioBase64Ogg);
    var arrayBuffer = new ArrayBuffer(binaryData.length);
    var view = new Uint8Array(arrayBuffer);
    for (var i = 0; i < binaryData.length; i++) {
        view[i] = binaryData.charCodeAt(i);
    }
    var blob = new Blob([arrayBuffer], { type: 'audio/ogg' });

    // Create an Object URL from the Blob
    audio_url = URL.createObjectURL(blob);

    // Create the waveform
    const wavesurfer = WaveSurfer.create({
      container: waveformContainer,
      waveColor: "#7B7B7B",
      progressColor: "#3CAD20",
      barWidth: 1,
      url: audio_url,
      responsive: true,
      height: 30,
      hideScrollbar: true,
      cursorWidth: 0,
      audioRate: 1,
      autoplay: false,
    });

    // Play/pause on button click
    const audioButton = container.querySelector('.audioButton');
    audioButton.addEventListener('click', () => {
      if (currentlyPlayingWaveSurfer && currentlyPlayingWaveSurfer !== wavesurfer) {
        currentlyPlayingWaveSurfer.stop();
        resetButtonState(currentlyPlayingAudioButton);
      }

      if (wavesurfer.isPlaying()) {
        wavesurfer.stop();
        currentlyPlayingWaveSurfer = null;
        resetButtonState(audioButton);
      } else {
        wavesurfer.play();
        currentlyPlayingWaveSurfer = wavesurfer;
        currentlyPlayingAudioButton = audioButton;
        updateButtonState(audioButton, "◼ TTS", "audioButton audioButton-stop");
      }
    });

    wavesurfer.on('finish', () => {
      if (currentlyPlayingWaveSurfer === wavesurfer) {
        currentlyPlayingWaveSurfer = null;
        resetButtonState(audioButton);
      }  

    })
  });
});

// JS for highlighting the last clicked para card
document.addEventListener('DOMContentLoaded', function() {
  var paraCards = document.querySelectorAll('.para-card');

  paraCards.forEach(function(paraCard) {
      paraCard.addEventListener('click', function() {
          // Remove 'clicked' class from all paracards
          paraCards.forEach(function(d) {
              d.classList.remove('clicked');
          });

          // Add 'clicked' class to the clicked div
          paraCard.classList.add('clicked');
      });
  });
});

// WAVE SURFER MODULE
// https://wavesurfer.xyz/
// https://github.com/katspaugh/wavesurfer.js

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).WaveSurfer=e()}(this,(function(){"use strict";
function t(t,e,i,n){return new(i||(i=Promise))((function(s,r){function o(t){try{h(n.next(t))}catch(t){r(t)}}function a(t){try{h(n.throw(t))}catch(t){r(t)}}function h(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,a)}h((n=n.apply(t,e||[])).next())}))}class e{constructor(){this.listeners={}}on(t,e,i){if(this.listeners[t]||(this.listeners[t]=new Set),this.listeners[t].add(e),null==i?void 0:i.once){const i=()=>{this.un(t,i),this.un(t,e)};return this.on(t,i),i}return()=>this.un(t,e)}un(t,e){var i;null===(i=this.listeners[t])||void 0===i||i.delete(e)}once(t,e){return this.on(t,e,{once:!0})}unAll(){this.listeners={}}emit(t,...e){this.listeners[t]&&this.listeners[t].forEach((t=>t(...e)))}}const i={decode:function(e,i){return t(this,void 0,void 0,(function*(){const t=new AudioContext({sampleRate:i});return t.decodeAudioData(e).finally((()=>t.close()))}))},createBuffer:function(t,e){return"number"==typeof t[0]&&(t=[t]),function(t){const e=t[0];if(e.some((t=>t>1||t<-1))){const i=e.length;let n=0;for(let t=0;t<i;t++){const i=Math.abs(e[t]);i>n&&(n=i)}for(const e of t)for(let t=0;t<i;t++)e[t]/=n}}(t),{duration:e,length:t[0].length,sampleRate:t[0].length/e,numberOfChannels:t.length,getChannelData:e=>null==t?void 0:t[e],copyFromChannel:AudioBuffer.prototype.copyFromChannel,copyToChannel:AudioBuffer.prototype.copyToChannel}}};function n(t,e){const i=e.xmlns?document.createElementNS(e.xmlns,t):document.createElement(t);for(const[t,s]of Object.entries(e))if("children"===t)for(const[t,s]of Object.entries(e))"string"==typeof s?i.appendChild(document.createTextNode(s)):i.appendChild(n(t,s));else"style"===t?Object.assign(i.style,s):"textContent"===t?i.textContent=s:i.setAttribute(t,s.toString());return i}function s(t,e,i){const s=n(t,e||{});return null==i||i.appendChild(s),s}var r=Object.freeze({__proto__:null,createElement:s,default:s});const o={fetchBlob:function(e,i,n){return t(this,void 0,void 0,(function*(){const s=yield fetch(e,n);if(s.status>=400)throw new Error(`Failed to fetch ${e}: ${s.status} (${s.statusText})`);return function(e,i){t(this,void 0,void 0,(function*(){if(!e.body||!e.headers)return;const n=e.body.getReader(),s=Number(e.headers.get("Content-Length"))||0;let r=0;const o=e=>t(this,void 0,void 0,(function*(){r+=(null==e?void 0:e.length)||0;const t=Math.round(r/s*100);i(t)})),a=()=>t(this,void 0,void 0,(function*(){let t;try{t=yield n.read()}catch(t){return}t.done||(o(t.value),yield a())}));a()}))}(s.clone(),i),s.blob()}))}};class a extends e{constructor(t){super(),this.isExternalMedia=!1,t.media?(this.media=t.media,this.isExternalMedia=!0):this.media=document.createElement("audio"),t.mediaControls&&(this.media.controls=!0),t.autoplay&&(this.media.autoplay=!0),null!=t.playbackRate&&this.onceMediaEvent("canplay",(()=>{null!=t.playbackRate&&(this.media.playbackRate=t.playbackRate)}))}onMediaEvent(t,e,i){return this.media.addEventListener(t,e,i),()=>this.media.removeEventListener(t,e)}onceMediaEvent(t,e){return this.onMediaEvent(t,e,{once:!0})}getSrc(){return this.media.currentSrc||this.media.src||""}revokeSrc(){const t=this.getSrc();t.startsWith("blob:")&&URL.revokeObjectURL(t)}canPlayType(t){return""!==this.media.canPlayType(t)}setSrc(t,e){if(this.getSrc()===t)return;this.revokeSrc();const i=e instanceof Blob&&this.canPlayType(e.type)?URL.createObjectURL(e):t;this.media.src=i}destroy(){this.media.pause(),this.isExternalMedia||(this.media.remove(),this.revokeSrc(),this.media.src="",this.media.load())}setMediaElement(t){this.media=t}play(){return this.media.play()}pause(){this.media.pause()}isPlaying(){return!this.media.paused&&!this.media.ended}setTime(t){this.media.currentTime=t}getDuration(){return this.media.duration}getCurrentTime(){return this.media.currentTime}getVolume(){return this.media.volume}setVolume(t){this.media.volume=t}getMuted(){return this.media.muted}setMuted(t){this.media.muted=t}getPlaybackRate(){return this.media.playbackRate}setPlaybackRate(t,e){null!=e&&(this.media.preservesPitch=e),this.media.playbackRate=t}getMediaElement(){return this.media}setSinkId(t){return this.media.setSinkId(t)}}class h extends e{constructor(t,e){super(),this.timeouts=[],this.isScrollable=!1,this.audioData=null,this.resizeObserver=null,this.lastContainerWidth=0,this.isDragging=!1,this.options=t;const i=this.parentFromOptionsContainer(t.container);this.parent=i;const[n,s]=this.initHtml();i.appendChild(n),this.container=n,this.scrollContainer=s.querySelector(".scroll"),this.wrapper=s.querySelector(".wrapper"),this.canvasWrapper=s.querySelector(".canvases"),this.progressWrapper=s.querySelector(".progress"),this.cursor=s.querySelector(".cursor"),e&&s.appendChild(e),this.initEvents()}parentFromOptionsContainer(t){let e;if("string"==typeof t?e=document.querySelector(t):t instanceof HTMLElement&&(e=t),!e)throw new Error("Container not found");return e}initEvents(){const t=t=>{const e=this.wrapper.getBoundingClientRect(),i=t.clientX-e.left,n=t.clientX-e.left;return[i/e.width,n/e.height]};this.wrapper.addEventListener("click",(e=>{const[i,n]=t(e);this.emit("click",i,n)})),this.wrapper.addEventListener("dblclick",(e=>{const[i,n]=t(e);this.emit("dblclick",i,n)})),this.options.dragToSeek&&this.initDrag(),this.scrollContainer.addEventListener("scroll",(()=>{const{scrollLeft:t,scrollWidth:e,clientWidth:i}=this.scrollContainer,n=t/e,s=(t+i)/e;this.emit("scroll",n,s)}));const e=this.createDelay(100);this.resizeObserver=new ResizeObserver((()=>{e().then((()=>this.onContainerResize())).catch((()=>{}))})),this.resizeObserver.observe(this.scrollContainer)}onContainerResize(){const t=this.parent.clientWidth;t===this.lastContainerWidth&&"auto"!==this.options.height||(this.lastContainerWidth=t,this.reRender())}initDrag(){!function(t,e,i,n,s=3,r=0){if(!t)return()=>{};let o=()=>{};const a=a=>{if(a.button!==r)return;a.preventDefault(),a.stopPropagation();let h=a.clientX,l=a.clientY,d=!1;const c=n=>{n.preventDefault(),n.stopPropagation();const r=n.clientX,o=n.clientY,a=r-h,c=o-l;if(d||Math.abs(a)>s||Math.abs(c)>s){const n=t.getBoundingClientRect(),{left:s,top:u}=n;d||(null==i||i(h-s,l-u),d=!0),e(a,c,r-s,o-u),h=r,l=o}},u=()=>{d&&(null==n||n()),o()},p=t=>{t.relatedTarget&&t.relatedTarget!==document.documentElement||u()},m=t=>{d&&(t.stopPropagation(),t.preventDefault())},f=t=>{d&&t.preventDefault()};document.addEventListener("pointermove",c),document.addEventListener("pointerup",u),document.addEventListener("pointerout",p),document.addEventListener("pointercancel",p),document.addEventListener("touchmove",f,{passive:!1}),document.addEventListener("click",m,{capture:!0}),o=()=>{document.removeEventListener("pointermove",c),document.removeEventListener("pointerup",u),document.removeEventListener("pointerout",p),document.removeEventListener("pointercancel",p),document.removeEventListener("touchmove",f),setTimeout((()=>{document.removeEventListener("click",m,{capture:!0})}),10)}};t.addEventListener("pointerdown",a)}(this.wrapper,((t,e,i)=>{this.emit("drag",Math.max(0,Math.min(1,i/this.wrapper.getBoundingClientRect().width)))}),(()=>this.isDragging=!0),(()=>this.isDragging=!1))}getHeight(t){return null==t?128:isNaN(Number(t))?"auto"===t&&this.parent.clientHeight||128:Number(t)}initHtml(){const t=document.createElement("div"),e=t.attachShadow({mode:"open"});return e.innerHTML=`\n      <style>\n        :host {\n          user-select: none;\n          min-width: 1px;\n        }\n        :host audio {\n          display: block;\n          width: 100%;\n        }\n        :host .scroll {\n          overflow-x: auto;\n          overflow-y: hidden;\n          width: 100%;\n          position: relative;\n        }\n        :host .noScrollbar {\n          scrollbar-color: transparent;\n          scrollbar-width: none;\n        }\n        :host .noScrollbar::-webkit-scrollbar {\n          display: none;\n          -webkit-appearance: none;\n        }\n        :host .wrapper {\n          position: relative;\n          overflow: visible;\n          z-index: 2;\n        }\n        :host .canvases {\n          min-height: ${this.getHeight(this.options.height)}px;\n        }\n        :host .canvases > div {\n          position: relative;\n        }\n        :host canvas {\n          display: block;\n          position: absolute;\n          top: 0;\n          image-rendering: pixelated;\n        }\n        :host .progress {\n          pointer-events: none;\n          position: absolute;\n          z-index: 2;\n          top: 0;\n          left: 0;\n          width: 0;\n          height: 100%;\n          overflow: hidden;\n        }\n        :host .progress > div {\n          position: relative;\n        }\n        :host .cursor {\n          pointer-events: none;\n          position: absolute;\n          z-index: 5;\n          top: 0;\n          left: 0;\n          height: 100%;\n          border-radius: 2px;\n        }\n      </style>\n\n      <div class="scroll" part="scroll">\n        <div class="wrapper" part="wrapper">\n          <div class="canvases"></div>\n          <div class="progress" part="progress"></div>\n          <div class="cursor" part="cursor"></div>\n        </div>\n      </div>\n    `,[t,e]}setOptions(t){if(this.options.container!==t.container){const e=this.parentFromOptionsContainer(t.container);e.appendChild(this.container),this.parent=e}t.dragToSeek&&!this.options.dragToSeek&&this.initDrag(),this.options=t,this.reRender()}getWrapper(){return this.wrapper}getScroll(){return this.scrollContainer.scrollLeft}destroy(){var t;this.container.remove(),null===(t=this.resizeObserver)||void 0===t||t.disconnect()}createDelay(t=10){let e,i;const n=()=>{e&&clearTimeout(e),i&&i()};return this.timeouts.push(n),()=>new Promise(((s,r)=>{n(),i=r,e=setTimeout((()=>{e=void 0,i=void 0,s()}),t)}))}convertColorValues(t){if(!Array.isArray(t))return t||"";if(t.length<2)return t[0]||"";const e=document.createElement("canvas"),i=e.getContext("2d"),n=e.height*(window.devicePixelRatio||1),s=i.createLinearGradient(0,0,0,n),r=1/(t.length-1);return t.forEach(((t,e)=>{const i=e*r;s.addColorStop(i,t)})),s}renderBarWaveform(t,e,i,n){const s=t[0],r=t[1]||t[0],o=s.length,{width:a,height:h}=i.canvas,l=h/2,d=window.devicePixelRatio||1,c=e.barWidth?e.barWidth*d:1,u=e.barGap?e.barGap*d:e.barWidth?c/2:0,p=e.barRadius||0,m=a/(c+u)/o,f=p&&"roundRect"in i?"roundRect":"rect";i.beginPath();let v=0,g=0,b=0;for(let t=0;t<=o;t++){const o=Math.round(t*m);if(o>v){const t=Math.round(g*l*n),s=t+Math.round(b*l*n)||1;let r=l-t;"top"===e.barAlign?r=0:"bottom"===e.barAlign&&(r=h-s),i[f](v*(c+u),r,c,s,p),v=o,g=0,b=0}const a=Math.abs(s[t]||0),d=Math.abs(r[t]||0);a>g&&(g=a),d>b&&(b=d)}i.fill(),i.closePath()}renderLineWaveform(t,e,i,n){const s=e=>{const s=t[e]||t[0],r=s.length,{height:o}=i.canvas,a=o/2,h=i.canvas.width/r;i.moveTo(0,a);let l=0,d=0;for(let t=0;t<=r;t++){const r=Math.round(t*h);if(r>l){const t=a+(Math.round(d*a*n)||1)*(0===e?-1:1);i.lineTo(l,t),l=r,d=0}const o=Math.abs(s[t]||0);o>d&&(d=o)}i.lineTo(l,a)};i.beginPath(),s(0),s(1),i.fill(),i.closePath()}renderWaveform(t,e,i){if(i.fillStyle=this.convertColorValues(e.waveColor),e.renderFunction)return void e.renderFunction(t,i);let n=e.barHeight||1;if(e.normalize){const e=Array.from(t[0]).reduce(((t,e)=>Math.max(t,Math.abs(e))),0);n=e?1/e:1}e.barWidth||e.barGap||e.barAlign?this.renderBarWaveform(t,e,i,n):this.renderLineWaveform(t,e,i,n)}renderSingleCanvas(t,e,i,n,s,r,o,a){const h=window.devicePixelRatio||1,l=document.createElement("canvas"),d=t[0].length;l.width=Math.round(i*(r-s)/d),l.height=n*h,l.style.width=`${Math.floor(l.width/h)}px`,l.style.height=`${n}px`,l.style.left=`${Math.floor(s*i/h/d)}px`,o.appendChild(l);const c=l.getContext("2d");if(this.renderWaveform(t.map((t=>t.slice(s,r))),e,c),l.width>0&&l.height>0){const t=l.cloneNode(),i=t.getContext("2d");i.drawImage(l,0,0),i.globalCompositeOperation="source-in",i.fillStyle=this.convertColorValues(e.progressColor),i.fillRect(0,0,l.width,l.height),a.appendChild(t)}}renderChannel(e,i,n){return t(this,void 0,void 0,(function*(){const s=document.createElement("div"),r=this.getHeight(i.height);s.style.height=`${r}px`,this.canvasWrapper.style.minHeight=`${r}px`,this.canvasWrapper.appendChild(s);const o=s.cloneNode();this.progressWrapper.appendChild(o);const a=e[0].length,l=(t,h)=>{this.renderSingleCanvas(e,i,n,r,Math.max(0,t),Math.min(h,a),s,o)};if(!this.isScrollable)return void l(0,a);const{scrollLeft:d,scrollWidth:c,clientWidth:u}=this.scrollContainer,p=a/c;let m=Math.min(h.MAX_CANVAS_WIDTH,u);if(i.barWidth||i.barGap){const t=i.barWidth||.5,e=t+(i.barGap||t/2);m%e!=0&&(m=Math.floor(m/e)*e)}const f=Math.floor(Math.abs(d)*p),v=Math.floor(f+m*p),g=v-f;l(f,v),yield Promise.all([(()=>t(this,void 0,void 0,(function*(){if(0===f)return;const t=this.createDelay();for(let e=f;e>=0;e-=g)yield t(),l(Math.max(0,e-g),e)})))(),(()=>t(this,void 0,void 0,(function*(){if(v===a)return;const t=this.createDelay();for(let e=v;e<a;e+=g)yield t(),l(e,Math.min(a,e+g))})))()])}))}render(e){return t(this,void 0,void 0,(function*(){this.timeouts.forEach((t=>t())),this.timeouts=[],this.canvasWrapper.innerHTML="",this.progressWrapper.innerHTML="",null!=this.options.width&&(this.scrollContainer.style.width="number"==typeof this.options.width?`${this.options.width}px`:this.options.width);const t=window.devicePixelRatio||1,i=this.scrollContainer.clientWidth,n=Math.ceil(e.duration*(this.options.minPxPerSec||0));this.isScrollable=n>i;const s=this.options.fillParent&&!this.isScrollable,r=(s?i:n)*t;this.wrapper.style.width=s?"100%":`${n}px`,this.scrollContainer.style.overflowX=this.isScrollable?"auto":"hidden",this.scrollContainer.classList.toggle("noScrollbar",!!this.options.hideScrollbar),this.cursor.style.backgroundColor=`${this.options.cursorColor||this.options.progressColor}`,this.cursor.style.width=`${this.options.cursorWidth}px`,this.audioData=e,this.emit("render");try{if(this.options.splitChannels)yield Promise.all(Array.from({length:e.numberOfChannels}).map(((t,i)=>{var n;const s=Object.assign(Object.assign({},this.options),null===(n=this.options.splitChannels)||void 0===n?void 0:n[i]);return this.renderChannel([e.getChannelData(i)],s,r)})));else{const t=[e.getChannelData(0)];e.numberOfChannels>1&&t.push(e.getChannelData(1)),yield this.renderChannel(t,this.options,r)}}catch(t){return}this.emit("rendered")}))}reRender(){if(!this.audioData)return;const{scrollWidth:t}=this.scrollContainer,e=this.progressWrapper.clientWidth;if(this.render(this.audioData),this.isScrollable&&t!==this.scrollContainer.scrollWidth){const t=this.progressWrapper.clientWidth;this.scrollContainer.scrollLeft+=t-e}}zoom(t){this.options.minPxPerSec=t,this.reRender()}scrollIntoView(t,e=!1){const{scrollLeft:i,scrollWidth:n,clientWidth:s}=this.scrollContainer,r=t*n,o=i,a=i+s,h=s/2;if(this.isDragging){const t=30;r+t>a?this.scrollContainer.scrollLeft+=t:r-t<o&&(this.scrollContainer.scrollLeft-=t)}else{(r<o||r>a)&&(this.scrollContainer.scrollLeft=r-(this.options.autoCenter?h:0));const t=r-i-h;e&&this.options.autoCenter&&t>0&&(this.scrollContainer.scrollLeft+=Math.min(t,10))}{const t=this.scrollContainer.scrollLeft,e=t/n,i=(t+s)/n;this.emit("scroll",e,i)}}renderProgress(t,e){if(isNaN(t))return;const i=100*t;this.canvasWrapper.style.clipPath=`polygon(${i}% 0, 100% 0, 100% 100%, ${i}% 100%)`,this.progressWrapper.style.width=`${i}%`,this.cursor.style.left=`${i}%`,this.cursor.style.marginLeft=100===Math.round(i)?`-${this.options.cursorWidth}px`:"",this.isScrollable&&this.options.autoScroll&&this.scrollIntoView(t,e)}exportImage(e,i,n){return t(this,void 0,void 0,(function*(){const t=this.canvasWrapper.querySelectorAll("canvas");if(!t.length)throw new Error("No waveform data");if("dataURL"===n){const n=Array.from(t).map((t=>t.toDataURL(e,i)));return Promise.resolve(n)}return Promise.all(Array.from(t).map((t=>new Promise(((n,s)=>{t.toBlob((t=>{t?n(t):s(new Error("Could not export image"))}),e,i)})))))}))}}h.MAX_CANVAS_WIDTH=4e3;class l extends e{constructor(){super(...arguments),this.unsubscribe=()=>{}}start(){this.unsubscribe=this.on("tick",(()=>{requestAnimationFrame((()=>{this.emit("tick")}))})),this.emit("tick")}stop(){this.unsubscribe()}destroy(){this.unsubscribe()}}class d extends e{constructor(t=new AudioContext){super(),this.bufferNode=null,this.autoplay=!1,this.playStartTime=0,this.playedDuration=0,this._muted=!1,this.buffer=null,this.currentSrc="",this.paused=!0,this.crossOrigin=null,this.addEventListener=this.on,this.removeEventListener=this.un,this.audioContext=t,this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination)}load(){return t(this,void 0,void 0,(function*(){}))}get src(){return this.currentSrc}set src(t){if(this.currentSrc=t,!t)return this.buffer=null,void this.emit("emptied");fetch(t).then((t=>t.arrayBuffer())).then((e=>this.currentSrc!==t?null:this.audioContext.decodeAudioData(e))).then((e=>{this.currentSrc===t&&(this.buffer=e,this.emit("loadedmetadata"),this.emit("canplay"),this.autoplay&&this.play())}))}_play(){var t;this.paused&&(this.paused=!1,null===(t=this.bufferNode)||void 0===t||t.disconnect(),this.bufferNode=this.audioContext.createBufferSource(),this.bufferNode.buffer=this.buffer,this.bufferNode.connect(this.gainNode),this.playedDuration>=this.duration&&(this.playedDuration=0),this.bufferNode.start(this.audioContext.currentTime,this.playedDuration),this.playStartTime=this.audioContext.currentTime,this.bufferNode.onended=()=>{this.currentTime>=this.duration&&(this.pause(),this.emit("ended"))})}_pause(){var t;this.paused||(this.paused=!0,null===(t=this.bufferNode)||void 0===t||t.stop(),this.playedDuration+=this.audioContext.currentTime-this.playStartTime)}play(){return t(this,void 0,void 0,(function*(){this._play(),this.emit("play")}))}pause(){this._pause(),this.emit("pause")}stopAt(t){var e,i;const n=t-this.currentTime;null===(e=this.bufferNode)||void 0===e||e.stop(this.audioContext.currentTime+n),null===(i=this.bufferNode)||void 0===i||i.addEventListener("ended",(()=>{this.bufferNode=null,this.pause()}),{once:!0})}setSinkId(e){return t(this,void 0,void 0,(function*(){return this.audioContext.setSinkId(e)}))}get playbackRate(){var t,e;return null!==(e=null===(t=this.bufferNode)||void 0===t?void 0:t.playbackRate.value)&&void 0!==e?e:1}set playbackRate(t){this.bufferNode&&(this.bufferNode.playbackRate.value=t)}get currentTime(){return this.paused?this.playedDuration:this.playedDuration+this.audioContext.currentTime-this.playStartTime}set currentTime(t){this.emit("seeking"),this.paused?this.playedDuration=t:(this._pause(),this.playedDuration=t,this._play()),this.emit("timeupdate")}get duration(){var t;return(null===(t=this.buffer)||void 0===t?void 0:t.duration)||0}get volume(){return this.gainNode.gain.value}set volume(t){this.gainNode.gain.value=t,this.emit("volumechange")}get muted(){return this._muted}set muted(t){this._muted!==t&&(this._muted=t,this._muted?this.gainNode.disconnect():this.gainNode.connect(this.audioContext.destination))}canPlayType(t){return/^(audio|video)\//.test(t)}getGainNode(){return this.gainNode}getChannelData(){const t=[];if(!this.buffer)return t;const e=this.buffer.numberOfChannels;for(let i=0;i<e;i++)t.push(this.buffer.getChannelData(i));return t}}const c={waveColor:"#999",progressColor:"#555",cursorWidth:1,minPxPerSec:0,fillParent:!0,interact:!0,dragToSeek:!1,autoScroll:!0,autoCenter:!0,sampleRate:8e3};class u extends a{static create(t){return new u(t)}constructor(t){const e=t.media||("WebAudio"===t.backend?new d:void 0);super({media:e,mediaControls:t.mediaControls,autoplay:t.autoplay,playbackRate:t.audioRate}),this.plugins=[],this.decodedData=null,this.subscriptions=[],this.mediaSubscriptions=[],this.options=Object.assign({},c,t),this.timer=new l;const i=e?void 0:this.getMediaElement();this.renderer=new h(this.options,i),this.initPlayerEvents(),this.initRendererEvents(),this.initTimerEvents(),this.initPlugins(),Promise.resolve().then((()=>{this.emit("init");const t=this.options.url||this.getSrc()||"";(t||this.options.peaks&&this.options.duration)&&this.load(t,this.options.peaks,this.options.duration)}))}initTimerEvents(){this.subscriptions.push(this.timer.on("tick",(()=>{const t=this.getCurrentTime();this.renderer.renderProgress(t/this.getDuration(),!0),this.emit("timeupdate",t),this.emit("audioprocess",t)})))}initPlayerEvents(){this.isPlaying()&&(this.emit("play"),this.timer.start()),this.mediaSubscriptions.push(this.onMediaEvent("timeupdate",(()=>{const t=this.getCurrentTime();this.renderer.renderProgress(t/this.getDuration(),this.isPlaying()),this.emit("timeupdate",t)})),this.onMediaEvent("play",(()=>{this.emit("play"),this.timer.start()})),this.onMediaEvent("pause",(()=>{this.emit("pause"),this.timer.stop()})),this.onMediaEvent("emptied",(()=>{this.timer.stop()})),this.onMediaEvent("ended",(()=>{this.emit("finish")})),this.onMediaEvent("seeking",(()=>{this.emit("seeking",this.getCurrentTime())})))}initRendererEvents(){this.subscriptions.push(this.renderer.on("click",((t,e)=>{this.options.interact&&(this.seekTo(t),this.emit("interaction",t*this.getDuration()),this.emit("click",t,e))})),this.renderer.on("dblclick",((t,e)=>{this.emit("dblclick",t,e)})),this.renderer.on("scroll",((t,e)=>{const i=this.getDuration();this.emit("scroll",t*i,e*i)})),this.renderer.on("render",(()=>{this.emit("redraw")})),this.renderer.on("rendered",(()=>{this.emit("redrawcomplete")})));{let t;this.subscriptions.push(this.renderer.on("drag",(e=>{this.options.interact&&(this.renderer.renderProgress(e),clearTimeout(t),t=setTimeout((()=>{this.seekTo(e)}),this.isPlaying()?0:200),this.emit("interaction",e*this.getDuration()),this.emit("drag",e))})))}}initPlugins(){var t;(null===(t=this.options.plugins)||void 0===t?void 0:t.length)&&this.options.plugins.forEach((t=>{this.registerPlugin(t)}))}unsubscribePlayerEvents(){this.mediaSubscriptions.forEach((t=>t())),this.mediaSubscriptions=[]}setOptions(t){this.options=Object.assign({},this.options,t),this.renderer.setOptions(this.options),t.audioRate&&this.setPlaybackRate(t.audioRate),null!=t.mediaControls&&(this.getMediaElement().controls=t.mediaControls)}registerPlugin(t){return t._init(this),this.plugins.push(t),this.subscriptions.push(t.once("destroy",(()=>{this.plugins=this.plugins.filter((e=>e!==t))}))),t}getWrapper(){return this.renderer.getWrapper()}getScroll(){return this.renderer.getScroll()}getActivePlugins(){return this.plugins}loadAudio(e,n,s,r){return t(this,void 0,void 0,(function*(){if(this.emit("load",e),!this.options.media&&this.isPlaying()&&this.pause(),this.decodedData=null,!n&&!s){const t=t=>this.emit("loading",t);n=yield o.fetchBlob(e,t,this.options.fetchParams)}this.setSrc(e,n);const t=r||this.getDuration()||(yield new Promise((t=>{this.onceMediaEvent("loadedmetadata",(()=>t(this.getDuration())))})));if(s)this.decodedData=i.createBuffer(s,t||0);else if(n){const t=yield n.arrayBuffer();this.decodedData=yield i.decode(t,this.options.sampleRate)}this.decodedData&&(this.emit("decode",this.getDuration()),this.renderer.render(this.decodedData)),this.emit("ready",this.getDuration())}))}load(e,i,n){return t(this,void 0,void 0,(function*(){yield this.loadAudio(e,void 0,i,n)}))}loadBlob(e,i,n){return t(this,void 0,void 0,(function*(){yield this.loadAudio("blob",e,i,n)}))}zoom(t){if(!this.decodedData)throw new Error("No audio loaded");this.renderer.zoom(t),this.emit("zoom",t)}getDecodedData(){return this.decodedData}exportPeaks({channels:t=2,maxLength:e=8e3,precision:i=1e4}={}){if(!this.decodedData)throw new Error("The audio has not been decoded yet");const n=Math.min(t,this.decodedData.numberOfChannels),s=[];for(let t=0;t<n;t++){const n=this.decodedData.getChannelData(t),r=[],o=Math.round(n.length/e);for(let t=0;t<e;t++){const e=n.slice(t*o,(t+1)*o);let s=0;for(let t=0;t<e.length;t++){const i=e[t];Math.abs(i)>Math.abs(s)&&(s=i)}r.push(Math.round(s*i)/i)}s.push(r)}return s}getDuration(){let t=super.getDuration()||0;return 0!==t&&t!==1/0||!this.decodedData||(t=this.decodedData.duration),t}toggleInteraction(t){this.options.interact=t}seekTo(t){const e=this.getDuration()*t;this.setTime(e)}playPause(){return t(this,void 0,void 0,(function*(){return this.isPlaying()?this.pause():this.play()}))}stop(){this.pause(),this.setTime(0)}skip(t){this.setTime(this.getCurrentTime()+t)}empty(){this.load("",[[0]],.001)}setMediaElement(t){this.unsubscribePlayerEvents(),super.setMediaElement(t),this.initPlayerEvents()}exportImage(e="image/png",i=1,n="dataURL"){return t(this,void 0,void 0,(function*(){return this.renderer.exportImage(e,i,n)}))}destroy(){this.emit("destroy"),this.plugins.forEach((t=>t.destroy())),this.subscriptions.forEach((t=>t())),this.unsubscribePlayerEvents(),this.timer.destroy(),this.renderer.destroy(),super.destroy()}}return u.BasePlugin=class extends e{constructor(t){super(),this.subscriptions=[],this.options=t}onInit(){}_init(t){this.wavesurfer=t,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach((t=>t()))}},u.dom=r,u}));