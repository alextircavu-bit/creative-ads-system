// ============================================================
// UGC VISUAL ARCHETYPES
// 12 filming formats with locked physical reality, audio,
// color grade, camera behavior, and authenticity markers.
// The archetype is selected by WHERE the person naturally IS
// when they'd have the thought — not by what "looks good."
// ============================================================

export interface IUGCVisualArchetype {
  id: string;
  name: string;
  descriptionTemplate: string;
  audioPrompt: string;
  colorGrade: string;
  cameraSummary: string;
  authenticityTagline: string;
  lockedDetails: string;
}

export const UGC_VISUAL_ARCHETYPES: IUGCVisualArchetype[] = [
  {
    id: "car-confession",
    name: "Car Confession",
    descriptionTemplate: `UGC-style car confession. A [person type] sitting in a parked car, phone propped on the dashboard slightly off-center. Daylight through the windshield flattens their face, background slightly blown out. Seatbelt still on. They look like they just parked and grabbed their phone before going inside. Speaking directly to camera, [emotional tone]: "[voiceline]".`,
    audioPrompt: "Boxy sealed-car audio, no echo, no wind. Voice is clear but slightly compressed by the small space. Faint car-settling sounds — engine ticking, AC hum if running. Slight muffled outside traffic.",
    colorGrade: "Warm daylight pushed through glass, slightly overexposed highlights on windshield side. Skin tones lean warm. Dashboard and interior lean dark. Naturalistic UGC color.",
    cameraSummary: "Dashboard-mounted iPhone, slightly off-center, static with minor vibration. Selfie-cam perspective from below eye level.",
    authenticityTagline: "Feels like someone grabbed their phone in a parking lot before going inside, not polished, not planned, raw dashboard-cam energy.",
    lockedDetails: "dashboard mount off-center, windshield daylight, blown background, seatbelt visible, constrained hand movements near steering wheel, sealed car acoustic",
  },
  {
    id: "bed-scroll",
    name: "Bed Scroll / Pillow Talk",
    descriptionTemplate: `UGC-style pillow talk. A [person type] lying in bed holding their phone above their face, arm slightly wobbling. Bedside lamp lights one side of their face, the other falls into shadow. Hair messy, pillow visible. Speaking to camera, [emotional tone]: "[voiceline]".`,
    audioPrompt: "Extremely close and muffled. Fabric absorbs all room reverb. You hear breath between words, pillow rustling when they shift. Voice is low volume, almost private. No ambient sound beyond the bed.",
    colorGrade: "Warm lamp tone on the lit side, cool blue-dark on the shadow side. Skin tones split warm/cool across the face. High ISO noise visible in the dark areas. Muted, no vibrancy. Naturalistic late-night phone screen color.",
    cameraSummary: "iPhone selfie cam held above face at arm's length, slight wobble from holding position, front-facing, static with arm fatigue drift.",
    authenticityTagline: "Feels like someone lying in bed who found something and had to say it right now, not polished, not planned, raw late-night scroll energy.",
    lockedDetails: "phone above face with wobble, lamp one-sided lighting, pillow in frame, messy hair, muffled zero-reverb audio, arm fatigue drift",
  },
  {
    id: "walking-talking",
    name: "Walking & Talking",
    descriptionTemplate: `UGC-style walking testimonial. A [person type] holding phone at arm's length, front camera, walking [location context]. Frame bounces rhythmically with each step. Background moves — [relevant background elements]. Outdoor lighting, uncontrolled, slightly harsh. Speaking to camera, [emotional tone], slightly out of breath: "[voiceline]".`,
    audioPrompt: "Wind interference across the phone mic, footsteps on pavement, passing cars or ambient street sound. Voice is slightly raised to compete with outdoor noise. Faint breathing between sentences. No clean isolation — environment is always present.",
    colorGrade: "Harsh outdoor daylight, uncontrolled. Shadows are hard-edged. Skin tones shift as they walk through sun and shade. Slightly blown highlights when sun hits directly. Naturalistic UGC color, phone auto-exposure adjusting in real time.",
    cameraSummary: "iPhone front cam at arm's length, rhythmic bounce synced to walking pace, slight diagonal drift, auto-exposure breathing as lighting changes.",
    authenticityTagline: "Feels like someone walking somewhere who couldn't wait to sit down to say this, not polished, not stable, raw walking-and-talking energy.",
    lockedDetails: "arm's length front cam, rhythmic step-bounce, shifting outdoor background, uncontrolled harsh light, wind/footstep audio bleed, slightly breathless delivery, auto-exposure shifting",
  },
  {
    id: "screen-record-facecam",
    name: "Screen Record + Face Cam",
    descriptionTemplate: `UGC-style screen recording with face cam. Main frame shows [screen content being demonstrated]. Small circular PiP in [corner] shows their face — slightly compressed, darker than the screen recording. Their eyes are on the screen content, not the camera. [Reaction type], [emotional tone]. Voice over the screen: "[voiceline]".`,
    audioPrompt: "Slight audio delay between the person's voice and the screen content audio. Voice sounds like it's recorded through the phone's internal mic during screen capture — slightly thinner than normal. If screen has its own audio, it competes with the voice at slightly lower volume.",
    colorGrade: "Screen content is bright and saturated (whatever the app looks like). PiP face cam is noticeably darker, lower contrast, slightly desaturated compared to the screen. The mismatch between screen brightness and face cam is the signature.",
    cameraSummary: "Phone screen recording with PiP selfie cam in corner, static frame, face cam is lower resolution and darker than screen content.",
    authenticityTagline: "Feels like someone screen-recording to show a friend what they found, face cam is an afterthought not a production choice, raw screen-capture energy.",
    lockedDetails: "PiP in corner, face cam lower quality and darker than screen, eyes on screen not camera, slight audio delay, screen content is the primary frame",
  },
  {
    id: "storytime-closeup",
    name: "Storytime Closeup",
    descriptionTemplate: `UGC-style storytime closeup. A [person type] framed tight from forehead to chin, FaceTime distance, about 14 inches from camera. [Simple background, blurred]. Lighting from [natural source in front of them]. You can hear the detail in their voice — breath, vocal texture. Speaking to camera, [emotional tone]: "[voiceline]".`,
    audioPrompt: "Very close mic — you hear saliva clicks, breath intake, vocal fry, every texture of the voice. No room reverb because the phone is inches from the mouth. The audio intimacy matches the visual closeness. If they pause, you hear the silence of the room.",
    colorGrade: "Whatever light source is in front of them dominates. Skin detail is very visible at this distance. Naturalistic UGC color to the source.",
    cameraSummary: "iPhone front cam at FaceTime distance, approximately 14 inches, static or near-static, tight forehead-to-chin framing, minimal movement.",
    authenticityTagline: "Feels like someone leaned in close to tell you something specific, too close for comfort by cinematic standards which is exactly why it feels real, raw FaceTime-distance energy.",
    lockedDetails: "forehead-to-chin framing, 14-inch distance, blurred background, close mic breath detail, no hands in frame, all expression facial, skin texture visible",
  },
  {
    id: "zoom-emphasis",
    name: "Zoom-In Emphasis",
    descriptionTemplate: `UGC-style zoom emphasis clip. A [person type] framed in standard selfie distance, [environment]. Speaking to camera, [emotional tone]: "[setup line]" — then at the key moment, a sudden jerky digital zoom punches into their face as they say: "[punchline/key claim]". The zoom is slightly off-center, image quality softens and gets noisier on the zoom.`,
    audioPrompt: "Audio stays consistent through the zoom — the zoom is visual only. Voice doesn't change proximity or quality. This mismatch between visual punch-in and unchanged audio is part of the signature.",
    colorGrade: "Pre-zoom is normal phone color. Post-zoom, colors flatten slightly and noise increases because it's a digital crop, not optical. The quality degradation IS the color grade.",
    cameraSummary: "iPhone selfie cam, starts at standard distance, sudden jerky digital zoom (not smooth cinematic zoom), zoom settles slightly off-center.",
    authenticityTagline: "Feels like someone zoomed in on their own face to make a point, the way people actually do on TikTok, not polished, the jerkiness is the emphasis, raw punch-in energy.",
    lockedDetails: "normal frame then sudden digital zoom, zoom is jerky not smooth, quality degrades on zoom (softer/noisier), zoom slightly off-center, zoom hits on or just before key word, audio unchanged through zoom",
  },
  {
    id: "pov-first-person",
    name: "POV / First Person",
    descriptionTemplate: `UGC-style POV first-person footage. No face visible. Camera IS the viewer's eyes. Looking down at [what they're interacting with]. Their hands enter frame from the bottom — [hand detail]. They [interaction]. Camera height matches [sitting/standing] eye level. Movement matches natural head turns. Optional voice from behind camera, [emotional tone]: "[voiceline]".`,
    audioPrompt: "Voice projects forward into the space, not down at a phone — slightly more distant and room-present than selfie audio. Environment sounds are primary. If handling objects, you hear the tactile sounds. Ambient is always present.",
    colorGrade: "iPhone rear camera quality — sharper and more detailed than front cam. Colors are more accurate to the actual environment. Natural white balance of the space. No correction, phone auto-color.",
    cameraSummary: "iPhone rear camera at eye level, head-turn movement speed (smooth, not whip), hands enter from bottom of frame, slightly more stable than selfie footage, autofocus may hunt briefly when looking at new objects.",
    authenticityTagline: "Feels like someone showing you what they're looking at right now, you're seeing through their eyes, not polished, not narrated for an audience, raw first-person energy.",
    lockedDetails: "no face visible, hands from bottom of frame, eye-level height, head-turn speed, voice from behind camera, rear cam quality (sharper), autofocus hunting on new objects, tactile sound detail",
  },
  {
    id: "caught-off-guard",
    name: "Caught Off Guard",
    descriptionTemplate: `UGC-style caught off guard moment. Clip starts filming [something mundane]. Then a quick pan or camera flip — one or two frames of motion blur — as they redirect. "[Pivot phrase]" — camera lands on [the actual subject], [emotional tone after pivot]: "[voiceline]". The mundane opening is what makes the pivot feel real.`,
    audioPrompt: "Before pivot: passive ambient audio of whatever they were filming — no voice or casual background conversation. At pivot: sudden vocal interjection. After pivot: voice becomes present, engaged, directed at camera. Background ambient continues underneath.",
    colorGrade: "Before pivot: casual auto-exposure for the mundane subject. During pivot: smeared light and color. After pivot: auto-exposure adjusts to new subject, may take a beat to settle — briefly over or underexposed before correcting.",
    cameraSummary: "iPhone handheld, starts stable on mundane subject, fast whip pan or camera flip with motion blur frames, settles on new subject with brief stabilization wobble, auto-exposure readjusting.",
    authenticityTagline: "Feels like someone was filming something random and then realized they had to show you something else, the motion blur pivot is the moment of realness, not planned, raw redirect energy.",
    lockedDetails: "starts on unrelated mundane subject, pivot has motion blur frames, vocal shift at pivot, energy contrast before/after, auto-exposure readjustment after pivot, stabilization wobble on landing",
  },
  {
    id: "fake-facetime",
    name: "Fake FaceTime",
    descriptionTemplate: `UGC-style fake FaceTime call. A [person type] framed exactly like a FaceTime video call — face centered, camera slightly below chin looking up at them. Phone is on a table or held at chest height. They're talking TO the viewer like a specific friend, [emotional tone]: "[voiceline]". The below-chin angle is unflattering and that's why it reads as real.`,
    audioPrompt: "Natural room audio with slight reverb — the phone is at table/chest distance, not face distance. Background room sounds are present — TV, other people, kitchen sounds. Not isolated, because a real FaceTime call wouldn't be.",
    colorGrade: "Flat front-cam processing. Below-chin angle means overhead light creates slight shadow under nose and chin. Skin tones are accurate but unflattering. Naturalistic UGC color, standard iPhone FaceTime rendering.",
    cameraSummary: "iPhone front cam at chest/table height, below-chin upward angle, static (phone is propped or set down), face centered in frame, FaceTime framing.",
    authenticityTagline: "Feels like someone propped their phone on a table and called you to tell you one specific thing, the unflattering angle is what makes it feel like an actual call, not polished, raw FaceTime energy.",
    lockedDetails: "below-chin upward angle, centered face, phone at table/chest height, unflattering FaceTime perspective, second-person direct address, room reverb from phone distance, background room sounds present",
  },
  {
    id: "whispering-secret",
    name: "Whispering / Secret",
    descriptionTemplate: `UGC-style whisper secret. A [person type] very close to camera in a dark room, face partially in frame, slightly off-center. Only light source is [phone screen / nightlight / cracked door]. They're whispering, [emotional tone]: "[voiceline]". Audio is extremely close — you hear breath, fabric, the wet sounds of quiet speech. The darkness implies they shouldn't be recording right now.`,
    audioPrompt: "Whisper-level volume. Extremely close mic — breath is as loud as words. You hear fabric rustling, lip sounds. No room tone whatsoever because the voice overwhelms the mic at this distance. If they pause, near-silence.",
    colorGrade: "High ISO noise throughout. Single dim light source creates extreme contrast — lit portions visible, everything else near-black with heavy grain. Near-monochromatic — whatever color the light source is dominates everything.",
    cameraSummary: "iPhone front cam very close to face, face partially in frame and off-center, static or micro-movements from breathing, dark and noisy, autofocus may struggle in low light.",
    authenticityTagline: "Feels like someone hiding under the covers or whispering after everyone else fell asleep, too close and too dark to be intentional content, not polished, raw whisper-in-the-dark energy.",
    lockedDetails: "very close, face partially framed and off-center, dark room, single dim light, whisper volume, breath-level audio, no room tone, high ISO noise, near-monochromatic color from single light source",
  },
  {
    id: "lofi-text-broll",
    name: "Lo-Fi Text on B-Roll",
    descriptionTemplate: `UGC-style lo-fi text over b-roll. No face. Aesthetic phone-shot footage of [visually soothing subject]. Slightly more considered framing than other UGC. Text overlays in simple white tell the story: [text sequence]. No voice. The footage is emotional atmosphere; the text is the content. Ambient audio only — [environment sound].`,
    audioPrompt: "No voice at all. Pure ambient sound of the footage — rain, coffee shop murmur, traffic hum, nature sounds, whatever the b-roll shows. Ambient audio slightly louder and more present than expected because nothing competes with it. Optional trending sound or soft music bed underneath.",
    colorGrade: "Slightly more aesthetic than other archetypes. Colors can lean slightly warmer, slightly desaturated, or with a subtle tone. This is the one archetype where a hint of intentional color is authentic because the format itself is more curated. Still phone-shot, still naturalistic, but allowed to be pretty.",
    cameraSummary: "iPhone rear camera, more considered and stable framing, may use slow subtle movement (slow pan, gentle drift), or completely static on a visually pleasing composition.",
    authenticityTagline: "Feels like someone's aesthetic phone footage paired with their inner monologue as text, the prettiest UGC format but still phone-shot, not polished production, raw visual-diary energy.",
    lockedDetails: "no face, no voice, text overlays are content delivery, aesthetic but phone-shot b-roll, ambient-only audio (louder than expected), more considered framing, white text default, slightly more curated color allowed",
  },
  {
    id: "over-shoulder-demo",
    name: "Over-the-Shoulder Demo",
    descriptionTemplate: `UGC-style over-the-shoulder demo. Camera behind and slightly above a [person type], looking over their shoulder at their phone screen. Back of head and one shoulder in frame. The screen content is the focus — they're [interaction]. Their fingers interact with the screen in real time. Voice from slightly ahead of camera, [emotional tone]: "[voiceline]".`,
    audioPrompt: "Voice comes from ahead of the camera — hearing the person from behind. Room acoustics are present. Tactile screen sounds — tapping, scrolling — are audible because the camera is close to the phone. If a second person is filming, you might hear their breathing behind the camera.",
    colorGrade: "Phone screen in frame is the brightest element. Person and room are slightly darker by comparison. Auto-exposure may favor the screen, making the person slightly underexposed. Screen content has its own color palette that contrasts with the room.",
    cameraSummary: "iPhone held by second person or propped behind, behind-and-above angle, slightly unstable handheld framing, focus favors the phone screen, may drift or adjust as the person moves.",
    authenticityTagline: "Feels like a friend filming over someone's shoulder to show proof of something working, the over-shoulder angle means you're seeing the real thing not a curated screenshot, not polished, raw proof-of-use energy.",
    lockedDetails: "behind-and-above angle, back of head and shoulder visible, screen is focal point, fingers on screen, voice from ahead of camera, second-person filming perspective, screen is brightest element, slightly unstable framing, room acoustics present",
  },
];
