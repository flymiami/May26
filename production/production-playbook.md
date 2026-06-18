# Production Playbook — Making the Reels

How to actually produce a daily Mini FLY Duck reel — consistently, fast, and on-model.
Written for the AI + animation toolset available in this environment.

> **Golden rule: character consistency.** Every frame must look like the *same* duck.
> Lock a master reference, reuse it for every generation, and never let the model drift.

---

## 0. One-time setup (do this first)

1. **Master reference sheet.** Take the hero image and generate a turnaround
   (front / 3-4 / side / back) + expression sheet (happy, surprised, thinking, laughing)
   + a few signature poses (peace sign, mid-dance, mid-air). Save to `assets/`.
2. **Style string.** Write one reusable prompt fragment and paste it into *every* image/
   video generation so the look stays identical:
   > *"Mini FLY Duck: chibi 3D vinyl-toy duck, golden-yellow body, big glossy eyes, orange
   > bill, black backwards snapback cap, tan bomber-hoodie with 'FLY' chest patch, white
   > smiley-face tee, black shorts, chunky multicolor high-top sneakers, Pixar-soft studio
   > lighting, clean background, bright and joyful."*
3. **Brand kit.** Colors + fonts from `brand/character-bible.md` loaded into your design tool.
4. **Watermark file.** A small transparent "FLY" logo PNG to drop on every export.

---

## 1. The tools you have (and what each is best for)

| Job | Tool | Use it for |
|-----|------|-----------|
| Generate character images / poses | **Higgsfield** `generate_image` | Stills, new poses, scenes, expression sheets |
| Animate stills → motion (dance, action) | **Higgsfield** `generate_video` / `motion_control` / `animation_actions` | Turning a pose into a moving clip; dance & sport motion |
| Make the character "talk" / lip-sync | **Higgsfield** + speech tools | If you give FLY a voice on advice/quote days |
| Sound / music beds | **Higgsfield** `generate_audio` | Original audio for quote/advice/reset days |
| Pro design / posters / quote frames | **Adobe Express** (`export_html_to_express`, `animate_design`) | Wednesday quote cards, carousels, thumbnails, end-cards |
| Photo cleanup / background / cutouts | **Adobe** image tools (`image_remove_background`, etc.) | Compositing the duck into scenes, cleanups |
| Edit / caption / assemble the reel | **Descript** (`prompt_project_agent`) | Trimming, captions, arranging clips, final cut |
| Predict if a cut will pop | **Higgsfield** `virality_predictor` | QA a reel before posting; test hooks |
| Branded slides / mini case decks | **Gamma** | Pitch decks / brand one-pagers (not the reels themselves) |

> I can drive most of these for you directly from here — generate FLY in new poses,
> animate a dance, build a quote card, predict virality, etc. Just say the word and
> point me at the day you want to make first.

---

## 2. The repeatable pipeline (per reel)

```
1. PICK   → choose the idea from content-pillars.md
2. STILL  → generate_image: FLY in the needed pose/scene (paste the style string)
3. MOVE   → generate_video / motion_control: animate the still into the action
4. SOUND  → trending audio (dance/comedy) OR generate_audio (quote/advice/reset)
5. CUT    → Descript: trim to 7–15s, make it loop, add on-screen text + captions
6. BRAND  → drop the FLY watermark + brand colors/fonts on text (Adobe Express)
7. QA     → virality_predictor + the consistency checklist
8. EXPORT → 1080×1920, .mp4, high bitrate
9. SCHEDULE → Meta Business Suite / TikTok / Later at the fixed daily time
```

### Per-pillar production notes
- **Dance (Mon):** animate FLY to the *beat* of a trending sound; design the last frame to
  match the first for a seamless loop.
- **Sport (Tue):** use motion-control / action presets for big dynamic movement; slow-mo
  the peak moment; comedic landing optional.
- **Quote (Wed):** fastest to make — a clean FLY still + a strong type treatment in Adobe
  Express. Also export as a 3-slide carousel for extra saves.
- **Advice (Thu):** softer scene, FLY "speaking" (optional lip-sync/VO) or warm text; gentle
  original audio.
- **Jokes (Fri):** two-beat timing — setup frame, then punchline frame/reaction. Snappy cut.
- **Lifestyle (Sat):** stitch 2–4 short scene clips into a mini-vlog; vibey trending audio.
- **Reset (Sun):** slow, cozy, minimal cuts; warm color grade; original calm audio.

---

## 3. Batch workflow (the time-saver)

Don't make one a day. **Make a week in one sitting:**

1. **Block 2–3 hrs** on Sunday.
2. Generate **all 7 stills** first (consistency is easier in one run).
3. Animate **all 7** clips.
4. Edit + caption **all 7** in Descript.
5. Brand + export **all 7**.
6. **Schedule** the whole week.
7. During the week: only reply to comments (as the duck). Done.

> Always keep **3–5 evergreen reels in reserve** (quotes/jokes work great) so a busy week
> never breaks your streak.

---

## 4. Export specs

- **Resolution:** 1080 × 1920 (9:16). Square 1080×1080 only for feed-specific quote cards.
- **Length:** 6–20s sweet spot; loop when possible.
- **Format:** .mp4 (H.264), high bitrate, captions burned-in (most watch muted).
- **Safe zones:** keep text/face out of the bottom ~15% (UI covers it) and top ~10%.
- **Cover/thumbnail:** a clean FLY face + 2–4 word label per pillar, consistent template
  (built once in Adobe Express) so your profile grid looks designed.

---

## 5. Quality gate (before anything posts)

- [ ] Looks like the *same* duck (cap, FLY jacket, smiley tee, kicks).
- [ ] Hook lands in the first 0.5–1s.
- [ ] Loops or ends on a clean button.
- [ ] Captions burned in, readable muted.
- [ ] FLY watermark present.
- [ ] On-brand colors/fonts.
- [ ] Right pillar for the right day.
- [ ] (Optional) virality_predictor score sanity-checked.
