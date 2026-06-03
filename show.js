/* FLY MIAMI · EPIC kiosk guide — offline, no API keys. */

const ARTIST = {
  name: "Facundo Yebne",
  handle: "@flymiami.art",
  site: "flymiami.art",
  show: "Kimpton EPIC Hotel, Downtown Miami",
  when: "Summer 2026 (June–July)",
  themes: "USA 250 · Miami Pride · FIFA World Cup 2026",
  about:
    "I'm Facundo Yebne — FLY. I build sculptures and wall works out of thousands of rubber and resin ducks. " +
    "One material, one message: peace, love, and joy. This EPIC residency lands right as the world arrives in " +
    "Miami for the World Cup, Pride, and the USA 250th — so the whole floor is built around unity.",
};

// emoji fallback per theme so it looks alive even before photos are dropped in /images
const THEME_ART = { USA:"🇺🇸", PRIDE:"🏳️‍🌈", FIFA:"⚽", LOVE:"💗", MIAMI:"🦩" };

const ART = [
  {n:1, slug:"united-kuakies", title:"United Kuakies of America", theme:"USA",
   medium:"Tiny resin ducks (solid)", size:"12 × 18 in", price:1500, loc:"16th Floor",
   desc:"An iconic flag reimagined — every red, white and blue stripe hand-built from solid resin ducks in perfect formation. Patriotism through playful precision."},
  {n:2, slug:"dont-kuack-liberty", title:"Don't Kuack With Liberty", theme:"USA",
   medium:"Tiny resin ducks (solid)", size:"18 × 24 in", price:2000, loc:"16th Floor",
   desc:"Lady Liberty rebuilt from hundreds of tiny resin ducks — a symbol of freedom run through repetition, humor and material transformation into my pop vocabulary."},
  {n:3, slug:"peace-pride", title:"Peace, We All Need Some — Pride", theme:"PRIDE",
   medium:"Mini rubber ducks", size:"36 × 36 in", price:3000, loc:"16th Floor · Pride wall",
   desc:"The universal peace symbol reimagined across the Pride spectrum. Color and repetition become a call for shared humanity and visibility."},
  {n:4, slug:"love-for-argentina", title:"Love For Argentina", theme:"FIFA",
   medium:"Mini rubber ducks + glow resin", size:"18 × 24 in", price:2000, loc:"16th Floor",
   desc:"A love letter to my homeland in sky-blue and white — mini rubber ducks layered with glowing resin that comes alive after dark."},
  {n:5, slug:"corazon-argentina", title:"Corazón de Argentina", theme:"FIFA",
   medium:"Resin ducks (solid + neon)", size:"16 × 16 in", price:1000, loc:"16th Floor",
   desc:"A heart for the homeland — intimate in scale, vivid in feeling. Solid and neon resin ducks build a glowing core in Argentina's colors."},
  {n:6, slug:"america-peace", title:"America Peace", theme:"USA",
   medium:"Mini rubber ducks", size:"20 × 20 in", price:1000, loc:"16th Floor",
   desc:"A meditation on the American dream through a peace symbol. A quiet manifesto bridging the show's USA and Peace threads."},
  {n:7, slug:"polaroid", title:"Polaroid", theme:"USA",
   medium:"Rubber ducks, several sizes", size:"50 × 70 in", price:3000, loc:"16th Floor",
   desc:"A monumental snapshot built from rubber ducks at multiple scales — the most nostalgic of frames stretched into a billboard for memory and material."},
  {n:8, slug:"messi-argentina", title:"Messi Argentina", theme:"FIFA",
   medium:"Resin ducks (solid + glow)", size:"18 × 24 in", price:1600, loc:"16th Floor · near terrace",
   desc:"A tribute to Lionel Messi — sport, art and innovation in sky-blue and white. Glow-in-the-dark resin anchors the FIFA wall."},
  {n:9, slug:"pulisic-usa", title:"Pulisic for USA", theme:"FIFA",
   medium:"Resin ducks (solid + glow)", size:"18 × 24 in", price:1600, loc:"16th Floor · near elevator",
   desc:"Christian Pulisic for Team USA — the man carrying American football into the 2026 World Cup, in resin ducks that glow when the lights drop."},
  {n:10, slug:"its-so-miami", title:"It's so Miami", theme:"PRIDE",
   medium:"Tiny resin flamingos", size:"30 × 30 in", price:3000, loc:"16th Floor · Pride side",
   desc:"Miami in one image — built from resin flamingos, not ducks. The city's queer-coded flamingo meets a sunset reimagined in Pride color."},
  {n:11, slug:"unitybeak-love", title:"UnityBeak Trilogy: Love", theme:"LOVE",
   medium:"Mini rubber ducks (sculpture)", size:"4' × 3.5' × 4.2'", price:10000, loc:"Lobby · left of entrance",
   desc:"Love as a unifying force connecting individuality into a shared whole — thousands of mini rubber ducks in three dimensions, the first thing that welcomes you."},
  {n:12, slug:"proud-love-pink", title:"Proud Love Pink", theme:"PRIDE",
   medium:"Medium rubber ducks over fiberglass", size:"~7.5' tall on cherub base", price:10000, loc:"16th Floor · center",
   desc:"A pink heart rising from a classical cherub base — medium rubber ducks in layers of pink and red. Love monumentalized, a statement on pride, visibility and devotion."},
  {n:13, slug:"world-cup-duck", title:"World Cup Duck", theme:"FIFA",
   medium:"Mini rubber ducks (sculpture)", size:"4' × 3.5' × 4.2'", price:10000, loc:"Lobby / 16th Floor",
   desc:"A message of unity in the mixed flags of the favorite nations of FIFA World Cup 2026 — thousands of mini rubber ducks assembled in three dimensions."},
];

let selected = null;
let ttsOn = true;

/* ---------- render gallery ---------- */
const gallery = document.getElementById("gallery");
ART.forEach(a=>{
  const c = document.createElement("div");
  c.className = "card"; c.dataset.slug = a.slug;
  c.innerHTML = `
    <div class="thumb">
      <span class="tag ${a.theme}">${a.theme}</span>
      <img src="images/${a.slug}.jpg" alt="${a.title}"
           onerror="this.style.display='none';this.parentNode.insertAdjacentText('beforeend','${THEME_ART[a.theme]||'🦆'}')">
    </div>
    <div class="meta">
      <h3>${a.n}. ${a.title}</h3>
      <div class="sub">${a.medium} · ${a.size}</div>
      <div class="price">$${a.price.toLocaleString()}</div>
    </div>`;
  c.onclick = ()=>selectArt(a.slug);
  gallery.appendChild(c);
});

/* ---------- chat ---------- */
const chat = document.getElementById("chat");
function say(text, who="fy"){
  const b = document.createElement("div");
  b.className = "bubble "+who;
  b.innerHTML = text;
  chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
  if(who==="fy" && ttsOn) speak(text.replace(/<[^>]+>/g," "));
}

function selectArt(slug){
  selected = ART.find(a=>a.slug===slug);
  document.querySelectorAll(".card").forEach(c=>c.classList.toggle("sel", c.dataset.slug===slug));
  say(`<b>${selected.title}</b> — ${selected.desc}<br><br>` +
      `<i>${selected.medium} · ${selected.size} · ${selected.loc} · $${selected.price.toLocaleString()}</i>`);
}

/* ---------- tiny offline answer engine ---------- */
function answer(qRaw){
  const q = qRaw.toLowerCase();
  const hit = ART.find(a=> q.includes(a.title.toLowerCase().split(" ")[0]) ||
                           a.title.toLowerCase().split(" ").some(w=>w.length>3 && q.includes(w)));
  if(/who are you|your name|about you|who is|artist|facundo|\bfly\b/.test(q))
    return `<b>${ARTIST.about}</b>`;
  if(/where|when|show|exhibit|epic|hotel|address/.test(q))
    return `This is <b>${ARTIST.show}</b>, ${ARTIST.when}. Themes: ${ARTIST.themes}. Find me at ${ARTIST.handle}.`;
  if(/how many|number of|total/.test(q))
    return `There are <b>${ART.length} works</b> in the show — wall pieces and three large sculptures.`;
  if(/price|cost|buy|sale|how much|purchase/.test(q)){
    if(hit) return `<b>${hit.title}</b> is <b>$${hit.price.toLocaleString()}</b>. Tap the card for full details.`;
    return `Prices run <b>$1,000–$10,000</b>. Tap any artwork for its price, or ask "how much is Messi?"`;
  }
  if(/duck|material|made of|how.*made|resin|rubber/.test(q))
    return `Everything is built from <b>rubber and resin ducks</b> — solid, mini, glow and neon — placed by hand. One mass-produced object, turned into peace, love and joy.`;
  if(/glow|dark|night|neon/.test(q))
    return `Several pieces — Messi, Pulisic, Love For Argentina, Corazón — use <b>glow and neon resin</b> that comes alive when the lights drop. Come back after dark.`;
  if(/pride|lgbt|queer/.test(q))
    return `The Pride wall: <b>Peace We All Need Some</b>, <b>It's so Miami</b> and <b>Proud Love Pink</b> — color, flamingos and a 7.5' heart.`;
  if(/fifa|soccer|football|world cup|messi|argentina/.test(q))
    return `The FIFA wall: <b>Messi Argentina</b>, <b>Pulisic for USA</b>, <b>World Cup Duck</b>, plus my Argentine love letters. Built for World Cup 2026.`;
  if(hit) return `<b>${hit.title}</b> — ${hit.desc}`;
  return `Good question. Tap any artwork to hear its story, or ask me about the ducks, the themes, prices, or where to find me (${ARTIST.handle}).`;
}

function handleAsk(text){
  if(!text.trim()) return;
  say(text,"me");
  setTimeout(()=>say(answer(text)), 250);
}

/* ---------- input wiring ---------- */
const q = document.getElementById("q");
document.getElementById("ask").onclick = ()=>{ handleAsk(q.value); q.value=""; };
q.addEventListener("keydown", e=>{ if(e.key==="Enter"){ handleAsk(q.value); q.value=""; }});

/* suggestion chips */
const chips = ["Who are you?","Tell me about the ducks","Show me the FIFA wall","What's on the Pride wall?","How much is Proud Love Pink?","When & where is the show?"];
const chipBox = document.getElementById("chips");
chips.forEach(t=>{ const el=document.createElement("div"); el.className="chip"; el.textContent=t; el.onclick=()=>handleAsk(t); chipBox.appendChild(el); });

/* ---------- voice out (Web Speech) ---------- */
let voice=null;
function pickVoice(){
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v=>/en-US/i.test(v.lang) && /male|Daniel|Alex|Google US/i.test(v.name)) ||
          vs.find(v=>/en/i.test(v.lang)) || vs[0];
}
if("speechSynthesis" in window){ speechSynthesis.onvoiceschanged = pickVoice; pickVoice(); }
function speak(t){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t); u.voice=voice; u.rate=1; u.pitch=1; speechSynthesis.speak(u);
}
document.getElementById("ttsToggle").onclick = function(){
  ttsOn=!ttsOn; this.textContent = ttsOn ? "🔊 Voice ON — tap to mute" : "🔇 Voice OFF — tap to unmute";
  if(!ttsOn) speechSynthesis.cancel();
};

/* ---------- voice in (optional, Chrome/Android) ---------- */
const mic = document.getElementById("mic");
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if(SR){
  const rec = new SR(); rec.lang="en-US"; rec.interimResults=false;
  mic.onclick = ()=>{ try{ rec.start(); mic.textContent="…"; }catch(e){} };
  rec.onresult = e=>{ mic.textContent="🎤"; handleAsk(e.results[0][0].transcript); };
  rec.onerror = ()=>{ mic.textContent="🎤"; };
  rec.onend = ()=>{ mic.textContent="🎤"; };
} else { mic.style.display="none"; }

/* ---------- welcome ---------- */
say(`👋 Hi, I'm <b>Facundo</b>. Welcome to my EPIC show — thousands of rubber ducks for peace, love and joy. ` +
    `Tap any piece to hear its story, or just ask me anything.`);
