// ============================================================
// SONG CATALOG
// Background music for hooks. Selected by emotion/mood match.
// drop_out_second = when the beat drops (fill manually after listening)
// ============================================================

export interface ISongDef {
  path: string;
  description: string;
  emotion: "happy" | "sad" | "neutral" | "nostalgic" | "excited";
  drop_out_second: 4 | 8 | 12;
}

export const SONGS: ISongDef[] = [
  {
    path: "song_1",
    description: "Coldplay adventure — uplifting reveal, bright energy",
    emotion: "happy",
    drop_out_second: 4,
  },
  {
    path: "song_2",
    description: "Kanye Runaway — melancholic piano reveal, heavy mood",
    emotion: "sad",
    drop_out_second: 4,
  },
  {
    path: "song_3",
    description: "Goldmund Sometimes — solo piano, reflective, slow sadness",
    emotion: "nostalgic",
    drop_out_second: 8,
  },
  {
    path: "song_4",
    description: "Jacal Resonance — acoustic guitar, somber, drifting",
    emotion: "sad",
    drop_out_second: 8,
  },
  {
    path: "song_5",
    description: "Daniel Caesar Innocence — smooth vocals, gentle reveal",
    emotion: "neutral",
    drop_out_second: 4,
  },
  {
    path: "song_6",
    description: "Frank Ocean Lovers — dreamy, longing, bittersweet",
    emotion: "nostalgic",
    drop_out_second: 8,
  },
  {
    path: "song_7",
    description: "Outtapocket original sound — hype energy, excitement reveal",
    emotion: "excited",
    drop_out_second: 4,
  },
  {
    path: "song_8",
    description: "Laisserai des Mots — TikTok piano instrumental, wistful, calm",
    emotion: "nostalgic",
    drop_out_second: 8,
  },
  {
    path: "song_9",
    description: "Charli XCX Everything Is Romantic — upbeat TT version, light energy",
    emotion: "happy",
    drop_out_second: 4,
  },
  {
    path: "song_10",
    description: "Guns N Roses November Rain — building reveal, dramatic neutral",
    emotion: "neutral",
    drop_out_second: 4,
  },
  {
    path: "song_11",
    description: "Looksmaxxing trending sound — fast hype, scroll-stop energy",
    emotion: "excited",
    drop_out_second: 4,
  },
];

// Emotion-to-song mapping for prompt injection
export const SONG_EMOTION_MAP: Record<string, string[]> = {
  happy: SONGS.filter(s => s.emotion === "happy").map(s => s.path),
  sad: SONGS.filter(s => s.emotion === "sad").map(s => s.path),
  neutral: SONGS.filter(s => s.emotion === "neutral").map(s => s.path),
  nostalgic: SONGS.filter(s => s.emotion === "nostalgic").map(s => s.path),
  excited: SONGS.filter(s => s.emotion === "excited").map(s => s.path),
};
