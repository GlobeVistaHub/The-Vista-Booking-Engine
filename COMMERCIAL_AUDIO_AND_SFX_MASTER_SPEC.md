# 🎚️ AKKARI COMMERCIAL AD — AUDIO MASTERING & SFX SPECIFICATION
**Version:** 3.0 (Master Mix with Complete Live SFX Suite)  
**Target Duration:** 41.60 Seconds (1,248 Frames @ 30 FPS)  
**Target True Peak:** -0.6 dBTP (`0.9350`)  
**EBU Standard:** R128 (-16 LUFS Integrated Broadcast Standard)  
**Sample Rate:** 48,000 Hz Stereo (24-bit internal DSP, 16-bit Master WAV, 320 kbps Master MP3)

---

## PART 1: MASTER STEM ARCHITECTURE & AMPLIFICATION LEVELS

| Stem | File Name | Timeline Placement | Base Gain | Processing / Dynamic Chain |
| :--- | :--- | :--- | :--- | :--- |
| **Voiceover** | `voice_37_treated_48khz.wav` | `00:00.00` – `00:37.93` | **`1.12×`** (+1.0 dB) | Mariya Vocal Chain: 80Hz HPF, De-Esser (6.8kHz), Syllable Leveler, Presence EQ |
| **Music Bed** | `music-42-seconds.wav` | `00:00.00` – `00:41.60` | **`0.88×`** (-1.1 dB base) | FFmpeg 16-bit conversion, Dynamic Ducking Envelope (`0.32` floor to `1.00` swell) |
| **Footsteps Foley** | `shot1_macro_hook_audio.wav` | `00:00.00` – `00:03.20` | **`0.90×`** | Pre-boost 2.2× on stem, smooth cosine fade-out from `2.6s` to `3.2s` |
| **SFX Suite (Summed)** | User SFX Stems | Frame-triggered | **`0.92×`** | Dynamic sidechain ducking under dialogue, True-Peak normalized to `-0.6 dBTP` |

---

## PART 2: THE 10 INTEGRATED SFX STEMS & TIMECODES

| # | SFX Name & Source File | Frame & Timecode | Visual Sync Event in Commercial | Dynamic Gain & Acoustic Treatment |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Hook Sub Impact**<br>`sfx_sub_boom.wav` | **Frame 0**<br>(00:00.00) | Opening Black Marble Glide + "$500K Leak" Alert Box | **Gain: 0.85×**<br>Low-pass at 180Hz, 1.2s sub-bass boom under footsteps. |
| **2** | **Work Site Rumble**<br>`construction-site-with-reverb.mp3` | **Frames 126–480**<br>(00:04.20 – 00:16.00) | Shot 2 (Site Manager) & Shot 3 (Craftsman) | **Gain: 0.20×**<br>Bandpass 150Hz–4kHz, 0.6s fade-in at 4.2s, 0.8s fade-out at 15.2s. Immersive acoustic atmosphere. |
| **3A** | **Glitch Wipe**<br>`digital-glitch-transition.mp3` | **Frame 126**<br>(00:04.20) | Cyan optical wipe into Site Manager | **Gain: 0.45×**<br>Rapid 0.6s glitch burst. |
| **3B** | **iPad Lag Error Glitch**<br>`digital-glitch-transition.mp3` | **Frame 236**<br>(00:07.87) | iPad 4.8s lag box error freeze & red punchline crash | **Gain: 0.60×**<br>High-passed at 400Hz, 1.2s duration. |
| **4** | **Green Laser Precision Sweep**<br>`Laser.mp3` | **Frame 345**<br>(00:11.50) | Shot 3 Craftsman + Green Laser Level lippage grid | **Gain: 0.48×**<br>High-pass at 600Hz. Crisp holographic optical sound. |
| **5A** | **Tile Press Down by Hands**<br>`sfx_sub_boom.wav` (Tactile Hit) | **Frame 384**<br>(00:12.80) | Craftsman hands press ceramic tile down into mortar | **Gain: 0.65×**<br>Low-pass 140Hz, 0.3s quick decay. Heavy tactile ceramic setting thud. |
| **5B** | **Final Tile Setting Press**<br>`sfx_sub_boom.wav` (Tactile Tap) | **Frame 432**<br>(00:14.40) | Craftsman very end leveling press down | **Gain: 0.45×**<br>Low-pass 140Hz, 0.25s decay. Final settlement click/thud. |
| **6** | **Sector Kinetic Whooshes**<br>`whoosh-bamboo.mp3` | **Frames 480, 520, 560, 600**<br>(16.0s, 17.3s, 18.6s, 20.0s) | The 4 Sectors (Hotels, Malls, Towers, HQ) shockwaves | **Gain: 0.55× – 0.60×**<br>Crisp 350ms bamboo whoosh transients on each sector entrance. |
| **7** | **CAD Intake Telemetry Riser**<br>`riser.mp3` | **Frame 640**<br>(00:21.33) | CAD Intake UI + "+240% Tender Conversion" counter | **Gain: 0.40×**<br>2.2s ascending telemetry riser with 0.4s smooth fade-out. |
| **8** | **Heavy Vault Lock Slam**<br>`heavy_vault_locking.mp3` | **Frame 864**<br>(00:28.80) | Commercial Pro Engine box slam & mobile packages | **Gain: 0.70×**<br>1.5s mechanical vault clack and lock punch. |
| **9** | **Camera Shutter Flash**<br>`camera-shutter.mp3` | **Frame 1002**<br>(00:33.40) | Melbourne Boardroom close + Direct Tender Line CTA | **Gain: 0.55×**<br>High-pass at 600Hz, 0.34s crisp mechanical shutter. |
| **10** | **GoodBrains Gold Chime**<br>`chime-sound.mp3` | **Frame 1140**<br>(00:38.00) | GoodBrains.Pro 3D Gold Medallion reveal & metallic sweep | **Gain: 0.75×**<br>1.63s golden orchestral shimmer, blends with music crescendo. |
