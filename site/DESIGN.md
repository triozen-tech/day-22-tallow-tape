# DESIGN.md · Day 22 · Tallow & Tape

**Mode: Pro** (LEAN, desktop 1440×900 only). Music recording and rehearsal studio. Fictional brand. Reel hook: "Studios: this is your website."
Pick: **layout B (Tape Desk)** + from C the **record player (Sessions)** and **hold-to-leave-a-voice-note (Booking)**. Hero film is now near full-screen.
Reference: none (inbox empty; the user picked from our own mockups B and C, files in the private refs repo `day22/layouts/`).
Uniqueness: 8 of 8 different from Days 19, 20, 21 (see the sites log).

## Choices

| Choice | Pick | Why |
|---|---|---|
| Look | L12 brutalist mono, dark, one warm lamp | Raw tape-desk feel; unlike Day 19 grey/cobalt, Day 20 khaki, Day 21 dusk teal |
| Palette | Black `#0e0a09`, tape cream `#eadbc0`, oxblood `#d4432b`, lamp `#ffc46b` | Warm lamp on black; oxblood = REC |
| Type pair | League Gothic (display caps) + JetBrains Mono | Not Cormorant+Jost (Day 21) |
| Nav | NV09 fixed side rail (vertical labels, REC dot) | |
| Hero | HR28 reworked: film near full-screen (1440×~860), title over it, hook line wipes in | Plan type C: glide from the control room into the live room |
| Cards | Hairline-ruled tiles, no radius | |
| Signature | **The Needle Drop**: scroll swings the tonearm across the vinyl, the waveform and the track follow | Scroll-position pure |
| Loader | I29 split shutter (two halves slide apart on a centre seam, REC dot blinks) | ≤ 1.2 s |
| Traveling object | — (not an F day) | |

## Section plan and Motion map

Every motion is a pure function of scroll position (any speed, forward and back). Idle life: lamp flicker layer + slow film breath + waveform bars. `?static=1` = final state, motion off. No code used twice.

| # | Section | Layout | Motion code | How it plays | Record mode |
|---|---|---|---|---|---|
| 0 | Loader | I29 | I29 | Shutter seam opens on the first frame of V1 | 1.2 s |
| 1 | Nav | NV09 | M276 | Rail labels roll to a twin on hover/active; REC dot blinks | always on |
| 2 | Hero · glide | HR28 (full-height film) | M370 + hook M134 | Hook "Studios: this is your website." sweeps in left to right in the first 2 s (before/with title); the title STUDIOS SOUND / LIKE THIS. then splits apart to the sides as the film pushes on | 9.0 s |
| 3 | Rooms | GL09 | M257 | Three-panel accordion: hovered/active room opens wide, the others fold to vertical labels; the lamp swells | 4.0 s |
| 4 | Services + process | PD08 | M425 | Numbered rail; each step number and title mask in with scroll, price slides | 3.5 s |
| 5 | Gear | PS22 | M211 | Tile wall rises in a corner-to-corner wave; hovered tile floods lamp-yellow with name + year | 5.0 s |
| 6 | Sessions · record player | ours (from C) | **Needle Drop** (signature) + U02 | Vinyl spins (idle and with scroll); track rows slide the record from its sleeve (U02); scroll or hover swings the tonearm; waveform runs | 6.0 s |
| 7 | Booking | CC12 (from C) | M224 | Hold the mic button: a simulated voice note (ring grows with a counter, then the form confirms with a tick); it never requests the real microphone (no `getUserMedia`, no permission prompt); sample slots under it | 5.0 s |
| 8 | Footer | FO08 | M397 | Velocity marquee rows of the wordmark; lamp dims on the last screen | 3.5 s |

Transitions: X34 kinetic type wipe (hero → rooms), X96 not used. Only one seam change plus the film joins.

## Round 1 build notes (as built)

- **Hero chain** V1>V2>V3>V4>V5 (`site/clips.ts`, `lib/chain.ts` + `FrameScrub`): 192 + 192 + 192 + 168 + 134 frames = 878 units at 3.2 px per unit. Joins at K2 (unit 192), K3 (384), K4 (576), K5 (744); default crossfade 8 units (~0.3 s).
- **V4 ends at 6.96 s** (frame 167 is the first ghosting frame of the double-exposure dissolve; V4 is never played through it). **V5 starts at 2.38 s** (best match to V4's last frame; its first 2.38 s, the door opening, is dropped). That join fades over 12 units (~0.5 s crossfade; at the exact join both clips show at 50%, identical at slow, normal and fast scroll, forward and back).
- **V3** plays whole (its first 2.4 s is fast movement, not a cut).
- **Static** (`?static=1`): one still, K3 (V3 frame 4.5). **Record**: ~36 s whole page.
- **Rooms** (GL09): control room K1, live room K4, vocal booth K6.
- **Gear G1–G8**: G2 labelled "Vintage mic"; G8 cropped toward the centre; years and prices labelled "sample".
- **Booking mic is simulated**: hold = animated ring, counter and waveform only; a tap runs a 3 s demo take; no `getUserMedia`, no permission prompt.
- **Hook line**: "Studios: this is your website." (M134 typed wipe under the title).
- Engine fix found on this build: `FrameScrub` now restarts any layer's clip that was dropped while far away (jumping back from the end of the hero no longer leaves a blank canvas).

## Reel time table (total about 36.9 s)

Loader gone at about 1.3 s from page load (shutter seam opens at about 0.8 s) · Hero 9.4 + 1.35 hold (hook types in from 0.8 s, fully visible at about 1.3 s) · Wipe 1.2 · Rooms 1.6 + 2.0 hold (1 hover stop) · Services 1.6 + 0.8 · Gear 1.6 + 2.8 (3 hover stops) · Sessions 4.0 + 1.2 · Booking 1.4 + 3.4 · Footer 2.0 + 1.5. Measured from load: last scroll move 35.4 s, end of footer about 36.9 s. Hand-scrolled in practice; every part works at any speed.

## Clip table (video-first)

The glide through the studio, five Veo clips chained by keyframe stills (`FrameScrub` timeline + `lib/chain.ts`). The end keyframe of each clip is the start keyframe of the next. The film fills the hero stage (cover, centred subject). Dissolve joins use `join:` data in `site/clips.ts` (data only: `v1`..`v5` frame folders `/frames/tallow-tape-v1` … `-v5`, their join frames and scroll weights, ~2.2 / 1.4 / 2.2 / 1.4 / 1.4 screens; frames made with `npm run film-frames`).

| Clip | Start | End | Hover | Scroll rule |
|---|---|---|---|---|
| V1 Control room push-in | K1 | K2 | Pointer nudges the camera slightly (hoverNudge) | Pinned ~2.2 screens, eased, idle breath |
| V2 Through the door | K2 | K3 | same | ~1.4 screens, crossfade join |
| V3 Live room glide | K3 | K4 | same | ~2.2 screens |
| V4 Lamp to vocal booth | K4 | K5 | same | ~1.4 screens, crossfade join |
| V5 Into the booth, onto the mic | K5 | K6 | same | ~1.4 screens; ends the hero on the mic, hands over to Rooms |

Rule for all: picture = f(scroll), forward and back; alive when idle (breath + lamp flicker); `?static=1` shows K3 as one still.

## Hover map (record cursor, ≥ 3 `data-hover-demo`)

| Element | Hover | demo |
|---|---|---|
| Room panel (Rooms) | Opens wide, lamp swells, others fold | `data-hover-demo` on Live room |
| Gear tile (Gear) | Floods lamp-yellow, name + sample year print | `data-hover-demo` on 3 tiles |
| Track row (Sessions) | Record slides out of its sleeve, needle drops | `data-hover-demo` on row 2 |
| Mic button (Booking) | Ring grows (hold) | `data-hover-demo="click"` |
| Rail link, buttons | Label roll / fill | – |

## Product (gear) detail plan

Gear tile hover prints name + a made-up year labelled "sample" (e.g. "1959 · sample"), no brand names, generic words only (tube mic, ribbon mic, 2-inch tape machine, pre-amp, compressor, studio monitors, upright piano, drum kit). Prices are samples, always labelled "sample" (recording from ₹9,000 / day (sample), mixing from ₹6,000 / song (sample), mastering from ₹2,500 / song (sample), rehearsal ₹900 / hour (sample)). Footer: "Concept website by Triozen Tech".

## Asset batches (no prompts here; the director gives them)

Keyframes and photos are JPG; PNG only for transparent cut-outs. Rules for every asset: no people, no hands, no visible text, labels or logos on gear. One mood and colour grade: warm lamp on black. Subject kept central (the hero crops 16:9 to cover 1440×900).

**Batch 1: keyframe stills (generate first)**

| ID | What it is | Ratio | File | Save as | Attach | Code fallback |
|---|---|---|---|---|---|---|
| K1 | Control room, desk and monitors, camera at the back | 16:9 | JPG | `raw/k1.jpg` | none (master) | Dark gradient + lamp glow |
| K2 | Control room window and the door to the live room, closer | 16:9 | JPG | `raw/k2.jpg` | K1 | same |
| K3 | Doorway threshold, live room visible beyond | 16:9 | JPG | `raw/k3.jpg` | K1 | same |
| K4 | Live room, wide, instruments on stands, lamp glow | 16:9 | JPG | `raw/k4.jpg` | K1 | same |
| K5 | Vocal booth door, ajar, warm light inside | 16:9 | JPG | `raw/k5.jpg` | K1 | same |
| K6 | Inside the vocal booth: stool, tube mic on a stand with pop filter, warm lamp, velvet wall | 16:9 | JPG | `raw/k6.jpg` | K1 | same |

**Batch 2: video clips (after batch 1, all five together)**

| ID | What it is | Ratio | File | Save as | Attach | Code fallback |
|---|---|---|---|---|---|---|
| V1 | Push-in, control room | 16:9 | MP4 | `raw/v1.mp4` | K1 start + K2 end | Slow zoom on K1/K2 stills |
| V2 | Glide through the door | 16:9 | MP4 | `raw/v2.mp4` | K2 start + K3 end | Crossfade K2 → K3 |
| V3 | Glide across the live room | 16:9 | MP4 | `raw/v3.mp4` | K3 start + K4 end | Crossfade K3 → K4 |
| V4 | Lamp glow to the vocal booth | 16:9 | MP4 | `raw/v4.mp4` | K4 start + K5 end | Crossfade K4 → K5 |
| V5 | Through the booth door onto the mic | 16:9 | MP4 | `raw/v5.mp4` | K5 start + K6 end | Crossfade K5 → K6 |

**Batch 3: gear stills (Flow edits attach ONE image only: K4, the master)**

| ID | What it is | Ratio | File | Save as | Attach | Code fallback |
|---|---|---|---|---|---|---|
| G1–G8 | Tube mic · ribbon mic · 2-inch tape machine · pre-amp · compressor · studio monitors · upright piano · drum kit (one object each, dark seamless ground, no text or logos) | 1:1 | JPG (the user supplies PNG cut-outs only if wanted) | `public/images/tallow-tape/g1.jpg … g8.jpg` | K4 | Line-drawn gear icons in code |

Rooms panels reuse K1, K4, K6 (no extra assets). Record, tonearm and waveform are code. Cover shot comes from the hero in Round 5.

## Prompts (as run)

Empty. When the user pastes back the prompts that were run: asset ID · date · prompt (word for word) · attachments.
