/* Unit 6 Experience — content for the self-study lesson and teacher mode.
   All texts, dialogues and test items are original, written for อ23102 ม.3. */
window.UNIT = {
  id: "unit6",
  no: 6,
  title: "Experience",
  th: "ประสบการณ์",
  wdyt: "Why might it be a good idea to try new things?",
  points: { vocab: 2, listening: 2, reading: 1, grammar: 2, speaking: 1.5, writing: 1.5 },   // = 10
  objectives: [
    "บอกคำศัพท์ประสบการณ์และดนตรีได้ ออกเสียงถูก และใช้ในประโยคได้",
    "ฟังบทสนทนาแล้วแยกได้ว่าคำถามกับสิ่งที่ได้ยินต่างกันอย่างไร",
    "อ่านโปรไฟล์แล้วตอบคำถามด้วยคำพูดของตนเอง",
    "ใช้ Present perfect บอกเล่า ปฏิเสธ คำถาม และ ever / never ได้ถูกต้อง",
    "พูดถาม–ตอบเรื่องประสบการณ์ได้อย่างมั่นใจ",
    "เขียนโปสการ์ดออนไลน์โดยใช้ who / where / which"
  ],

  /* ---------------- VOCABULARY ---------------- */
  vocabSets: [
    { k: "exp", name: "Experiences", th: "ประสบการณ์" },
    { k: "music", name: "Music", th: "ดนตรี" },
    { k: "read", name: "Words from the reading", th: "ศัพท์จากบทอ่าน" }
  ],
  vocab: [
    { set: "exp", w: "act in a play", pic: "🎭", th: "แสดงละคร", ex: "I've acted in a play at school." },
    { set: "exp", w: "bake a cake", pic: "🎂", th: "อบเค้ก", ex: "My sister has baked a cake for Mom." },
    { set: "exp", w: "build a sandcastle", pic: "🏖️", th: "ก่อปราสาททราย", ex: "The kids have built a big sandcastle." },
    { set: "exp", w: "do a bungee jump", pic: "🪂", th: "กระโดดบันจี้จัมป์", ex: "My uncle has done a bungee jump." },
    { set: "exp", w: "fly a kite", pic: "🪁", th: "เล่นว่าว", ex: "We often fly a kite in March." },
    { set: "exp", w: "go zip lining", pic: "🧗", th: "เล่นซิปไลน์", ex: "Have you ever gone zip lining?" },
    { set: "exp", w: "keep a diary", pic: "📔", th: "เขียนบันทึกประจำวัน", ex: "She keeps a diary every night." },
    { set: "exp", w: "make a snowman", pic: "⛄", th: "ปั้นตุ๊กตาหิมะ", ex: "Have you ever made a snowman?" },
    { set: "exp", w: "meet a famous person", pic: "🤩", th: "พบคนดัง", ex: "Have you ever met a famous person?" },
    { set: "exp", w: "play laser tag", pic: "🔦", th: "เล่นเลเซอร์แท็ก (เกมยิงแสง)", ex: "We played laser tag at my birthday party." },
    { set: "exp", w: "record music", pic: "⏺️🎵", th: "อัดเพลง", ex: "Our band has recorded music in a studio." },
    { set: "exp", w: "ride a horse", pic: "🐎", th: "ขี่ม้า", ex: "I rode a horse on the beach last year." },
    { set: "exp", w: "see a musical", pic: "🎶", th: "ดูละครเพลง", ex: "We saw a musical in Bangkok." },
    { set: "exp", w: "sing karaoke", pic: "🎤", th: "ร้องคาราโอเกะ", ex: "My dad loves singing karaoke." },
    { set: "exp", w: "sleep under the stars", pic: "🏕️", th: "นอนกลางแจ้งใต้แสงดาว", ex: "We slept under the stars at camp." },
    { set: "exp", w: "start a company", pic: "🏢", th: "ก่อตั้งบริษัท", ex: "He started a company when he was sixteen." },
    { set: "exp", w: "swim with dolphins", pic: "🐬", th: "ว่ายน้ำกับโลมา", ex: "She has swum with dolphins in Krabi." },
    { set: "exp", w: "take a dance class", pic: "💃", th: "เรียนเต้น", ex: "I've taken a dance class twice." },
    { set: "exp", w: "travel to another continent", pic: "🌍", th: "เดินทางไปอีกทวีป", ex: "I've never traveled to another continent." },
    { set: "exp", w: "write a news story", pic: "📰", th: "เขียนข่าว", ex: "I've written a news story for the school website." },
    { set: "music", w: "classical music", pic: "🎼", th: "ดนตรีคลาสสิก", ex: "I listen to classical music when I study." },
    { set: "music", w: "pop", pic: "💿", th: "ดนตรีป๊อป", ex: "K-pop is a type of pop music." },
    { set: "music", w: "hip hop", pic: "🧢", th: "ดนตรีฮิปฮอป", ex: "He dances to hip hop every evening." },
    { set: "music", w: "jazz", pic: "🎷", th: "ดนตรีแจ๊ส", ex: "My grandpa loves jazz." },
    { set: "music", w: "rap", pic: "🗣️", th: "แร็พ", ex: "In rap, people say the words very fast." },
    { set: "music", w: "musician", pic: "🧑‍🎤", th: "นักดนตรี", ex: "My cousin is a musician." },
    { set: "music", w: "singer", pic: "🎙️", th: "นักร้อง", ex: "The singer has a beautiful voice." },
    { set: "music", w: "DJ", pic: "🎧", th: "ดีเจ (เปิดเพลงในงาน)", ex: "The DJ played music at the party." },
    { set: "music", w: "composer", pic: "✍️🎵", th: "นักแต่งเพลง", ex: "A composer writes music." },
    { set: "music", w: "guitarist", pic: "🎸", th: "นักกีตาร์", ex: "The guitarist in our band is fourteen." },
    { set: "music", w: "piano", pic: "🎹", th: "เปียโน", ex: "Can you play the piano?" },
    { set: "music", w: "violin", pic: "🎻", th: "ไวโอลิน", ex: "She plays the violin in the school band." },
    { set: "music", w: "choir", pic: "👨‍👩‍👧‍👦", th: "คณะนักร้องประสานเสียง", ex: "Forty students sing in the school choir." },
    { set: "music", w: "orchestra", pic: "🎺🎻🥁", th: "วงออร์เคสตรา", ex: "The orchestra played at the concert hall." },
    { set: "read", w: "research", pic: "🔍", th: "การค้นคว้า", ex: "He does a lot of research before he writes." },
    { set: "read", w: "hits", pic: "📈", th: "จำนวนครั้งที่มีคนเข้าชมเว็บ", ex: "The website gets thousands of hits every day." },
    { set: "read", w: "focus on", pic: "🎯", th: "มุ่งเน้น ให้ความสำคัญกับ", ex: "This website focuses on teen experiences." },
    { set: "read", w: "go global", pic: "🌐", th: "ขยายไปทั่วโลก", ex: "He wants his website to go global." },
    { set: "read", w: "event", pic: "🎪", th: "งาน กิจกรรมสำคัญ", ex: "The concert was a big event in our town." },
    { set: "read", w: "extreme sports", pic: "🏂", th: "กีฬาผาดโผน", ex: "Skydiving is one of the most exciting extreme sports." }
  ],
  context: [   // 2-option sentence practice
    { s: "We ___ a kite at the beach yesterday.", o: ["flew", "rode"], a: 0 },
    { s: "My brother has ___ a horse in Hua Hin.", o: ["ridden", "flown"], a: 0 },
    { s: "Have you ever ___ a bungee jump?", o: ["done", "made"], a: 0 },
    { s: "She ___ a diary every night.", o: ["keeps", "plays"], a: 0 },
    { s: "Mom has ___ a chocolate cake for my birthday.", o: ["baked", "built"], a: 0 },
    { s: "A ___ writes music for films.", o: ["composer", "guitarist"], a: 0 },
    { s: "The ___ played songs at the school party.", o: ["DJ", "choir"], a: 0 },
    { s: "I've never ___ to another continent.", o: ["traveled", "acted"], a: 0 },
    { s: "The website gets 5,000 ___ every day.", o: ["hits", "events"], a: 0 },
    { s: "Skateboarding and skydiving are ___.", o: ["extreme sports", "classical music"], a: 0 }
  ],
  vocabQuiz: [
    { pic: "🐬", q: "Look at the picture. What is it?", o: ["swim with dolphins", "ride a horse", "fly a kite", "build a sandcastle"], a: 0, why: "ภาพโลมา = swim with dolphins (ว่ายน้ำกับโลมา)" },
    { q: "คำใดแปลว่า “นักแต่งเพลง”", o: ["musician", "composer", "guitarist", "choir"], a: 1, why: "composer = คนที่แต่งเพลง ส่วน musician คือนักดนตรีทั่วไป" },
    { q: "Have you ever ___ a play at school?", o: ["acted in", "acted on", "made", "flown"], a: 0, why: "collocation ที่ถูกคือ act in a play" },
    { q: "Which word does NOT go with “a cake”?", o: ["bake", "make", "eat", "ride"], a: 3, why: "ride ใช้กับ horse / bike ไม่ใช้กับ cake" },
    { pic: "🎻", q: "A large group of musicians playing classical music is ___.", o: ["a band", "an orchestra", "a choir", "a crew"], a: 1, why: "orchestra = วงดนตรีขนาดใหญ่ เล่นดนตรีคลาสสิก" },
    { q: "We slept ___ the stars on our camping trip.", o: ["under", "on", "in", "at"], a: 0, why: "sleep under the stars = นอนกลางแจ้งใต้แสงดาว" },
    { q: "He wants his small website to ___ — people all over the world will use it.", o: ["go global", "focus on", "keep a diary", "do research"], a: 0, why: "go global = ขยายไปทั่วโลก" },
    { audio: "Have you ever gone zip lining?", q: "ฟังแล้วเลือกกิจกรรมที่ได้ยิน", o: ["go zip lining", "sing karaoke", "make a snowman", "see a musical"], a: 0, why: "ประโยคที่ได้ยินคือ Have you ever gone zip lining?" }
  ],

  /* ---------------- LISTENING ---------------- */
  listening: {
    tip: "คำถามในข้อสอบมักใช้คำไม่ตรงกับที่ได้ยิน ฟังหา <b>ความหมาย</b> ไม่ใช่หาคำที่ซ้ำกัน และระวังคำว่า <b>never, but, not yet</b> ที่เปลี่ยนคำตอบ",
    practice: {
      title: "Finding a present",
      lines: [
        ["Mia", "I need a present for my brother Leo. He's fourteen next week."],
        ["Ben", "What does he like? Has he ever played the guitar?"],
        ["Mia", "No, he hasn't. But he has always wanted to learn."],
        ["Ben", "How about guitar lessons? The music shop near the station has classes."],
        ["Mia", "Hmm, lessons are expensive. He loves books. Maybe a book?"],
        ["Ben", "He has lots of books already. What about a ticket to a musical?"],
        ["Mia", "Oh! He's never seen a musical. That's perfect. Let's check the price online."]
      ],
      qs: [
        { q: "Does Leo know how to play the guitar?", o: ["Yes, he plays well.", "No, but he wants to learn."], a: 1, why: "Mia พูดว่า No, he hasn't. But he has always wanted to learn. — คำถามใช้ know how to play แต่ในบทใช้ Has he ever played" },
        { q: "Why doesn't Mia choose guitar lessons?", o: ["They cost a lot of money.", "The shop is too far."], a: 0, why: "lessons are expensive = cost a lot of money (คำต่างกันแต่ความหมายเดียวกัน)" },
        { q: "Why isn't a book a good idea?", o: ["Leo doesn't like reading.", "Leo already has many books."], a: 1, why: "He has lots of books already = มีหนังสือเยอะแล้ว" },
        { q: "What present do they choose?", o: ["a musical ticket", "a guitar"], a: 0, why: "What about a ticket to a musical? … That's perfect." }
      ]
    },
    quiz: {
      title: "School radio: Pim's camp",
      lines: [
        ["Host", "Welcome back to School Radio. Today Pim is here. Pim, you went to a camp last weekend, right?"],
        ["Pim", "Yes, I did. It was a nature camp in Kanchanaburi. It was my first time at a camp."],
        ["Host", "Have you ever slept in a tent before?"],
        ["Pim", "No, never. On Friday we slept under the stars. It was cold, but beautiful."],
        ["Host", "What else did you do?"],
        ["Pim", "We went zip lining over the river. I was scared at first, but I loved it."],
        ["Host", "Did you ride a horse? I heard the camp has horses."],
        ["Pim", "No, I didn't. It rained all day on Saturday, so we stayed inside and made music."],
        ["Host", "Music? Tell us more."],
        ["Pim", "I met a girl who plays the drums. We recorded a song together on her phone."],
        ["Host", "Would you go again?"],
        ["Pim", "Definitely. Next year I want to try rock climbing."]
      ],
      qs: [
        { q: "Where was the camp?", o: ["in Kanchanaburi", "in Krabi", "near the school", "in Chiang Mai"], a: 0, why: "Pim: It was a nature camp in Kanchanaburi." },
        { q: "Had Pim been to a camp before?", o: ["Yes, many times.", "Yes, once.", "No, it was her first time.", "The speaker doesn't say."], a: 2, why: "It was my first time at a camp." },
        { q: "How did Pim feel about zip lining at the start?", o: ["bored", "afraid", "tired", "angry"], a: 1, why: "I was scared at first = afraid (คำต่างกัน ความหมายเดียวกัน)" },
        { q: "Why didn't Pim ride a horse?", o: ["She was afraid of horses.", "The weather was bad.", "There were no horses.", "It was too expensive."], a: 1, why: "It rained all day on Saturday — ฝนตก = อากาศไม่ดี" },
        { q: "What did they do on Saturday?", o: ["They went zip lining.", "They slept in a tent.", "They made music inside.", "They went home."], a: 2, why: "we stayed inside and made music" },
        { q: "The girl Pim met …", o: ["plays the guitar.", "plays the drums.", "sings in a choir.", "is a famous singer."], a: 1, why: "I met a girl who plays the drums." },
        { q: "How did they record the song?", o: ["in a studio", "on a phone", "on the radio", "with a band"], a: 1, why: "We recorded a song together on her phone." },
        { q: "What does Pim want to do next year?", o: ["go zip lining again", "ride a horse", "try rock climbing", "sleep under the stars"], a: 2, why: "Next year I want to try rock climbing." }
      ]
    }
  },

  /* ---------------- READING ---------------- */
  reading: {
    tip: "ตอบคำถามด้วย <b>คำพูดของตัวเอง</b>: 1) หาประโยคที่มีคำตอบ 2) ขีดเส้นใต้ใจความ 3) เขียนใหม่ให้สั้น ไม่คัดลอกทั้งประโยค",
    title: "Meet Fon, the girl who tries everything",
    text: [
      "Fon Siriwan is fourteen years old and she lives in Nonthaburi. Two years ago, she started a website called TryItTeens. On the website, teenagers share videos of new things they have tried for the first time.",
      "“I was always shy,” Fon says. “Then I made a list of things I had never done. I wanted to do one new thing every month.” Since then, she has learned to cook Korean food from online videos, she has taken a dance class, and she has sung karaoke in front of her whole school.",
      "Not everything has been easy. “The first time I baked a cake, it was a disaster!” she laughs. “But I didn't stop. Now I bake every weekend.”",
      "More than 3,000 teenagers have visited TryItTeens. Many of them send messages to say thank you. Fon has never been to Korea, but she hopes to go next year. Her advice? “Don't wait until you feel ready. Just try it.”"
    ],
    practice: [
      { q: "What does Fon's website do?", o: ["On the website, teenagers share videos of new things they have tried for the first time.", "It helps teens share their first-time experiences."], a: 1, why: "ข้อ 2 ใช้คำพูดของตัวเอง สั้นและตรงใจความ ส่วนข้อ 1 คัดลอกทั้งประโยค" },
      { q: "Why did Fon make a list?", o: ["Because she wanted to stop being shy and try new things.", "“I was always shy,” Fon says."], a: 0, why: "คำตอบที่ดีต้องบอกเหตุผล ไม่ใช่ยกคำพูดมาเฉย ๆ" },
      { q: "Has Fon been to Korea?", o: ["No, she hasn't, but she wants to go.", "Fon has never been to Korea, but she hopes to go next year."], a: 0, why: "ตอบสั้นด้วยรูป short answer และเรียบเรียงใหม่" }
    ],
    quiz: [
      { q: "What is the text mainly about?", o: ["how to make a website", "a girl who shares new experiences", "Korean food", "a dance school"], a: 1, why: "ทั้งเรื่องพูดถึง Fon กับเว็บไซต์ที่แชร์ประสบการณ์ใหม่" },
      { q: "When did Fon start TryItTeens?", o: ["last month", "two years ago", "when she was ten", "next year"], a: 1, why: "Two years ago, she started a website…" },
      { q: "How often did Fon want to try something new?", o: ["every day", "every week", "every month", "every year"], a: 2, why: "I wanted to do one new thing every month." },
      { q: "How did Fon learn to cook Korean food?", o: ["from her mother", "at a cooking school", "in Korea", "by watching online videos"], a: 3, why: "she has learned to cook Korean food from online videos" },
      { q: "“it was a disaster” means the cake was …", o: ["very bad", "very big", "very expensive", "very sweet"], a: 0, why: "disaster = หายนะ ไม่สำเร็จ" },
      { q: "What does Fon do every weekend now?", o: ["sings karaoke", "bakes", "takes a dance class", "visits Korea"], a: 1, why: "Now I bake every weekend." },
      { q: "Which sentence is TRUE?", o: ["Fon has been to Korea twice.", "Fewer than 1,000 teens have visited the website.", "Many visitors thank Fon.", "Fon stopped baking after the first cake."], a: 2, why: "Many of them send messages to say thank you." },
      { q: "Fon's advice means …", o: ["Wait until you are ready.", "Start now, even if you feel nervous.", "Only try easy things.", "Ask your parents first."], a: 1, why: "Don't wait until you feel ready. Just try it." }
    ]
  },

  /* ---------------- GRAMMAR (discovery guide) ---------------- */
  grammar: {
    title: "Present perfect · ever / never",
    discover: [
      { lv: 1, topic: "โครงสร้างพื้นฐาน", show: ["Fon <u>has learned</u> to cook Korean food.", "She <u>has taken</u> a dance class.", "I <u>have baked</u> a cake.", "We <u>have seen</u> a musical."],
        q: "สังเกตคำที่ขีดเส้นใต้ หลัง have / has เป็นกริยารูปไหน?", o: ["V1 (learn, take)", "V2 (learned, took)", "V3 (learned, taken)"], a: 2,
        rule: "<b>have / has + V3</b> (past participle) เช่น take → took → <b>taken</b>, see → saw → <b>seen</b>" },
      { lv: 1, topic: "have หรือ has", show: ["<b>She</b> has taken a dance class.", "<b>My dad</b> has ridden a horse.", "<b>I</b> have baked a cake.", "<b>They</b> have seen a musical."],
        q: "ประธานแบบไหนใช้ has?", o: ["I / you / we / they และนามพหูพจน์", "he / she / it และนามเอกพจน์ (my dad, Fon)"], a: 1,
        rule: "<b>He / She / It / นามเอกพจน์</b> + <b>has</b> · <b>I / You / We / They / นามพหูพจน์</b> + <b>have</b>" },
      { lv: 1, topic: "V3 แบบปกติ", show: ["act → acted → <u>acted</u>", "visit → visited → <u>visited</u>", "bake → baked → <u>baked</u>", "try → tried → <u>tried</u>", "stop → stopped → <u>stopped</u>"],
        q: "กริยาปกติ (regular) V3 เป็นอย่างไร?", o: ["เหมือน V2 คือเติม -ed", "เติม -ing", "ใช้รูปเดิม V1"], a: 0,
        rule: "กริยาปกติ: V3 = V2 = เติม <b>-ed</b> · ลงท้าย e เติม <b>-d</b> (baked) · พยัญชนะ+y เปลี่ยนเป็น <b>-ied</b> (tried, studied) · สระเดี่ยว+พยัญชนะเดี่ยว เพิ่มพยัญชนะ (stopped)" },
      { lv: 2, topic: "V3 ไม่ปกติ", show: ["go → went → <u>gone</u> / <u>been</u>", "eat → ate → <u>eaten</u>", "swim → swam → <u>swum</u>", "ride → rode → <u>ridden</u>", "fly → flew → <u>flown</u>", "meet → met → <u>met</u>", "write → wrote → <u>written</u>", "sing → sang → <u>sung</u>"],
        q: "ประโยคใดใช้ V3 ถูก?", o: ["She has swam with dolphins.", "She has swum with dolphins.", "She has swim with dolphins."], a: 1,
        rule: "กริยาไม่ปกติต้อง <b>จำ V3</b> โดยเฉพาะคู่ที่สับสนบ่อย: swam/<b>swum</b>, sang/<b>sung</b>, flew/<b>flown</b>, ate/<b>eaten</b>, rode/<b>ridden</b>" },
      { lv: 2, topic: "รูปย่อ", show: ["I have → <u>I've</u> visited Laos.", "She has → <u>She's</u> traveled a lot.", "We have not → We <u>haven't</u> tried it.", "He has not → He <u>hasn't</u> stayed there."],
        q: "“She's traveled a lot.” คำว่า She's ย่อมาจากอะไร?", o: ["She is", "She has"], a: 1,
        rule: "<b>'ve</b> = have · <b>'s</b> = has (เมื่อตามด้วย V3) · <b>haven't</b> = have not · <b>hasn't</b> = has not" },
      { lv: 2, topic: "ประโยคปฏิเสธ", show: ["I <u>haven't met</u> anyone famous.", "My cousin <u>hasn't taken</u> any dance classes.", "We <u>haven't written</u> a book."],
        q: "ประโยคปฏิเสธมีโครงสร้างอย่างไร?", o: ["ประธาน + don't / doesn't + V1", "ประธาน + haven't / hasn't + V3", "ประธาน + didn't + V3"], a: 1,
        rule: "ปฏิเสธ: <b>haven't / hasn't + V3</b>" },
      { lv: 2, topic: "คำถามและคำตอบสั้น", show: ["<u>Have</u> you <u>ever</u> sung karaoke? — Yes, I <b>have</b>. / No, I <b>haven't</b>.", "<u>Has</u> she <u>ever</u> traveled by plane? — Yes, she <b>has</b>. / No, she <b>hasn't</b>."],
        q: "“Have you ever ridden a camel?” ถ้าไม่เคย ตอบว่าอะไร?", o: ["No, I didn't.", "No, I don't.", "No, I haven't."], a: 2,
        rule: "คำถาม: <b>Have / Has + ประธาน + (ever) + V3 …?</b> · คำตอบสั้นใช้ <b>have / has</b> ไม่ใช้ do / did" },
      { lv: 3, topic: "ever และ never", show: ["Have you <u>ever</u> played tennis?", "He has <u>never</u> played tennis.", "I've <u>never</u> eaten insects."],
        q: "never วางตรงไหน และใช้คู่กับ not ได้ไหม?", o: ["หลัง have/has หน้า V3 — ห้ามใช้ซ้อนกับ not", "ต้นประโยค — ใช้คู่กับ not ได้"], a: 0,
        rule: "<b>ever</b> = เคย (ใช้ในคำถาม) · <b>never</b> = ไม่เคย · วางระหว่าง <b>have/has</b> กับ <b>V3</b> · ✗ I haven't never → ✓ I've never" },
      { lv: 3, topic: "been to / gone to", show: ["Ploy <u>has been to</u> Paris. (ไปแล้ว และกลับมาแล้ว)", "Ploy <u>has gone to</u> Paris. (ไปแล้ว ตอนนี้ยังอยู่ที่นั่น)"],
        q: "เพื่อนกลับมาจากญี่ปุ่นแล้ว เล่าว่าอย่างไร?", o: ["She has been to Japan.", "She has gone to Japan."], a: 0,
        rule: "<b>been to</b> = เคยไปและกลับมาแล้ว (ใช้เล่าประสบการณ์) · <b>gone to</b> = ไปแล้ว ยังไม่กลับ" },
      { lv: 3, topic: "Present perfect กับ Past simple", show: ["I <u>have ridden</u> a horse. (เคยในชีวิต)", "I <u>rode</u> a horse <b>last year</b>. (บอกเวลา)", "Have you ever been to Japan? — Yes. I <u>went</u> there <b>in 2024</b>."],
        q: "ประโยคไหนถูก?", o: ["I have visited Phuket last year.", "I visited Phuket last year."], a: 1,
        rule: "Present perfect = <b>ประสบการณ์ ไม่บอกเวลา</b> · มีเวลาเจาะจง (yesterday, last…, ago, in 2024) ใช้ <b>Past simple</b> · ถามว่าเคยไหมด้วย present perfect แล้วเล่ารายละเอียดด้วย past simple" }
    ],
    mistakes: [
      { s: ["She", "have", "visited", "Japan."], bad: 1, fix: "She <b>has</b> visited Japan.", why: "she ใช้ has" },
      { s: ["I", "have", "went", "to", "Chiang Mai."], bad: 2, fix: "I have <b>been</b> to Chiang Mai.", why: "หลัง have ต้องเป็น V3 (go → went → gone/been)" },
      { s: ["I've", "visited", "Phuket", "last year."], bad: 0, fix: "I <b>visited</b> Phuket last year.", why: "มี last year (เวลาชัดเจน) ต้องใช้ past simple" },
      { s: ["I", "haven't", "never", "eaten", "sushi."], bad: 1, fix: "I've <b>never</b> eaten sushi.", why: "never มีความหมายปฏิเสธแล้ว ห้ามใช้ not ซ้อน" },
      { s: ["Have", "you", "ever", "ate", "insects?"], bad: 3, fix: "Have you ever <b>eaten</b> insects?", why: "eat → ate → eaten ต้องใช้ V3" },
      { s: ["Has", "he", "swam", "with", "dolphins?"], bad: 2, fix: "Has he <b>swum</b> with dolphins?", why: "swim → swam → swum" }
    ],
    build: {
      order: [   // level 1: word order
        { w: ["I", "have", "baked", "a", "cake."] },
        { w: ["She", "has", "never", "seen", "snow."] },
        { w: ["Have", "you", "ever", "ridden", "a", "horse?"] },
        { w: ["We", "haven't", "met", "a", "famous", "person."] },
        { w: ["Has", "Tom", "ever", "flown", "a", "kite?"] }
      ],
      transform: [   // level 2: rewrite
        { from: "She has acted in a play.", to: "negative", ans: ["she hasn't acted in a play", "she has not acted in a play"] },
        { from: "You have sung karaoke.", to: "question", ans: ["have you sung karaoke", "have you ever sung karaoke"] },
        { from: "They have seen a musical.", to: "negative", ans: ["they haven't seen a musical", "they have not seen a musical"] },
        { from: "He has swum with dolphins.", to: "question", ans: ["has he swum with dolphins", "has he ever swum with dolphins"] }
      ],
      prompt: [   // level 3: build from prompts
        { p: "My dad / ride a horse / ✅", ans: ["my dad has ridden a horse"] },
        { p: "I / see snow / ❌ (never)", ans: ["i have never seen snow", "i've never seen snow"] },
        { p: "you / ever / travel to another continent / ❓", ans: ["have you ever traveled to another continent", "have you ever travelled to another continent"] },
        { p: "My friends / bake a cake / ❌ (not)", ans: ["my friends haven't baked a cake", "my friends have not baked a cake"] }
      ],
      free: [   // level 4: free production
        "เขียนประโยคเล่าสิ่งที่ <b>คุณเคยทำ</b> (I've …)",
        "เขียนประโยคบอกสิ่งที่ <b>คุณไม่เคยทำ</b> (I've never …)",
        "เขียนคำถาม <b>Have you ever …?</b> เพื่อถามเพื่อน"
      ]
    },
    quiz: [
      { q: "My sister ___ to Japan twice.", o: ["have been", "has been", "has went", "was been"], a: 1, why: "my sister = she → has + been" },
      { q: "___ you ever eaten durian?", o: ["Did", "Do", "Have", "Has"], a: 2, why: "you → Have you ever + V3" },
      { q: "“Has Ken met a famous person?” “No, he ___.”", o: ["didn't", "hasn't", "doesn't", "haven't"], a: 1, why: "short answer ต้องใช้ has: No, he hasn't." },
      { q: "I ___ a horse last summer.", o: ["have ridden", "rode", "has ridden", "ride"], a: 1, why: "last summer = เวลาชัดเจน → past simple" },
      { q: "Which sentence is correct?", o: ["I haven't never sung karaoke.", "I've never sung karaoke.", "I've never sang karaoke.", "I never have sung karaoke."], a: 1, why: "never + V3 (sing → sang → sung)" },
      { q: "They have ___ a sandcastle on the beach.", o: ["build", "builded", "built", "building"], a: 2, why: "build → built → built" },
      { type: "text", q: "เติมคำ: We ___ (never / see) a musical.", ans: ["have never seen", "'ve never seen", "ve never seen"], why: "We have never seen a musical." },
      { type: "text", q: "เติมคำ: Has she ever ___ (fly) a kite?", ans: ["flown"], why: "fly → flew → flown: Has she ever flown a kite?" }
    ]
  },

  /* ---------------- SPEAKING (needs microphone) ---------------- */
  speaking: {
    tip: "สบตา พูดเสียงดังฟังชัด ตอบรับคู่สนทนา: <b>Really? · Wow! · What was it like? · Me too!</b>",
    model: [
      ["A", "Have you ever slept under the stars?"],
      ["B", "Yes, I have. I slept under the stars at a camp."],
      ["A", "Really? What was it like?"],
      ["B", "It was cold, but amazing. Have you ever done it?"],
      ["A", "No, I haven't. But I'd love to try it."]
    ],
    phrases: ["Have you ever …?", "Yes, I have. / No, I haven't.", "Really? What was it like?", "I've never …, but I'd love to.", "Me too!", "Why are you interested in music?", "I can play the guitar.", "I'd really like to join the band."],
    quiz: [
      { type: "read", t: "I have never ridden a horse." },
      { type: "read", t: "Have you ever made a snowman?" },
      { type: "read", t: "She has swum with dolphins in Krabi." },
      { type: "read", t: "We slept under the stars at camp." },
      { type: "answer", q: "Have you ever sung karaoke?", need: [["yes i have", "no i haven't", "no i have not", "i have", "i haven't", "i've", "never"]], hint: "ตอบ Yes, I have. หรือ No, I haven't. แล้วเล่าเพิ่ม 1 ประโยค" },
      { type: "answer", q: "Have you ever traveled to another country?", need: [["yes i have", "no i haven't", "no i have not", "i have", "i haven't", "i've", "never"]], hint: "เช่น Yes, I have. I've been to Laos." },
      { type: "answer", q: "Tell me one thing you have never done.", need: [["never"]], hint: "เริ่มด้วย I've never …" },
      { type: "answer", q: "Ask me a question with “ever”.", need: [["have you ever", "has", "ever"]], hint: "เริ่มด้วย Have you ever …?" }
    ]
  },

  /* ---------------- WRITING ---------------- */
  writing: {
    tip: "ใช้ <b>who</b> กับคน · <b>where</b> กับสถานที่ · <b>which</b> กับสิ่งของ/สัตว์ เพื่อเชื่อมประโยคให้ข้อมูลเพิ่ม",
    model: {
      to: "Nan",
      lines: [
        "Hi Nan,",
        "I'm at Khao Yai with my family. It's a place where you can see wild elephants!",
        "I've ridden a bike through the forest, but I haven't seen an elephant yet.",
        "Yesterday I met a boy who plays the guitar. We sang songs by the campfire.",
        "See you soon! Ploy",
        "P.S. I've bought you a T-shirt which has an elephant on it."
      ]
    },
    discover: [
      { s: "I met a boy ___ plays the guitar.", o: ["who", "where", "which"], a: 0, why: "a boy = คน → who" },
      { s: "It's a place ___ you can see elephants.", o: ["who", "where", "which"], a: 1, why: "a place = สถานที่ → where" },
      { s: "I bought a T-shirt ___ has an elephant on it.", o: ["who", "where", "which"], a: 2, why: "a T-shirt = สิ่งของ → which" }
    ],
    quiz: [
      { q: "A composer is a person ___ writes music.", o: ["who", "where", "which", "when"], a: 0, why: "person → who" },
      { q: "This is the beach ___ we built a sandcastle.", o: ["who", "where", "which", "what"], a: 1, why: "beach = สถานที่ → where" },
      { q: "Karaoke is a hobby ___ my family loves.", o: ["who", "where", "which", "whose"], a: 2, why: "hobby = สิ่ง → which" },
      { q: "Choose the best way to join: “I have a friend. She has been to Japan.”", o: ["I have a friend which has been to Japan.", "I have a friend who has been to Japan.", "I have a friend where has been to Japan.", "I have a friend who she has been to Japan."], a: 1, why: "friend = คน → who และไม่ต้องมี she ซ้ำ" },
      { q: "Which is the best opening for a postcard to a friend?", o: ["Dear Sir,", "Hi Nan,", "To whom it may concern,", "Yours faithfully,"], a: 1, why: "โปสการ์ดถึงเพื่อนใช้ภาษาไม่เป็นทางการ: Hi …," },
      { q: "“P.S.” in a postcard is for …", o: ["the address", "an extra idea at the end", "the date", "the title"], a: 1, why: "P.S. = ข้อความเพิ่มเติมท้ายจดหมาย" },
      { q: "Find the mistake: “It's a camp who you can swim in the lake.”", o: ["It's", "who", "swim", "lake"], a: 1, why: "camp = สถานที่ → where" },
      { q: "Which sentence is best for a postcard about your trip?", o: ["I visit a museum tomorrow yesterday.", "I've seen a musical, but I haven't ridden a horse yet.", "I have saw a musical.", "I haven't never been here."], a: 1, why: "ใช้ present perfect ถูกต้องทั้งบอกเล่าและปฏิเสธ" }
    ],
    task: "เขียนโปสการ์ดออนไลน์ถึงเพื่อน 60–80 คำ เล่าว่าคุณอยู่ที่ไหน ทำอะไรมาแล้ว (I've …) ยังไม่ได้ทำอะไร (I haven't … yet) และใช้ who / where / which อย่างน้อย 1 ครั้ง ปิดท้ายด้วย P.S."
  },

  /* ---------------- POST-TEST (20, tagged by skill, diagnostic) ---------------- */
  posttest: [
    { skill: "vocab", pic: "🪁", q: "What is the activity?", o: ["fly a kite", "ride a horse", "record music", "bake a cake"], a: 0 },
    { skill: "vocab", q: "A person who plays the guitar is a ___.", o: ["composer", "guitarist", "choir", "drummer"], a: 1 },
    { skill: "vocab", q: "We built a ___ on the beach.", o: ["snowman", "sandcastle", "musical", "continent"], a: 1 },
    { skill: "vocab", q: "คำใดหมายถึง “ดูละครเพลง”", o: ["see a musical", "sing karaoke", "act in a play", "record music"], a: 0 },
    { skill: "listening", audio: "I've never been on a plane, but my brother has flown to Japan three times.", q: "Who has flown to Japan?", o: ["the speaker", "the speaker's brother", "both of them", "nobody"], a: 1 },
    { skill: "listening", audio: "Have you ever seen snow? — No, I haven't, but I've made a snowman out of sand!", q: "Has the speaker seen snow?", o: ["Yes, many times.", "No, never.", "Yes, once.", "We don't know."], a: 1 },
    { skill: "listening", audio: "The concert starts at seven, but the choir has to arrive at six.", q: "When must the choir arrive?", o: ["at five", "at six", "at seven", "at eight"], a: 1 },
    { skill: "listening", audio: "I wanted to go zip lining, but it was closed because of the rain.", q: "Why didn't the speaker go zip lining?", o: ["It was too expensive.", "The weather was bad.", "The speaker was scared.", "It was too far."], a: 1 },
    { skill: "reading", text: "Tom has played the drums since he was ten. Last year, he joined a band and they recorded their first song.", q: "What did Tom do last year?", o: ["started the drums", "joined a band", "became a composer", "met a famous person"], a: 1 },
    { skill: "reading", text: "Ann has visited four continents, but she has never been to Africa. She hopes to go next year.", q: "Which is TRUE?", o: ["Ann has been to Africa.", "Ann wants to visit Africa.", "Ann has visited three continents.", "Ann went to Africa last year."], a: 1 },
    { skill: "grammar", q: "He ___ a bungee jump.", o: ["have done", "has done", "has did", "have did"], a: 1 },
    { skill: "grammar", q: "___ they ever met a famous person?", o: ["Has", "Have", "Did", "Do"], a: 1 },
    { skill: "grammar", q: "I ___ my grandma yesterday.", o: ["have visited", "visited", "has visited", "visit"], a: 1 },
    { skill: "grammar", q: "She's never ___ a musical instrument.", o: ["play", "played", "playing", "plays"], a: 1 },
    { skill: "speaking", q: "Your friend asks: “Have you ever ridden a horse?” You haven't. You say:", o: ["No, I didn't.", "No, I haven't.", "No, I don't.", "No, I wasn't."], a: 1 },
    { skill: "speaking", q: "Your friend says: “I've swum with dolphins!” The best reply is:", o: ["Really? What was it like?", "No, I haven't.", "Yes, it is.", "I'm fine, thanks."], a: 0 },
    { skill: "speaking", q: "Which question asks about experience?", o: ["Do you swim?", "Have you ever swum in the sea?", "Are you swimming?", "Did you swim yesterday?"], a: 1 },
    { skill: "writing", q: "I met a girl ___ sings in a choir.", o: ["who", "which", "where", "what"], a: 0 },
    { skill: "writing", q: "This is the park ___ we flew a kite.", o: ["who", "which", "where", "whose"], a: 2 },
    { skill: "writing", q: "Choose the best postcard sentence.", o: ["I've tried Thai boxing, but I haven't watched a match yet.", "I have tryed Thai boxing.", "I never have try it.", "I tried yesterday it."], a: 0 }
  ],

  advice: {
    vocab: "ทบทวนบัตรคำ ฟังเสียงแล้วพูดตาม และทำแบบฝึกศัพท์ในประโยคอีกรอบ",
    listening: "ฟังบทสนทนาซ้ำแบบช้า สังเกตคำว่า never / but / not yet และคำที่ความหมายเหมือนกันแต่ใช้คำต่างกัน",
    reading: "อ่านโปรไฟล์ของ Fon อีกครั้ง ฝึกหาประโยคที่มีคำตอบแล้วเรียบเรียงด้วยคำของตัวเอง",
    grammar: "ทำ Discovery guide ใหม่ เน้น have/has + V3 และจุดที่ผิดบ่อย แล้วแต่งประโยคระดับ 2–3 อีกรอบ",
    speaking: "ฝึกพูดตามบทสนทนาตัวอย่าง และฝึกตอบ Have you ever…? ด้วย Yes, I have / No, I haven't",
    writing: "ทบทวน who / where / which แล้วเขียนโปสการ์ดตามโครงตัวอย่างอีกครั้ง"
  }
};
