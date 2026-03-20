// ============================================================
// UGC SPEAKING HOOK FORMATS
// 15 proven structures for speaking-to-camera hooks.
// Each format is a scaffold — the content changes per product.
// ============================================================

export interface IHookFormat {
  id: string;
  name: string;
  structure: string;
  example: string;
  mechanism: string;
  energy: "vulnerability" | "curiosity" | "tribal" | "urgency" | "interrupt";
}

export const HOOK_FORMATS: IHookFormat[] = [
  {
    id: "confession",
    name: "Confession",
    structure: "Admit something embarrassing → reveal the product saved you",
    example: "okay I'm gonna be honest I used to spend like $200 on [category] and nothing worked until my friend sent me this",
    mechanism: "Vulnerability creates trust. Confession bypasses the 'this is an ad' filter.",
    energy: "vulnerability",
  },
  {
    id: "wait-what",
    name: "Wait What / Pattern Interrupt",
    structure: "Say something that sounds wrong → pause → explain → product reveal",
    example: "I stopped reading my Bible. [pause] well not exactly. I stopped TRYING to read my Bible. because now it just shows up on my—",
    mechanism: "Cognitive dissonance. Brain can't scroll past an unresolved contradiction.",
    energy: "interrupt",
  },
  {
    id: "storytime",
    name: "Storytime",
    structure: "'okay so...' + specific situation → mini-crisis → product as resolution",
    example: "okay so I'm literally lying in bed and I grab my phone to do the usual thing and there's just... a Bible verse. just sitting there on my lockscreen",
    mechanism: "'Okay so' is parasocial — mimics how friends tell stories. Specific detail activates episodic memory.",
    energy: "vulnerability",
  },
  {
    id: "pov-you",
    name: "POV / Direct Address",
    structure: "Describe what the viewer is doing RIGHT NOW → agitate → offer the shift",
    example: "you're scrolling right now and you know you should be doing something else. what if the next time you picked up your phone there was a verse waiting",
    mechanism: "Direct address + accurate description of current behavior creates 'are they talking to ME?' feeling.",
    energy: "interrupt",
  },
  {
    id: "urgency-share",
    name: "I Need To Talk About This",
    structure: "Express urgency about needing to share → social proof → product",
    example: "ok I literally need to show you this before I forget because I found this thing and I don't know why nobody's talking about it",
    mechanism: "Manufactured urgency + implied scarcity. Feels like a friend texting 'BUY THIS NOW.'",
    energy: "urgency",
  },
  {
    id: "unpopular-opinion",
    name: "Unpopular Opinion / Contrarian",
    structure: "Challenge conventional wisdom → back it up → product supports the new frame",
    example: "unpopular opinion but if you need to TRY to read your Bible every day you're doing it wrong. hear me out—",
    mechanism: "Tribal signaling. 'Unpopular opinion' implies bravery. Creates in-group vs out-group.",
    energy: "tribal",
  },
  {
    id: "reframe-math",
    name: "Reframe / Girl Math",
    structure: "Reframe the cost or effort using relatable logic → make NOT doing it feel irrational",
    example: "so you're telling me I check my phone 80 times a day and you're saying I can see a Bible verse every single time and it's FREE?",
    mechanism: "Uses existing cultural format as trojan horse for value proposition.",
    energy: "curiosity",
  },
  {
    id: "de-influence",
    name: "De-influencing... But Actually",
    structure: "Trash the category first → pivot to what actually works → your product",
    example: "stop downloading Bible apps. I'm serious. I had like five and didn't open any of them. but this one is different because you don't even have to open it",
    mechanism: "De-influencing builds trust. Trashing the category earns credibility to recommend one thing.",
    energy: "tribal",
  },
  {
    id: "list-standout",
    name: "Things That Changed My Life / List",
    structure: "Rapid-fire list → build momentum → feature THE product as the standout",
    example: "things that actually helped my faith this year — number one, that podcast. number two, my journal. number three — ok three I actually need to talk about because this one's different",
    mechanism: "List format has built-in scroll-stop. Buries the ad inside a lifestyle roundup.",
    energy: "curiosity",
  },
  {
    id: "before-you-scroll",
    name: "Before You Scroll",
    structure: "Acknowledge they're about to scroll → make a specific promise → compress the ask",
    example: "wait before you scroll give me literally 5 seconds. if you've ever felt guilty about not reading your Bible this will fix that. 5 seconds.",
    mechanism: "Meta-awareness of scroll behavior. Naming what they're about to do interrupts the thumb.",
    energy: "interrupt",
  },
  {
    id: "discovery",
    name: "I Was Today Years Old / Discovery",
    structure: "Express shock at a recent discovery → explain what you didn't know → product",
    example: "I was today years old when I found out you can literally get Bible verses on your lockscreen without opening anything. like it just APPEARS",
    mechanism: "Discovery format implies the viewer is also about to learn something new.",
    energy: "curiosity",
  },
  {
    id: "obsession",
    name: "Obsession",
    structure: "Declare obsessive frequency → specificity makes it real → show why",
    example: "I think about this app an unhealthy amount. like I'll be at work and check my phone just to see what verse is on my lockscreen. that's weird right?",
    mechanism: "Hyperbolic obsession reads as genuine because it's socially risky to admit.",
    energy: "tribal",
  },
  {
    id: "command",
    name: "Run Don't Walk / Command",
    structure: "Urgent imperative → insider knowledge → rapid pitch → repeat urgency",
    example: "run don't walk to download this. my pastor told me about it and I literally thought he was joking. it's free and it's actually insane",
    mechanism: "Direct command bypasses deliberation. Insider knowledge adds authority.",
    energy: "urgency",
  },
  {
    id: "hot-take",
    name: "Hot Take / Opinion-First",
    structure: "Lead with strong opinion → let them react → justify with product",
    example: "this is the best thing I've ever put on my phone and I will die on this hill. my friends think I'm dramatic. I don't care. let me show you why",
    mechanism: "Emotional intensity is the hook. Escalating social disapproval proves commitment.",
    energy: "tribal",
  },
  {
    id: "rant",
    name: "Rant / Frustrated Discovery",
    structure: "Start angry about the problem → channel energy toward the solution",
    example: "I'm so tired of feeling guilty about not reading my Bible when it's literally this easy and nobody told me. like WHY did nobody tell me about this",
    mechanism: "Righteous anger is the most shareable emotion. Positions creator as advocate.",
    energy: "urgency",
  },
];
