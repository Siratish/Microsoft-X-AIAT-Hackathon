const requiredFields = [
  ["chiefComplaint", "อาการสำคัญ"],
  ["duration", "ระยะเวลา"],
  ["severity", "ความรุนแรง"],
  ["allergies", "แพ้ยา/อาหาร"],
  ["medications", "ยาที่ใช้ประจำ"],
  ["conditions", "โรคประจำตัว"],
  ["recentCare", "การรักษาล่าสุด"],
  ["preferredHospital", "โรงพยาบาล/แผนกที่สะดวก"],
];

const channelLabels = {
  morphrom: "หมอพร้อม",
  line: "LINE OA",
};

const redFlagRules = [
  {
    label: "เจ็บแน่นหน้าอกร่วมกับหายใจลำบาก",
    keywords: ["เจ็บหน้าอก", "แน่นหน้าอก", "หายใจลำบาก", "หอบ", "เหนื่อยมาก"],
    severity: "critical",
    action: "ส่งต่อฉุกเฉินและแจ้งพยาบาลคัดกรองทันที",
  },
  {
    label: "อาการทางระบบประสาทเฉียบพลัน",
    keywords: ["แขนขาอ่อนแรง", "หน้าเบี้ยว", "พูดไม่ชัด", "ชัก", "หมดสติ"],
    severity: "critical",
    action: "แจ้ง ER / stroke fast track",
  },
  {
    label: "ไข้สูงร่วมกับซึม หรือสัญญาณติดเชื้อรุนแรง",
    keywords: ["ไข้สูง", "ซึม", "หนาวสั่น", "ความดันต่ำ"],
    severity: "high",
    action: "เร่ง staff review ก่อนจัดคิว OPD",
  },
  {
    label: "ปวดท้องรุนแรงหรือเลือดออก",
    keywords: ["ปวดท้องรุนแรง", "ถ่ายดำ", "อาเจียนเป็นเลือด", "เลือดออกมาก"],
    severity: "high",
    action: "ส่งประเมินเร่งด่วน",
  },
];

const departmentKnowledge = [
  {
    id: "er",
    name: "ห้องฉุกเฉิน",
    color: "danger",
    triggers: ["เจ็บหน้าอก", "แน่นหน้าอก", "หายใจลำบาก", "หมดสติ", "ชัก", "แขนขาอ่อนแรง"],
    requirements: ["สัญญาณชีพ", "เวลาที่เริ่มมีอาการ", "ผู้ติดต่อฉุกเฉิน"],
  },
  {
    id: "medicine",
    name: "อายุรกรรม",
    color: "azure",
    triggers: ["ไข้", "ไอ", "เจ็บคอ", "เหนื่อย", "เบาหวาน", "ความดัน", "เวียนหัว"],
    requirements: ["โรคประจำตัว", "ยาที่ใช้", "ประวัติแพ้ยา"],
  },
  {
    id: "orthopedics",
    name: "ศัลยกรรมกระดูก",
    color: "green",
    triggers: ["ปวดเข่า", "ปวดหลัง", "ข้อเท้า", "กระดูก", "หกล้ม", "บาดเจ็บ"],
    requirements: ["ตำแหน่งปวด", "ระดับความปวด", "ประวัติอุบัติเหตุ"],
  },
  {
    id: "obgyn",
    name: "สูตินรีเวช",
    color: "pink",
    triggers: ["ตั้งครรภ์", "ประจำเดือน", "ปวดท้องน้อย", "ตกขาว"],
    requirements: ["ประวัติประจำเดือน", "อายุครรภ์", "เลือดออกผิดปกติ"],
  },
  {
    id: "pediatrics",
    name: "กุมารเวช",
    color: "yellow",
    triggers: ["เด็ก", "ทารก", "วัคซีน", "ผู้ป่วยอายุ 5"],
    requirements: ["อายุและน้ำหนัก", "วัคซีนล่าสุด", "ผู้ปกครองที่มาด้วย"],
  },
];

const sampleCases = {
  normal: {
    label: "OPD ปกติ",
    description: "ข้อมูลครบ แนะนำอายุรกรรม",
    channel: "morphrom",
    voiceMode: false,
    identity: {
      name: "สมชาย ใจดี",
      age: "46 ปี",
      sex: "ชาย",
      cid: "x-xxxx-xxxxx-21-7",
      contact: "089-xxx-4210",
    },
    fields: {
      chiefComplaint: "ไอ เจ็บคอ มีไข้ต่ำ",
      duration: "3 วัน",
      severity: "4/10 ยังเดินได้ ไม่มีหอบ",
      allergies: "ปฏิเสธแพ้ยา",
      medications: "ยาลดความดัน amlodipine",
      conditions: "ความดันโลหิตสูง",
      recentCare: "ซื้อยาลดไข้รับประทานเอง อาการดีขึ้นเล็กน้อย",
      preferredHospital: "OPD อายุรกรรม โรงพยาบาลกลาง",
    },
    transcript: [
      ["bot", "สวัสดีค่ะ ระบบหมอพร้อม AI ขอซักประวัติเบื้องต้นก่อนพบเจ้าหน้าที่"],
      ["patient", "มีไข้ต่ำ ไอ เจ็บคอมา 3 วันครับ"],
      ["bot", "มีอาการหอบ เหนื่อยมาก เจ็บหน้าอก หรือซึมลงไหมคะ"],
      ["patient", "ไม่มีครับ ยังเดินได้ แค่เจ็บคอและไอ"],
      ["bot", "แพ้ยา หรือมียาที่ใช้ประจำไหมคะ"],
      ["patient", "ไม่แพ้ยา ใช้ยาลดความดัน amlodipine"],
    ],
  },
  incomplete: {
    label: "ข้อมูลยังไม่ครบ",
    description: "ให้บอทถาม follow-up",
    channel: "line",
    voiceMode: false,
    identity: {
      name: "กานดา พิมพ์ใจ",
      age: "31 ปี",
      sex: "หญิง",
      cid: "x-xxxx-xxxxx-84-2",
      contact: "092-xxx-1188",
    },
    fields: {
      chiefComplaint: "ปวดเข่าขวาหลังวิ่ง",
      duration: "",
      severity: "",
      allergies: "",
      medications: "ไม่มียาประจำ",
      conditions: "ปฏิเสธโรคประจำตัว",
      recentCare: "",
      preferredHospital: "โรงพยาบาลใกล้บ้าน",
    },
    transcript: [
      ["bot", "สวัสดีค่ะ LINE OA หมอพร้อมช่วยเก็บข้อมูลก่อนส่งต่อ OPD"],
      ["patient", "ปวดเข่าขวาหลังวิ่ง อยากทราบว่าควรไปแผนกไหน"],
      ["bot", "ขอทราบระดับความปวด ระยะเวลาที่เป็น และมีอุบัติเหตุร่วมด้วยไหมคะ"],
      ["patient", "ไม่มีอุบัติเหตุค่ะ"],
    ],
  },
  emergency: {
    label: "Red flag",
    description: "ระบบหยุด routing ปกติ",
    channel: "morphrom",
    voiceMode: false,
    identity: {
      name: "ประเสริฐ วัฒนะ",
      age: "62 ปี",
      sex: "ชาย",
      cid: "x-xxxx-xxxxx-06-9",
      contact: "081-xxx-9002",
    },
    fields: {
      chiefComplaint: "แน่นหน้าอก เหนื่อยมาก เหงื่อแตก",
      duration: "เริ่ม 40 นาที ก่อนติดต่อ",
      severity: "9/10",
      allergies: "ไม่ทราบ",
      medications: "ยาเบาหวานและยาความดัน ไม่ทราบชื่อ",
      conditions: "เบาหวาน ความดัน ไขมันสูง",
      recentCare: "ยังไม่ได้รับการรักษา",
      preferredHospital: "ใกล้ที่สุด",
    },
    transcript: [
      ["bot", "ขอซักประวัติเพื่อคัดกรองเบื้องต้นค่ะ"],
      ["patient", "แน่นหน้าอกมาก หายใจลำบาก เหนื่อย เหงื่อออก"],
      ["bot", "อาการนี้เข้าข่ายฉุกเฉิน ระบบจะแจ้งเจ้าหน้าที่และแนะนำให้ติดต่อ 1669 ทันที"],
    ],
  },
  voice: {
    label: "Voicebot",
    description: "รองรับ STT/TTS ภาษาไทย",
    channel: "line",
    voiceMode: true,
    identity: {
      name: "นภา ศรีสุข",
      age: "28 ปี",
      sex: "หญิง",
      cid: "x-xxxx-xxxxx-67-4",
      contact: "095-xxx-7791",
    },
    fields: {
      chiefComplaint: "เวียนศีรษะ คลื่นไส้เล็กน้อย",
      duration: "ตั้งแต่เช้า",
      severity: "5/10 ไม่มีหมดสติ",
      allergies: "แพ้ penicillin",
      medications: "ไม่มี",
      conditions: "ไมเกรนเป็นบางครั้ง",
      recentCare: "พักผ่อนและดื่มน้ำ ยังไม่ดีขึ้น",
      preferredHospital: "OPD อายุรกรรม หลัง 14:00",
    },
    transcript: [
      ["bot", "กดไมโครโฟนแล้วพูดอาการได้เลยค่ะ"],
      ["patient", "เวียนหัวตั้งแต่เช้า คลื่นไส้นิดหน่อย ไม่ได้หมดสติ"],
      ["bot", "ระบบถอดเสียงเรียบร้อย ขอถามประวัติแพ้ยาเพิ่มเติมค่ะ"],
      ["patient", "แพ้ยาเพนิซิลลินค่ะ"],
    ],
  },
};

const triageScripts = {
  voice: {
    channel: "morphrom",
    identity: {
      name: "ผู้รับบริการ",
      age: "ตั้งครรภ์ 22 สัปดาห์",
      sex: "หญิง",
      cid: "x-xxxx-xxxxx-42-8",
      contact: "09x-xxx-4821",
    },
    initialBot: "สวัสดีค่ะ หมอพร้อม AI พร้อมช่วยบันทึกข้อมูลก่อนพบเจ้าหน้าที่ กดไมโครโฟนแล้วเล่าอาการได้เลยค่ะ",
    steps: [
      {
        patient: "สวัสดีค่ะ ตอนนี้ตั้งครรภ์ได้ 22 สัปดาห์ แล้วรู้สึกปวดแสบเวลาปัสสาวะมาตั้งแต่เมื่อวานค่ะ",
        fields: {
          chiefComplaint: "ตั้งครรภ์ 22 สัปดาห์ มีปัสสาวะแสบขัด",
          duration: "ตั้งแต่เมื่อวาน ประมาณ 1 วัน",
          conditions: "ตั้งครรภ์ 22 สัปดาห์",
          preferredHospital: "ส่งต่อพยาบาลคัดกรอง/สูตินรีเวช",
        },
        bot: "รับทราบค่ะ เพื่อข้อมูลที่ครบถ้วนสำหรับพยาบาล รบกวนขอข้อมูลเพิ่มเติมนะคะ: นอกจากอาการแสบขัดแล้ว คุณแม่มีอาการปวดหลังร่วมด้วยไหมคะ หรือมีอาการปวดหน่วงบริเวณท้องน้อยหรือเปล่า?",
        audio: "src/sample_triage_01/triage1_1.mp3",
      },
      {
        patient: "มีอาการปวดหน่วงๆ ที่ท้องน้อยค่ะ แต่ปวดหลังไม่มีนะคะ",
        fields: {
          severity: "ปวดหน่วงท้องน้อย ปฏิเสธอาการปวดหลัง",
        },
        bot: "ขอบคุณค่ะ แล้วตั้งแต่วันเมื่อวานจนถึงตอนนี้ คุณแม่มีอาการไข้ หนาวสั่น หรือรู้สึกคลื่นไส้อาเจียนบ้างไหมคะ?",
        audio: "src/sample_triage_01/triage1_2.mp3",
      },
      {
        patient: "ไม่มีไข้ค่ะ ลองวัดดูแล้วได้ 36.5 องศา แต่รู้สึกอ่อนเพลียนิดหน่อยค่ะ",
        fields: {
          severity: "ปวดหน่วงท้องน้อย อ่อนเพลียเล็กน้อย ไม่มีไข้ วัดได้ 36.5°C ไม่มีปวดหลัง",
        },
        bot: "ขอบคุณสำหรับข้อมูลค่ะ รบกวนสอบถามลักษณะของปัสสาวะนิดนึงนะคะ ปัสสาวะมีสีขุ่น มีเลือดปน หรือมีกลิ่นผิดปกติไปจากเดิมบ้างไหมคะ?",
        audio: "src/sample_triage_01/triage1_3.mp3",
      },
      {
        patient: "ปัสสาวะดูขุ่นกว่าปกตินิดหน่อยค่ะ ไม่มีเลือดนะคะ แล้วก็พยายามดื่มน้ำเยอะขึ้นกับกินสารสกัดแครนเบอร์รี่แล้วแต่อาการยังไม่ดีขึ้นค่ะ",
        fields: {
          recentCare: "ดื่มน้ำมากขึ้นและรับประทานสารสกัดแครนเบอร์รี่แล้ว แต่อาการยังไม่ดีขึ้น",
        },
        bot: "รับทราบค่ะ ข้อมูลสุดท้ายก่อนสรุปส่งต่อให้พยาบาลนะคะ: คุณแม่มีโรคประจำตัวอื่นๆ หรือมีประวัติแพ้ยาตัวไหนไหมคะ? และช่วงนี้ได้ทานยาตัวไหนอยู่เป็นประจำหรือเปล่า?",
        audio: "src/sample_triage_01/triage1_4.mp3",
      },
      {
        patient: "ไม่มีโรคประจำตัวค่ะ ไม่แพ้ยาอะไร ปกติทานแค่แคปซูลวิตามินบำรุงครรภ์ที่หมอสั่งให้ค่ะ",
        fields: {
          allergies: "ปฏิเสธประวัติแพ้ยา",
          medications: "วิตามินบำรุงครรภ์ตามแพทย์สั่ง",
          conditions: "ตั้งครรภ์ 22 สัปดาห์ ปฏิเสธโรคประจำตัวอื่น",
        },
        complete: true,
      },
    ],
  },
  text: {
    channel: "morphrom",
    identity: {
      name: "ผู้รับบริการ",
      age: "72 ปี",
      sex: "ชาย",
      cid: "x-xxxx-xxxxx-72-3",
      contact: "08x-xxx-7201",
    },
    initialBot: "สวัสดีครับ หมอพร้อม AI พร้อมช่วยบันทึกข้อมูลก่อนพบเจ้าหน้าที่ วันนี้ต้องการปรึกษาอาการอะไรครับ",
    steps: [
      {
        patient: "สวัสดีจ้ะลูก หมอคอมพิวเตอร์ช่วยหน่อย ตาอายุ 72 แล้ว วันนี้รู้สึกเพลียๆ แล้วก็เวียนหัวตั้งแต่ตื่นนอนเลย เดินไปห้องน้ำก็เหมือนจะวูบ",
        fields: {
          chiefComplaint: "เวียนศีรษะ อ่อนเพลีย และมีอาการคล้ายจะวูบ",
          duration: "ตั้งแต่ตื่นนอนวันนี้",
          preferredHospital: "ให้พยาบาลคัดกรองประเมินต่อ",
        },
        bot: "สวัสดีครับคุณตา ผมจะช่วยบันทึกข้อมูลเพื่อเตรียมไว้ให้คุณพยาบาลนะครับ รบกวนสอบถามคุณตานิดนึงครับว่า เมื่อเช้าตอนที่รู้สึกจะวูบ คุณตาได้มีการล้มหรือมีส่วนไหนของร่างกายกระแทกพื้นบ้างไหมครับ?",
        audio: "src/sample_triage_02/triage2_1.mp3",
      },
      {
        patient: "ไม่ได้ล้มจ้ะตาเกาะขอบโต๊ะไว้ทัน แต่พอนั่งพักแล้วมันก็ยังมึนๆ หัวอยู่ ใจมันสั่นๆ ด้วยนะ",
        fields: {
          severity: "เกือบวูบแต่ไม่ล้ม เกาะโต๊ะไว้ทัน ยังมึนศีรษะและมีใจสั่น",
        },
        bot: "คุณตาเก่งมากครับที่คว้าโต๊ะไว้ทัน แล้วปกติคุณตามีโรคประจำตัวพวกความดันโลหิตสูง เบาหวาน หรือโรคหัวใจอยู่บ้างไหมครับ? แล้วเมื่อเช้านี้ได้ทานยาประจำตัวไปหรือยังครับ?",
        audio: "src/sample_triage_02/triage2_2.mp3",
      },
      {
        patient: "มีโรคความดันสูงกับเบาหวานจ้ะ ยาความดันตาเพิ่งกินไปเมื่อกี้เอง แต่ยาเบาหวานยังไม่ได้กินเพราะตายังไม่ได้กินข้าวเช้า มันเบื่ออาหารน่ะ",
        fields: {
          medications: "ทานยาความดันแล้ว ยาเบาหวานยังไม่ได้ทานเพราะยังไม่ได้รับประทานอาหารเช้า",
          conditions: "ความดันโลหิตสูง เบาหวาน เบื่ออาหาร",
        },
        bot: "รับทราบครับคุณตา ก่อนหน้าที่จะมีอาการเวียนหัว คุณตามีอาการเหงื่อแตก ตัวเย็น หรือมือสั่นร่วมด้วยไหมครับ? แล้วปกติคุณตามีเครื่องวัดความดันหรือเครื่องตรวจน้ำตาลที่บ้านไหมครับ ถ้ามี...ล่าสุดวัดได้เท่าไหร่ครับ?",
        audio: "src/sample_triage_02/triage2_3.mp3",
      },
      {
        patient: "มีเหงื่อซึมๆ ตามหน้าผากอยู่เหมือนกันจ้ะ ตาเพิ่งวัดความดันเมื่อกี้ ได้ 110/70 ส่วนน้ำตาลไม่ได้วัดมาหลายวันแล้วล่ะลูก",
        fields: {
          recentCare: "มีเหงื่อซึม วัดความดันได้ 110/70 mmHg ยังไม่ได้ตรวจน้ำตาลหลายวัน",
        },
        bot: "ขอบคุณสำหรับตัวเลขครับคุณตา ข้อมูลสุดท้ายนะครับ: ตอนนี้คุณตามีอาการตาพร่ามัว มองเห็นภาพซ้อน หรือรู้สึกว่าแขนขาข้างไหนอ่อนแรง ขยับไม่ได้บ้างไหมครับ?",
        audio: "src/sample_triage_02/triage2_4.mp3",
      },
      {
        patient: "ตาไม่พร่านะจ้ะ แขนขาก็ยังขยับได้ปกติ แค่มันหวิวๆ เหมือนคนไม่มีแรงเฉยๆ จ้ะลูก",
        fields: {
          severity: "ไม่มีตาพร่ามัว ไม่มีภาพซ้อน ไม่มีแขนขาอ่อนแรง ยังรู้สึกหวิวและไม่มีแรง",
          allergies: "ยังไม่มีข้อมูลแพ้ยาในบทสนทนา",
          preferredHospital: "พยาบาลคัดกรอง/อายุรกรรม ประเมิน DTX, orthostatic BP และ EKG เบื้องต้น",
        },
        complete: true,
      },
    ],
  },
};

const root = document.querySelector("#app");

let state = createState("normal");
let activeView = "patient";
let voiceRecorder = null;
let voiceStream = null;
let voiceStreamPromise = null;
let voiceChunks = [];
let voiceTimer = null;
let voiceCaptureId = 0;
let voiceSessionId = 0;
let voiceAudioContext = null;
let voiceAudioSource = null;
let voiceAnalyser = null;
let voiceLevelBuffer = null;
let voiceLevelFrame = null;
let smoothedVoiceLevel = 0;
let responseTimer = null;
let responseToken = 0;
let botAudio = null;

function createState(caseId) {
  const sample = sampleCases[caseId];
  const script = getDialogScript("text");
  const base = {
    caseId,
    channel: script.channel || sample.channel,
    voiceMode: false,
    identity: { ...script.identity },
    fields: emptyIntakeFields(),
    transcript: [{ role: "bot", text: script.initialBot }],
    consent: true,
    staffEdited: false,
    reviewStatus: "waiting",
    approvedAt: "",
    audit: [
      "บันทึก consent และ identity check แล้ว",
      "เริ่ม session สำหรับการซักประวัติก่อนพบเจ้าหน้าที่",
    ],
    dialog: {
      active: true,
      completed: false,
      mode: "text",
      stepIndex: 0,
      thinking: false,
    },
    inputDraft: "",
    summaryModalOpen: false,
    recorder: {
      status: "idle",
      elapsed: 0,
      hasAudio: false,
      error: "",
      isFallback: false,
      deviceStatus: "unknown",
      deviceLabel: "",
      deviceCount: 0,
    },
  };
  return deriveState(base);
}

function deriveState(nextState) {
  const missingFields = requiredFields.filter(([key]) => !String(nextState.fields[key] || "").trim());
  const risk = detectRisk(nextState);
  const department = recommendDepartment(nextState, risk);
  const completion = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  const summary = nextState.staffEdited && nextState.summary
    ? nextState.summary
    : generateSummary(nextState, risk, department, missingFields);

  return {
    ...nextState,
    risk,
    department,
    missingFields,
    completion,
    summary,
    pipeline: buildPipeline(risk, missingFields, nextState.reviewStatus),
  };
}

function transcriptText(nextState) {
  const transcript = nextState.transcript
    .filter((message) => message.role === "patient")
    .map((message) => message.text)
    .join(" ");
  return `${Object.values(nextState.fields).join(" ")} ${transcript}`.toLowerCase();
}

function detectRisk(nextState) {
  const allText = transcriptText(nextState);
  const matches = redFlagRules
    .map((rule) => ({
      ...rule,
      hits: rule.keywords.filter((keyword) => hasAffirmedKeyword(allText, keyword)),
    }))
    .filter((rule) => rule.hits.length > 0);

  if (matches.some((rule) => rule.severity === "critical")) {
    return {
      level: "critical",
      label: "ฉุกเฉิน",
      description: "พบ red flag ต้องให้เจ้าหน้าที่ประเมินด่วน",
      matches,
    };
  }

  if (matches.length > 0) {
    return {
      level: "high",
      label: "เสี่ยงสูง",
      description: "ควรเร่ง staff review ก่อนจัดคิว",
      matches,
    };
  }

  return {
    level: "routine",
    label: "OPD ปกติ",
    description: "ไม่พบ red flag จากข้อมูลที่ให้ไว้",
    matches: [],
  };
}

function hasAffirmedKeyword(text, keyword) {
  let index = text.indexOf(keyword);
  while (index !== -1) {
    const before = text.slice(Math.max(0, index - 18), index);
    const directPhrase = text.slice(Math.max(0, index - 8), index + keyword.length + 8);
    const negated = [
      "ไม่มี",
      "ไม่พบ",
      "ไม่ได้",
      "ไม่เป็น",
      "ปฏิเสธ",
      "no ",
      "without",
    ].some((term) => before.includes(term) || directPhrase.includes(`${term}${keyword}`));

    if (!negated) return true;
    index = text.indexOf(keyword, index + keyword.length);
  }

  return false;
}

function recommendDepartment(nextState, risk) {
  if (risk.level === "critical") {
    return {
      ...departmentKnowledge[0],
      confidence: 98,
      reason: "เข้าข่ายอาการฉุกเฉิน จึงไม่จัด routing OPD ปกติ",
    };
  }

  const allText = transcriptText(nextState);
  const scored = departmentKnowledge
    .filter((department) => department.id !== "er")
    .map((department) => {
      const hits = department.triggers.filter((keyword) => allText.includes(keyword));
      return {
        ...department,
        hits,
        score: hits.length,
      };
    })
    .sort((a, b) => b.score - a.score);

  const selected = scored[0].score > 0 ? scored[0] : departmentKnowledge[1];
  const confidence = Math.min(94, 62 + selected.score * 11 + (nextState.completion || 0) / 5);

  return {
    ...selected,
    confidence: Math.round(confidence),
    reason: selected.hits?.length
      ? `พบคำสำคัญ: ${selected.hits.join(", ")}`
      : "ข้อมูลยังไม่ชี้เฉพาะทางชัดเจน จึงแนะนำอายุรกรรมเป็นจุดเริ่มต้น",
  };
}

function buildPipeline(risk, missingFields, reviewStatus) {
  const hasMissing = missingFields.length > 0;
  const emergency = risk.level === "critical";
  const approved = reviewStatus === "approved";

  return [
    {
      id: "consent",
      name: "Consent + Identity",
      detail: "ยืนยันตัวตนและบันทึกความยินยอม",
      status: "done",
    },
    {
      id: "intake",
      name: "Chat / Voice Intake",
      detail: hasMissing ? `ยังขาด ${missingFields.length} รายการ` : "ข้อมูลซักประวัติครบสำหรับ draft",
      status: hasMissing ? "active" : "done",
    },
    {
      id: "redflag",
      name: "Red-Flag Screening",
      detail: risk.description,
      status: emergency ? "blocked" : "done",
    },
    {
      id: "rag",
      name: "Azure OpenAI + AI Search",
      detail: emergency ? "หยุด RAG routing ปกติและ escalate" : "เทียบ guideline แผนกและ requirement",
      status: emergency ? "blocked" : hasMissing ? "queued" : "done",
    },
    {
      id: "summary",
      name: "SOAP Handoff Draft",
      detail: emergency ? "สร้าง note ฉุกเฉินให้ staff review" : "สร้าง summary เพื่อส่งต่อแผนก",
      status: hasMissing && !emergency ? "queued" : "done",
    },
    {
      id: "review",
      name: "Staff Review Required",
      detail: approved ? "เจ้าหน้าที่อนุมัติแล้ว" : "รอพยาบาล/แพทย์ตรวจแก้",
      status: approved ? "done" : "active",
    },
    {
      id: "handoff",
      name: "HIS/FHIR + Notify",
      detail: approved ? "ส่งต่อ record และแจ้งเตือนผู้ป่วย" : "ล็อกไว้จนกว่าจะ approve",
      status: approved ? "done" : "queued",
    },
  ];
}

function generateSummary(nextState, risk, department, missingFields) {
  const patient = nextState.identity;
  const fields = nextState.fields;
  const missing = missingFields.map(([, label]) => label).join(", ") || "ไม่มี";
  const redFlags = risk.matches.length
    ? risk.matches.map((rule) => `${rule.label} (${rule.action})`).join("; ")
    : "ไม่พบ red flag จากคำตอบปัจจุบัน";

  return [
    `ผู้ป่วย: ${patient.name} (${patient.age}, ${patient.sex}) | ช่องทาง: ${channelLabels[nextState.channel]}`,
    "",
    "S: " + [
      fields.chiefComplaint || "ยังไม่ระบุอาการสำคัญ",
      fields.duration ? `ระยะเวลา ${fields.duration}` : "",
      fields.severity ? `ความรุนแรง ${fields.severity}` : "",
    ].filter(Boolean).join(" | "),
    "O: ข้อมูลจาก patient-reported intake; ยังไม่มี vital signs หรือผลตรวจแนบ",
    `A-support: ระดับความเสี่ยง ${risk.label}; ${redFlags}`,
    `P-suggestion: แนะนำ ${department.name} (${department.confidence}% confidence) เพื่อให้เจ้าหน้าที่ตรวจทานและยืนยันก่อนส่งต่อ`,
    `Missing info: ${missing}`,
    `Medication/Allergy: แพ้ยา ${fields.allergies || "ยังไม่ระบุ"}; ยาประจำ ${fields.medications || "ยังไม่ระบุ"}`,
    `Past history: ${fields.conditions || "ยังไม่ระบุ"}; Recent care: ${fields.recentCare || "ยังไม่ระบุ"}`,
    "",
    "หมายเหตุ: AI ช่วยซักประวัติและสรุปข้อมูลเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ ต้องมี staff review ก่อนทุกครั้ง",
  ].join("\n");
}

function icon(name) {
  const paths = {
    send: '<path d="M4 12 20 4l-4 16-3-7-9-1Z"/><path d="m13 13 7-9"/>',
    stop: '<rect x="7" y="7" width="10" height="10" rx="2"/>',
    mic: '<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/><path d="M8 22h8"/>',
    shield: '<path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
    reset: '<path d="M4 4v6h6"/><path d="M20 20v-6h-6"/><path d="M20 9A8 8 0 0 0 6 5l-2 5"/><path d="M4 15a8 8 0 0 0 14 4l2-5"/>',
    line: '<path d="M5 5h14v10H9l-4 4V5Z"/><path d="M8 9h.01"/><path d="M12 9h.01"/><path d="M16 9h.01"/>',
    hospital: '<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-7h6v7"/><path d="M10 8h4"/><path d="M12 6v4"/>',
  };

  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.check}</svg>`;
}

function render() {
  const sample = sampleCases[state.caseId];
  root.innerHTML = `
    <div class="app-shell chat-app-shell">
      <header class="topbar chat-topbar">
        <div class="brand-lockup">
          <div class="brand-mark">${icon("hospital")}</div>
          <div>
            <h1>หมอพร้อม</h1>
            <p>AI ซักประวัติเบื้องต้นก่อนพบเจ้าหน้าที่</p>
          </div>
        </div>
        <div class="topbar-actions">
          <span class="service-chip">LINE OA connected</span>
        </div>
      </header>

      <main class="workspace patient-workspace chat-only-workspace">
        ${renderPatientWorkspace(sample)}
      </main>
    </div>
  `;

  bindEvents();
  keepChatAtLatestMessage();
}

function keepChatAtLatestMessage() {
  requestAnimationFrame(() => {
    const chatLog = root.querySelector(".chat-log");
    if (chatLog) {
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  });
}

function renderRoleSwitch() {
  return `
    <div class="role-switch" aria-label="Role view">
      <button class="${activeView === "patient" ? "selected" : ""}" data-action="view" data-view="patient">
        ${icon("line")}
        Patient app
      </button>
      <button class="${activeView === "staff" ? "selected" : ""}" data-action="view" data-view="staff">
        ${icon("hospital")}
        Staff console
      </button>
    </div>
  `;
}

function renderPatientWorkspace(sample) {
  return `
    ${renderPatientPanel(sample)}
  `;
}

function renderStaffWorkspace(sample) {
  return `
    ${renderStaffQueuePanel(sample)}
    <div class="staff-main">
      ${renderPipelinePanel()}
      ${renderStaffPanel()}
    </div>
  `;
}

function renderPatientPanel(sample) {
  return `
    <section class="panel patient-panel chat-phone" aria-labelledby="patient-title">
      <div class="chat-appbar">
        <div>
          <span>หมอพร้อม AI</span>
          <h2 id="patient-title">ซักประวัติก่อนพบเจ้าหน้าที่</h2>
        </div>
        <div class="chat-channel-pill">${icon("line")} ${channelLabels[state.channel]}</div>
      </div>

      <div class="chat-consent-card">
        <div class="consent-icon">${icon("check")}</div>
        <div>
          <strong>ยืนยันตัวตนแล้ว</strong>
          <span>ยินยอมให้ใช้ข้อมูลเพื่อซักประวัติเบื้องต้น</span>
        </div>
      </div>

      <div class="chat-log" aria-live="polite">
        ${state.transcript.map((message) => `
          <div class="message ${message.role}">
            <span>${message.role === "bot" ? "AI" : "ผู้ป่วย"}</span>
            <p>${escapeHtml(message.text)}</p>
          </div>
        `).join("")}
        ${state.dialog.thinking ? `
          <div class="message bot thinking">
            <span>AI</span>
            <div class="typing-dots" aria-label="กำลังประมวลผล"><i></i><i></i><i></i></div>
          </div>
        ` : ""}
      </div>

      ${renderComposer()}
    </section>

    ${state.summaryModalOpen ? renderPatientSummaryModal() : ""}
  `;
}

function renderComposer() {
  if (state.dialog.mode === "voice") {
    const recorderLabel = getRecorderLabel();
    const recorderHint = getRecorderHint();
    const recording = state.recorder.status === "recording";
    const checking = state.recorder.status === "checking";
    const waitingForAI = state.dialog.thinking;

    return `
      <div class="voice-recorder ${recording ? "recording" : ""} ${checking ? "checking" : ""} ${state.recorder.status === "error" ? "error" : ""}">
        <button class="mode-switch-button" data-action="set-input-mode" data-mode="text" aria-label="กลับไปพิมพ์ข้อความ">Aa</button>
        <button class="record-button" data-action="${recording ? "stop-recording" : "start-recording"}" aria-label="${recording ? "หยุดและส่งเสียง" : "เริ่มบันทึกเสียง"}" title="${recording ? "หยุดและส่งเสียง" : "เริ่มบันทึกเสียง"}" ${state.dialog.completed || checking || waitingForAI ? "disabled" : ""}>
          ${icon(recording ? "stop" : "mic")}
        </button>
        <div class="recorder-copy" title="${escapeAttribute(recorderHint)}">
          <strong>${recorderLabel}</strong>
          <span>${recorderHint}</span>
        </div>
        <div class="voice-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <div class="recorder-actions">
          <span class="recording-time">${formatElapsed(state.recorder.elapsed)}</span>
        </div>
      </div>
    `;
  }

  return `
    <form class="composer chat-composer" data-action="compose">
      <button class="mode-switch-button" type="button" data-action="set-input-mode" data-mode="voice" aria-label="เปลี่ยนเป็นโหมดเสียง" ${state.dialog.thinking ? "disabled" : ""}>${icon("mic")}</button>
      <input name="message" value="${escapeAttribute(state.inputDraft)}" placeholder="พิมพ์คำตอบของคุณ..." autocomplete="off" ${state.dialog.thinking ? "disabled" : ""} />
      <button class="send-button" type="submit" aria-label="ส่งข้อความ" ${state.dialog.thinking ? "disabled" : ""}>${icon("send")}</button>
    </form>
  `;
}

function getRecorderLabel() {
  if (state.dialog.completed) return "ซักประวัติด้วยเสียงเสร็จแล้ว";
  if (state.dialog.thinking) return "กำลังประมวลผลคำตอบ";
  if (state.recorder.status === "checking") return "กำลังเปิดไมโครโฟน";
  if (state.recorder.status === "recording") return "กำลังบันทึกเสียงของคุณ";
  if (state.recorder.status === "error") return "เปิดไมโครโฟนไม่ได้";
  return "กดไมโครโฟนเพื่อพูดคำตอบ";
}

function getRecorderHint() {
  if (state.dialog.completed) return "สามารถเปลี่ยนกลับไปพิมพ์ข้อความได้";
  if (state.dialog.thinking) return "กรุณารอสักครู่ ระบบกำลังตอบกลับ";
  if (state.recorder.status === "checking") return "หากมีหน้าต่างขอสิทธิ์ กรุณาอนุญาตการใช้ไมโครโฟน";
  if (state.recorder.status === "recording") return "พูดคำตอบให้ครบ แล้วกดหยุดเพื่อส่ง";
  if (state.recorder.status === "error") return "กรุณาตรวจสอบสิทธิ์ไมโครโฟนแล้วลองอีกครั้ง";
  return "เสียงจะถูกใช้เพื่อถอดความและส่งต่อให้เจ้าหน้าที่ตรวจทาน";
}

function formatElapsed(seconds) {
  const minute = Math.floor(seconds / 60).toString().padStart(2, "0");
  const second = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minute}:${second}`;
}

function renderChatDemoControls() {
  const script = getDialogScript();
  const progress = state.dialog.active
    ? `${Math.min(state.dialog.stepIndex + 1, script.steps.length)}/${script.steps.length}`
    : "พร้อมเริ่ม";

  return `
    <div class="chat-demo-controls">
      <div>
        <span class="field-label">การซักประวัติ</span>
        <strong>${state.dialog.completed ? "ซักประวัติเสร็จแล้ว" : state.dialog.active ? `กำลังซักประวัติ (${progress})` : "พร้อมเริ่มซักประวัติ"}</strong>
      </div>
      <div class="chat-demo-actions">
        <button class="${state.dialog.active && state.dialog.mode === "text" ? "selected" : ""}" data-action="start-dialog" data-mode="text">ข้อความ</button>
        <button class="${state.dialog.active && state.dialog.mode === "voice" ? "selected" : ""}" data-action="start-dialog" data-mode="voice">${icon("mic")} เสียง</button>
        <button class="primary-mini" data-action="advance-dialog" ${!state.dialog.active || state.dialog.completed ? "disabled" : ""}>ส่งคำตอบ</button>
        <button data-action="open-summary" ${!state.dialog.completed ? "disabled" : ""}>ดูสรุป</button>
      </div>
    </div>
  `;
}

function renderPatientSummaryModal() {
  const fields = state.fields;
  const emergency = state.risk.level === "critical";

  return `
    <div class="summary-backdrop" role="presentation">
      <section class="summary-modal" role="dialog" aria-modal="true" aria-labelledby="patient-summary-title">
        <div class="summary-header">
          <div>
            <h2 id="patient-summary-title">สรุปข้อมูลก่อนส่งให้เจ้าหน้าที่</h2>
            <p>กรุณาตรวจทาน หากข้อมูลไม่ถูกต้องสามารถกลับไปตอบเพิ่มได้</p>
          </div>
          <button class="icon-button light" data-action="close-summary" aria-label="ปิดสรุป">×</button>
        </div>

        <div class="summary-status ${emergency ? "critical" : ""}">
          ${emergency ? icon("alert") : icon("shield")}
          <div>
            <strong>${emergency ? "พบอาการที่ควรประเมินเร่งด่วน" : "ไม่พบสัญญาณฉุกเฉินจากคำตอบปัจจุบัน"}</strong>
            <span>${emergency ? "หากอาการรุนแรง กรุณาติดต่อ 1669 หรือไปห้องฉุกเฉินทันที" : "ข้อมูลนี้จะถูกส่งให้เจ้าหน้าที่ตรวจทาน ไม่ใช่การวินิจฉัย"}</span>
          </div>
        </div>

        <div class="summary-grid">
          <div>
            <span>อาการหลัก</span>
            <strong>${fields.chiefComplaint || "ยังไม่ระบุ"}</strong>
          </div>
          <div>
            <span>ระยะเวลา / ความรุนแรง</span>
            <strong>${[fields.duration, fields.severity].filter(Boolean).join(" · ") || "ยังไม่ระบุ"}</strong>
          </div>
          <div>
            <span>แพ้ยา / ยาประจำ</span>
            <strong>${[fields.allergies, fields.medications].filter(Boolean).join(" · ") || "ยังไม่ระบุ"}</strong>
          </div>
          <div>
            <span>โรคประจำตัว / การรักษาล่าสุด</span>
            <strong>${[fields.conditions, fields.recentCare].filter(Boolean).join(" · ") || "ยังไม่ระบุ"}</strong>
          </div>
          <div class="wide">
            <span>ข้อมูลส่งต่อที่ผู้ป่วยเห็น</span>
            <strong>ระบบจะส่งข้อมูลให้เจ้าหน้าที่ตรวจทาน และแนะนำจุดบริการที่เหมาะสมต่อไป</strong>
          </div>
        </div>

        <div class="summary-actions">
          <button data-action="close-summary">กลับไปแก้ไข/ตอบเพิ่ม</button>
          <button class="primary" data-action="confirm-summary">${icon("check")} ยืนยันสรุปเพื่อให้เจ้าหน้าที่ตรวจทาน</button>
        </div>
      </section>
    </div>
  `;
}

function renderDemoControls(sample) {
  return `
    <div class="demo-controls">
      <div class="panel-heading compact">
        <div>
          <h2>กรณีการใช้งาน</h2>
          <p>${sample.description}</p>
        </div>
      </div>
      <div class="scenario-grid" aria-label="กรณีการใช้งาน">
        ${Object.entries(sampleCases).map(([id, item]) => `
          <button class="scenario ${state.caseId === id ? "selected" : ""}" data-action="scenario" data-scenario="${id}">
            <strong>${item.label}</strong>
            <span>${item.description}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderPatientStatusPanel(sample) {
  const emergency = state.risk.level === "critical";
  const missingText = state.missingFields.map(([, label]) => label).join(", ") || "ข้อมูลครบสำหรับส่งให้เจ้าหน้าที่ตรวจทาน";
  return `
    <aside class="panel patient-status-panel" aria-labelledby="patient-status-title">
      <div class="panel-heading">
        <div>
          <h2 id="patient-status-title">Visit Status</h2>
          <p>สถานะที่ผู้ป่วยเห็น ไม่แสดง SOAP หรือ staff decision</p>
        </div>
        <span class="completion">${state.completion}%</span>
      </div>

      <div class="patient-next-step ${emergency ? "critical" : ""}">
        ${emergency ? icon("alert") : icon("shield")}
        <div>
          <strong>${emergency ? "ควรติดต่อฉุกเฉินทันที" : state.reviewStatus === "approved" ? "เจ้าหน้าที่ส่งต่อข้อมูลแล้ว" : "รอเจ้าหน้าที่ตรวจทาน"}</strong>
          <span>${emergency ? "หากมีอาการรุนแรง กรุณาโทร 1669 หรือไปห้องฉุกเฉินใกล้ที่สุด" : state.reviewStatus === "approved" ? `ระบบแจ้งเตือนผ่าน ${channelLabels[state.channel]} แล้ว` : "ระบบกำลังเตรียมข้อมูลก่อนเข้ารับบริการ OPD"}</span>
        </div>
      </div>

      <div class="patient-progress">
        ${state.pipeline.slice(0, 5).map((stage) => `
          <div class="${stage.status}">
            <span>${stage.name}</span>
            <strong>${stage.status === "done" ? "เสร็จแล้ว" : stage.status === "active" ? "กำลังทำ" : stage.status === "blocked" ? "เร่งด่วน" : "รอ"}</strong>
          </div>
        `).join("")}
      </div>

      <div class="patient-missing">
        <span class="field-label">ข้อมูลที่ยังต้องถาม</span>
        <p>${missingText}</p>
      </div>

      ${renderDemoControls(sample)}
    </aside>
  `;
}

function renderPipelinePanel() {
  const completedCount = state.pipeline.filter((stage) => stage.status === "done").length;
  return `
    <section class="panel pipeline-panel" aria-labelledby="pipeline-title">
      <div class="panel-heading">
        <div>
          <h2 id="pipeline-title">Clinical Pipeline</h2>
          <p>Shared backend for Mor Prom, LINE OA, text, and voice</p>
        </div>
        <span class="completion">${state.completion}% complete</span>
      </div>

      <div class="kpi-row">
        <div>
          <span>Fields</span>
          <strong>${requiredFields.length - state.missingFields.length}/${requiredFields.length}</strong>
        </div>
        <div>
          <span>Review</span>
          <strong>${state.reviewStatus === "approved" ? "Approved" : "Required"}</strong>
        </div>
        <div>
          <span>Handoff</span>
          <strong>${state.reviewStatus === "approved" ? "Ready" : "Locked"}</strong>
        </div>
      </div>

      <ol class="stage-list">
        ${state.pipeline.map((stage, index) => `
          <li class="${stage.status}">
            <span class="stage-index">${index + 1}</span>
            <div>
              <strong>${stage.name}</strong>
              <p>${stage.detail}</p>
            </div>
          </li>
        `).join("")}
      </ol>

      <div class="azure-map">
        <h3>Azure architecture</h3>
        ${[
          ["Static Web Apps", "หมอพร้อม UI + staff dashboard"],
          ["Azure Functions", "LINE OA webhook + session orchestrator"],
          ["Azure OpenAI", "questioning, extraction, summary draft"],
          ["Azure AI Search", "department guideline / RAG knowledge base"],
          ["Azure AI Speech", "Thai STT/TTS voicebot"],
          ["Cosmos DB / SQL", "session state, audit log, review status"],
          ["Entra ID + Monitor", "staff auth, audit, latency and escalation metrics"],
        ].map(([name, detail]) => `
          <div class="azure-row">
            <strong>${name}</strong>
            <span>${detail}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderStaffPanel() {
  const department = state.department;
  return `
    <section class="panel staff-panel" aria-labelledby="staff-title">
      <div class="panel-heading">
        <div>
          <h2 id="staff-title">Staff Review</h2>
          <p>Nurse/doctor approval is required before handoff</p>
        </div>
        <span class="status-pill ${state.reviewStatus}">${state.reviewStatus === "approved" ? "Approved" : "Waiting"}</span>
      </div>

      <div class="risk-callout ${state.risk.level}">
        ${state.risk.level === "routine" ? icon("shield") : icon("alert")}
        <div>
          <strong>${state.risk.label}</strong>
          <span>${state.risk.description}</span>
        </div>
      </div>

      <div class="department-card ${department.color}">
        <span>Suggested department</span>
        <strong>${department.name}</strong>
        <p>${department.reason}</p>
        <div class="confidence" style="--confidence:${department.confidence}%">
          <i></i>
          <span>${department.confidence}%</span>
        </div>
      </div>

      <div class="field-table">
        ${requiredFields.map(([key, label]) => `
          <div class="${state.fields[key] ? "" : "missing"}">
            <span>${label}</span>
            <strong>${state.fields[key] || "ต้องถามเพิ่ม"}</strong>
          </div>
        `).join("")}
      </div>

      <label class="summary-editor">
        <span>SOAP / Referral handoff draft</span>
        <textarea data-action="summary" rows="12">${escapeHtml(state.summary)}</textarea>
      </label>

      <div class="review-actions">
        <button class="primary" data-action="approve" ${state.reviewStatus === "approved" ? "disabled" : ""}>
          ${icon("check")} ${state.reviewStatus === "approved" ? "Handoff approved" : "Approve handoff"}
        </button>
        <button data-action="request-edit">${icon("edit")} Request edit</button>
        <button class="ghost" data-action="reset">${icon("reset")} Reset</button>
      </div>

      <div class="audit-log">
        <h3>Audit trail</h3>
        ${state.audit.map((item) => `<p>${item}</p>`).join("")}
        ${state.approvedAt ? `<p>อนุมัติเมื่อ ${state.approvedAt}</p>` : ""}
      </div>
    </section>
  `;
}

function renderStaffQueuePanel(sample) {
  return `
    <aside class="panel staff-queue-panel" aria-labelledby="queue-title">
      <div class="panel-heading">
        <div>
          <h2 id="queue-title">Staff Console</h2>
          <p>สิ่งที่พยาบาล/เจ้าหน้าที่เห็นเท่านั้น</p>
        </div>
        <span class="risk-badge ${state.risk.level}">${state.risk.label}</span>
      </div>

      <div class="staff-patient-card">
        <span class="field-label">Selected patient</span>
        <strong>${state.identity.name}</strong>
        <p>${state.identity.age} · ${state.identity.sex} · ${channelLabels[state.channel]} · ${state.identity.contact}</p>
      </div>

      ${renderDemoControls(sample)}

      <div class="transcript-card">
        <div class="panel-heading compact">
          <div>
            <h2>Transcript</h2>
            <p>Read-only conversation record</p>
          </div>
        </div>
        <div class="transcript-list">
          ${state.transcript.map((message) => `
            <div class="${message.role}">
              <span>${message.role === "bot" ? "AI Bot" : "Patient"}</span>
              <p>${escapeHtml(message.text)}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="service-stack">
        <span class="service-chip">Azure OpenAI</span>
        <span class="service-chip">AI Search</span>
        <span class="service-chip">Speech STT/TTS</span>
      </div>
    </aside>
  `;
}

function bindEvents() {
  root.querySelectorAll("[data-action='view']").forEach((button) => {
    button.addEventListener("click", () => {
      activeView = button.dataset.view;
      render();
    });
  });

  root.querySelectorAll("[data-action='scenario']").forEach((button) => {
    button.addEventListener("click", () => {
      state = createState(button.dataset.scenario);
      render();
    });
  });

  root.querySelectorAll("[data-action='channel']").forEach((button) => {
    button.addEventListener("click", () => {
      updateState({
        channel: button.dataset.channel,
        audit: [`เปลี่ยนช่องทางเป็น ${channelLabels[button.dataset.channel]}`, ...state.audit],
      });
    });
  });

  root.querySelectorAll("[data-action='set-input-mode']").forEach((button) => {
    button.addEventListener("click", () => {
      setInputMode(button.dataset.mode);
    });
  });

  root.querySelectorAll("[data-action='start-dialog']").forEach((button) => {
    button.addEventListener("click", () => {
      startMockDialog(button.dataset.mode);
    });
  });

  root.querySelector("[data-action='advance-dialog']")?.addEventListener("click", () => {
    advanceMockDialog();
  });

  root.querySelectorAll("[data-action='open-summary']").forEach((button) => {
    button.addEventListener("click", () => {
      updateState({ summaryModalOpen: true });
    });
  });

  root.querySelectorAll("[data-action='close-summary']").forEach((button) => {
    button.addEventListener("click", () => {
      updateState({ summaryModalOpen: false });
    });
  });

  root.querySelector("[data-action='confirm-summary']")?.addEventListener("click", () => {
    updateState({
      summaryModalOpen: false,
      audit: ["ผู้ป่วยยืนยันสรุปข้อมูลก่อนส่งให้เจ้าหน้าที่ตรวจทาน", ...state.audit],
    });
  });

  root.querySelectorAll("[data-action='start-recording']").forEach((button) => {
    button.addEventListener("click", () => {
      startVoiceRecording();
    });
  });

  root.querySelectorAll("[data-action='stop-recording']").forEach((button) => {
    button.addEventListener("click", () => {
      stopVoiceRecording();
    });
  });

  root.querySelector("[data-action='submit-recording']")?.addEventListener("click", () => {
    submitVoiceRecording();
  });

  root.querySelector("[data-action='discard-recording']")?.addEventListener("click", () => {
    resetRecorder();
  });

  const compose = root.querySelector("[data-action='compose']");
  compose?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.dialog.thinking) return;

    const input = compose.elements.message;
    const text = input.value.trim();

    if (state.dialog.completed) {
      updateState({ summaryModalOpen: true });
      return;
    }

    if (state.dialog.active) {
      submitScriptedTurn(text || undefined);
      return;
    }

    if (!text) return;
    handlePatientMessage(text);
  });

  root.querySelector("[data-action='voice']")?.addEventListener("click", () => {
    startVoiceRecording();
  });

  root.querySelector("[data-action='reset']")?.addEventListener("click", () => {
    state = createState(state.caseId);
    render();
  });

  root.querySelector("[data-action='legacy-voice']")?.addEventListener("click", () => {
    const text = "ข้อความจากเสียงผู้ป่วย: เวียนศีรษะตั้งแต่เช้า ไม่ได้หมดสติ แพ้ยา penicillin";
    updateState({
      voiceMode: true,
      transcript: [
        ...state.transcript,
        { role: "patient", text },
        { role: "bot", text: "รับข้อมูลเสียงแล้วค่ะ ระบบถอดเสียงและเพิ่มในสรุปให้เจ้าหน้าที่ตรวจทาน" },
      ],
      fields: {
        ...state.fields,
        chiefComplaint: state.fields.chiefComplaint || "เวียนศีรษะ",
        duration: state.fields.duration || "ตั้งแต่เช้า",
        allergies: state.fields.allergies || "แพ้ penicillin",
      },
      audit: ["Azure Speech ถอดเสียงสำเร็จ", ...state.audit],
    });
  });

  root.querySelector("[data-action='summary']")?.addEventListener("input", (event) => {
    state = {
      ...state,
      summary: event.target.value,
      staffEdited: true,
    };
  });

  root.querySelector("[data-action='approve']")?.addEventListener("click", () => {
    if (state.reviewStatus === "approved") return;
    updateState({
      reviewStatus: "approved",
      approvedAt: new Date().toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      audit: [
        `Staff approved ${state.department.name} handoff`,
        "สร้าง FHIR Encounter + LINE/Mor Prom notification แล้ว",
        ...state.audit,
      ],
    });
  });

  root.querySelector("[data-action='request-edit']")?.addEventListener("click", () => {
    const question = nextQuestion(state.missingFields);
    updateState({
      reviewStatus: "waiting",
      transcript: [
        ...state.transcript,
        { role: "bot", text: question },
      ],
      audit: ["เจ้าหน้าที่ขอข้อมูลเพิ่มเติมจากผู้ป่วย", ...state.audit],
    });
  });

}

function emptyIntakeFields() {
  return Object.fromEntries(requiredFields.map(([key]) => [key, ""]));
}

function getDialogScript(mode = state?.dialog?.mode || "text") {
  return triageScripts[mode] || triageScripts.text;
}

function clearPendingResponse() {
  responseToken += 1;
  window.clearTimeout(responseTimer);
  responseTimer = null;
}

function stopBotAudio() {
  if (!botAudio) return;

  botAudio.pause();
  botAudio.currentTime = 0;
  botAudio = null;
}

function setInputMode(mode) {
  clearPendingResponse();
  stopBotAudio();

  if (mode === "text") {
    cleanupVoiceCapture({ releaseStream: true });
  }
  startDialog(mode);

  if (mode === "voice") {
    ensureVoiceSessionStream();
  }
}

function defaultRecorderState() {
  return {
    status: "idle",
    elapsed: 0,
    hasAudio: false,
    error: "",
    isFallback: false,
    deviceStatus: "unknown",
    deviceLabel: "",
    deviceCount: 0,
  };
}

function hasActiveVoiceStream() {
  return Boolean(voiceStream?.getAudioTracks().some((track) => track.readyState === "live"));
}

async function ensureVoiceSessionStream() {
  if (hasActiveVoiceStream()) return voiceStream;
  if (voiceStreamPromise) return voiceStreamPromise;

  if (!navigator.mediaDevices?.getUserMedia) {
    updateState({
      recorder: {
        ...state.recorder,
        status: "error",
        error: "กรุณาเปิดด้วยเบราว์เซอร์ที่รองรับไมโครโฟน",
      },
    });
    return null;
  }

  const sessionId = ++voiceSessionId;
  updateState({
    recorder: {
      ...state.recorder,
      status: "checking",
      elapsed: 0,
      hasAudio: false,
      error: "",
    },
  });

  voiceStreamPromise = navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      if (sessionId !== voiceSessionId || state.dialog.mode !== "voice") {
        stream.getTracks().forEach((track) => track.stop());
        return null;
      }

      voiceStream = stream;
      voiceStream.getAudioTracks().forEach((track) => {
        track.addEventListener("ended", () => {
          if (state.dialog.mode !== "voice") return;
          updateState({
            recorder: {
              ...state.recorder,
              status: "error",
              error: "ไมโครโฟนหยุดทำงาน กรุณาเปิดใหม่อีกครั้ง",
            },
          });
        }, { once: true });
      });

      updateState({
        recorder: {
          ...state.recorder,
          status: "idle",
          elapsed: 0,
          hasAudio: false,
          error: "",
        },
      });
      return voiceStream;
    })
    .catch((error) => {
      if (sessionId !== voiceSessionId || state.dialog.mode !== "voice") {
        return null;
      }

      const micError = microphoneErrorInfo(error);
      updateState({
        recorder: {
          ...state.recorder,
          status: "error",
          hasAudio: false,
          error: micError.error,
        },
      });
      return null;
    })
    .finally(() => {
      voiceStreamPromise = null;
    });

  return voiceStreamPromise;
}

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);
}

async function checkMicrophoneAvailability() {
  if (state.dialog.mode !== "voice" || state.recorder.status === "recording" || state.recorder.status === "checking") {
    return;
  }

  if (!navigator.mediaDevices?.enumerateDevices) {
    updateState({
      recorder: {
        ...state.recorder,
        status: "error",
        deviceStatus: "unsupported",
        deviceCount: 0,
        deviceLabel: "",
        error: "เบราว์เซอร์ไม่เปิดให้ตรวจไมค์จากหน้านี้",
      },
    });
    return;
  }

  updateState({
    recorder: {
      ...state.recorder,
      status: "idle",
      deviceStatus: "checking",
      error: "กำลังค้นหา audio input ในเครื่อง",
    },
  });

  try {
    const devices = await withTimeout(
      navigator.mediaDevices.enumerateDevices(),
      1500,
      "enumerate-timeout",
    );
    if (state.dialog.mode !== "voice" || state.recorder.status === "recording") return;

    const audioInputs = devices.filter((device) => device.kind === "audioinput");
    if (!audioInputs.length) {
      updateState({
        recorder: {
          ...state.recorder,
          status: "error",
          deviceStatus: "missing",
          deviceCount: 0,
          deviceLabel: "",
          error: "ระบบไม่เห็นไมโครโฟน/audio input ที่เชื่อมต่ออยู่",
        },
      });
      return;
    }

    const labeledInput = audioInputs.find((device) => device.label);
    updateState({
      recorder: {
        ...state.recorder,
        status: "idle",
        deviceStatus: "available",
        deviceCount: audioInputs.length,
        deviceLabel: labeledInput?.label || "",
        error: labeledInput?.label
          ? `พร้อมทดสอบเสียงจาก ${labeledInput.label}`
          : "พบอุปกรณ์แล้ว ชื่อไมค์จะแสดงหลังอนุญาต permission",
      },
    });
  } catch (error) {
    updateState({
      recorder: {
        ...state.recorder,
        status: "idle",
        deviceStatus: "unknown",
        deviceCount: 0,
        deviceLabel: "",
        error: "ตรวจรายชื่อไมค์ไม่ได้ ให้กดปุ่มไมค์เพื่อทดสอบ permission โดยตรง",
      },
    });
  }
}

function microphoneErrorInfo(error) {
  const name = error?.name || error?.message || "";

  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return {
      deviceStatus: "missing",
      error: "ไม่พบไมโครโฟนที่เชื่อมต่ออยู่ หรือ input device ถูกปิดในระบบ",
    };
  }

  if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
    return {
      deviceStatus: "blocked",
      error: "สิทธิ์ไมโครโฟนถูกบล็อก ให้กด Allow หรือปลดบล็อกใน browser permission",
    };
  }

  if (name === "NotReadableError" || name === "TrackStartError") {
    return {
      deviceStatus: "busy",
      error: "พบไมค์แล้วแต่เปิดใช้ไม่ได้ อาจถูกใช้โดยแอปอื่นหรือระบบปฏิบัติการบล็อกไว้",
    };
  }

  if (name === "browser-no-media") {
    return {
      deviceStatus: "unsupported",
      error: "เบราว์เซอร์หรือหน้านี้ยังไม่รองรับการขอใช้ไมโครโฟน",
    };
  }

  return {
    deviceStatus: "unknown",
    error: "ทดสอบไมค์ไม่สำเร็จ ลองเช็ก browser permission และ default input device",
  };
}

function setVoiceWaveLevel(level) {
  const bars = root.querySelectorAll(".voice-wave i");
  if (!bars.length) return;

  const safeLevel = Math.max(0, Math.min(1, Number.isFinite(level) ? level : 0));
  const pattern = [0.35, 0.72, 1, 0.78, 0.45];

  bars.forEach((bar, index) => {
    const height = Math.round(6 + safeLevel * 22 * pattern[index]);
    bar.style.height = `${height}px`;
    bar.style.opacity = safeLevel > 0.05 ? String(Math.min(1, 0.34 + safeLevel)) : "0.28";
  });
}

function startVoiceLevelMeter(stream) {
  stopVoiceLevelMeter();

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    setVoiceWaveLevel(0);
    return;
  }

  try {
    voiceAudioContext = new AudioContextConstructor();
    voiceAudioSource = voiceAudioContext.createMediaStreamSource(stream);
    voiceAnalyser = voiceAudioContext.createAnalyser();
    voiceAnalyser.fftSize = 256;
    voiceAudioSource.connect(voiceAnalyser);
    voiceLevelBuffer = new Uint8Array(voiceAnalyser.fftSize);
    smoothedVoiceLevel = 0;

    if (voiceAudioContext.state === "suspended") {
      voiceAudioContext.resume().catch(() => {});
    }

    const tick = () => {
      if (!voiceAnalyser || !voiceLevelBuffer) return;

      voiceAnalyser.getByteTimeDomainData(voiceLevelBuffer);
      let sum = 0;
      for (const value of voiceLevelBuffer) {
        const centered = (value - 128) / 128;
        sum += centered * centered;
      }

      const rms = Math.sqrt(sum / voiceLevelBuffer.length);
      const gatedLevel = Math.max(0, Math.min(1, (rms - 0.035) / 0.18));
      smoothedVoiceLevel = smoothedVoiceLevel * 0.72 + gatedLevel * 0.28;
      if (smoothedVoiceLevel < 0.04) smoothedVoiceLevel = 0;
      setVoiceWaveLevel(smoothedVoiceLevel);
      voiceLevelFrame = window.requestAnimationFrame(tick);
    };

    tick();
  } catch {
    stopVoiceLevelMeter();
    setVoiceWaveLevel(0);
  }
}

function stopVoiceLevelMeter() {
  if (voiceLevelFrame) {
    window.cancelAnimationFrame(voiceLevelFrame);
    voiceLevelFrame = null;
  }

  try {
    voiceAudioSource?.disconnect();
    voiceAnalyser?.disconnect();
  } catch {
    // Some browsers disconnect automatically when tracks stop.
  }

  if (voiceAudioContext && voiceAudioContext.state !== "closed") {
    voiceAudioContext.close().catch(() => {});
  }

  voiceAudioContext = null;
  voiceAudioSource = null;
  voiceAnalyser = null;
  voiceLevelBuffer = null;
  smoothedVoiceLevel = 0;
  setVoiceWaveLevel(0);
}

async function startVoiceRecording() {
  if (state.dialog.completed || state.dialog.thinking) return;

  if (!state.dialog.active || state.dialog.mode !== "voice") {
    startDialog("voice");
    await ensureVoiceSessionStream();
    return;
  }

  cleanupVoiceCapture();
  voiceChunks = [];
  const captureId = ++voiceCaptureId;

  try {
    const stream = await ensureVoiceSessionStream();
    if (!stream || captureId !== voiceCaptureId || state.dialog.mode !== "voice") {
      return;
    }

    startVoiceLevelMeter(stream);
    const audioTracks = stream.getAudioTracks();
    const activeTrack = audioTracks[0];

    if (typeof MediaRecorder !== "undefined") {
      voiceRecorder = new MediaRecorder(stream);
      voiceRecorder.addEventListener("dataavailable", (event) => {
        if (event.data?.size) voiceChunks.push(event.data);
      });
      voiceRecorder.start();
    }

    const startedAt = Date.now();
    voiceTimer = window.setInterval(() => {
      const elapsed = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
      state = {
        ...state,
        recorder: {
          ...state.recorder,
          elapsed,
        },
      };
      render();
    }, 1000);

    updateState({
      voiceMode: true,
      recorder: {
        ...state.recorder,
        status: "recording",
        hasAudio: false,
        error: "",
        isFallback: false,
        deviceStatus: "active",
        deviceLabel: activeTrack?.label || "",
        deviceCount: audioTracks.length,
      },
    });
  } catch (error) {
    if (captureId !== voiceCaptureId) return;
    const micError = microphoneErrorInfo(error);
    window.clearInterval(voiceTimer);
    voiceTimer = null;
    stopVoiceLevelMeter();
    voiceRecorder = null;
    voiceChunks = [];

    updateState({
      voiceMode: true,
      recorder: {
        ...state.recorder,
        status: "error",
        hasAudio: false,
        error: micError.error,
        isFallback: false,
        deviceStatus: micError.deviceStatus,
        deviceLabel: "",
      },
    });
  }
}

function stopVoiceRecording() {
  if (state.recorder.status !== "recording") return;
  finishVoiceRecording();
}

function submitVoiceRecording() {
  finishVoiceRecording();
}

function finishVoiceRecording() {
  cleanupVoiceCapture();
  submitScriptedTurn(undefined, { recorder: defaultRecorderState() });
}

function resetRecorder() {
  cleanupVoiceCapture();
  updateState({ recorder: defaultRecorderState() });
}

function cleanupVoiceCapture({ releaseStream = false } = {}) {
  voiceCaptureId += 1;
  window.clearInterval(voiceTimer);
  voiceTimer = null;
  stopVoiceLevelMeter();

  if (voiceRecorder?.state === "recording") {
    try {
      voiceRecorder.stop();
    } catch {
      // The recorder may already be stopping in some browsers.
    }
  }

  if (releaseStream) {
    releaseVoiceSession();
  }

  voiceRecorder = null;
  voiceChunks = [];
}

function releaseVoiceSession() {
  voiceSessionId += 1;
  voiceStreamPromise = null;
  stopVoiceTracks();
}

function stopVoiceTracks() {
  voiceStream?.getTracks().forEach((track) => track.stop());
  voiceStream = null;
}

function startDialog(mode) {
  const script = getDialogScript(mode);
  updateState({
    fields: emptyIntakeFields(),
    identity: { ...script.identity },
    channel: script.channel || state.channel,
    transcript: [{ role: "bot", text: script.initialBot }],
    voiceMode: mode === "voice",
    staffEdited: false,
    reviewStatus: "waiting",
    approvedAt: "",
    summaryModalOpen: false,
    inputDraft: "",
    recorder: mode === "voice" ? defaultRecorderState() : state.recorder,
    dialog: {
      active: true,
      completed: false,
      mode,
      stepIndex: 0,
      thinking: false,
    },
    audit: [
      `เริ่มการซักประวัติด้วย${mode === "voice" ? "เสียง" : "ข้อความ"}`,
      ...state.audit,
    ],
  });
}

function startMockDialog(mode) {
  clearPendingResponse();
  startDialog(mode);
}

function advanceMockDialog() {
  submitScriptedTurn();
}

function submitScriptedTurn(overridePatientText, extraState = {}) {
  if (!state.dialog.active || state.dialog.completed || state.dialog.thinking) return;

  const script = getDialogScript();
  const step = script.steps[state.dialog.stepIndex];
  if (!step) return;

  clearPendingResponse();
  const patientText = overridePatientText || step.patient;
  const nextFields = {
    ...state.fields,
    ...step.fields,
  };

  const token = ++responseToken;
  updateState({
    ...extraState,
    fields: nextFields,
    inputDraft: "",
    transcript: [
      ...state.transcript,
      { role: "patient", text: patientText },
    ],
    voiceMode: state.dialog.mode === "voice",
    staffEdited: false,
    reviewStatus: "waiting",
    summaryModalOpen: false,
    dialog: {
      ...state.dialog,
      thinking: true,
    },
  });

  responseTimer = window.setTimeout(() => {
    completeScriptedTurn(step, token);
  }, step.thinkingMs || 950);
}

function completeScriptedTurn(step, token) {
  if (token !== responseToken || !state.dialog.thinking) return;

  responseTimer = null;
  if (state.dialog.mode === "voice" && step.audio && step.bot) {
    playBotAudio(step.audio, () => {
      finalizeScriptedTurn(step, token);
    });
    return;
  }

  finalizeScriptedTurn(step, token);
}

function finalizeScriptedTurn(step, token) {
  if (token !== responseToken || !state.dialog.thinking) return;

  const script = getDialogScript();
  const completed = Boolean(step.complete);
  const transcript = step.bot
    ? [...state.transcript, { role: "bot", text: step.bot }]
    : state.transcript;

  updateState({
    transcript,
    voiceMode: state.dialog.mode === "voice",
    staffEdited: false,
    reviewStatus: "waiting",
    summaryModalOpen: completed,
    dialog: {
      ...state.dialog,
      thinking: false,
      completed,
      stepIndex: Math.min(state.dialog.stepIndex + 1, script.steps.length),
    },
    audit: [
      completed
        ? "ซักประวัติครบและแสดงสรุปข้อมูล"
        : "รับคำตอบและถามคำถามถัดไป",
      ...state.audit,
    ],
  });
}

function playBotAudio(src, onDone) {
  stopBotAudio();
  botAudio = new Audio(src);
  let settled = false;
  let maxWaitTimer = null;

  const finish = () => {
    if (settled) return;
    settled = true;
    window.clearTimeout(maxWaitTimer);
    onDone?.();
  };

  botAudio.addEventListener("ended", finish, { once: true });
  botAudio.addEventListener("error", finish, { once: true });
  maxWaitTimer = window.setTimeout(finish, 30000);

  botAudio.play().catch(() => {
    finish();
  });
}

function handlePatientMessage(text) {
  const fields = inferFieldsFromMessage(text, state.fields, state.missingFields);
  const temporary = deriveState({
    ...state,
    fields,
    transcript: [...state.transcript, { role: "patient", text }],
    staffEdited: false,
  });

  const response = buildBotResponse(temporary);
  const readyForSummary = temporary.missingFields.length === 0 || temporary.risk.level === "critical";
  updateState({
    fields,
    transcript: [...temporary.transcript, { role: "bot", text: response }],
    staffEdited: false,
    reviewStatus: "waiting",
    summaryModalOpen: readyForSummary,
    dialog: {
      ...state.dialog,
      active: false,
      completed: readyForSummary,
    },
    audit: ["รับข้อมูลจากผู้ป่วยและประมวลผล pipeline ใหม่", ...state.audit],
  });
}

function inferFieldsFromMessage(text, currentFields, missingFields) {
  const lower = text.toLowerCase();
  const next = { ...currentFields };
  const firstMissing = missingFields[0]?.[0];

  if (!next.chiefComplaint || ["ปวด", "ไข้", "ไอ", "เวียน", "แน่น", "หายใจ"].some((word) => lower.includes(word))) {
    next.chiefComplaint = next.chiefComplaint ? `${next.chiefComplaint}; ${text}` : text;
  }

  if (/(\d+\s*(วัน|ชั่วโมง|นาที|สัปดาห์|เดือน))|ตั้งแต่|เมื่อวาน|วันนี้/.test(lower)) {
    next.duration = text;
  } else if (firstMissing === "duration") {
    next.duration = text;
  }

  if (/([0-9]|สิบ)\/10|รุนแรง|มาก|น้อย|ปานกลาง|เดินได้|เดินไม่ได้/.test(lower)) {
    next.severity = text;
  } else if (firstMissing === "severity") {
    next.severity = text;
  }

  if (lower.includes("แพ้") || firstMissing === "allergies") {
    next.allergies = text;
  }

  if (
    lower.includes("ยาประจำ") ||
    lower.includes("ใช้ยา") ||
    lower.includes("กินยา") ||
    lower.includes("ทานยา") ||
    lower.includes("รับประทาน") ||
    lower.includes("amlodipine") ||
    firstMissing === "medications"
  ) {
    next.medications = text;
  }

  if (lower.includes("โรค") || lower.includes("เบาหวาน") || lower.includes("ความดัน") || firstMissing === "conditions") {
    next.conditions = text;
  }

  if (lower.includes("รักษา") || lower.includes("หาหมอ") || lower.includes("โรงพยาบาล") || firstMissing === "recentCare") {
    next.recentCare = text;
  }

  if (lower.includes("opd") || lower.includes("แผนก") || lower.includes("โรงพยาบาล") || firstMissing === "preferredHospital") {
    next.preferredHospital = text;
  }

  return next;
}

function buildBotResponse(nextState) {
  if (nextState.risk.level === "critical") {
    return "พบอาการ red flag ค่ะ กรุณาติดต่อ 1669 หรือไปห้องฉุกเฉินทันที ระบบจะแจ้ง staff review แบบเร่งด่วน";
  }

  if (nextState.missingFields.length > 0) {
    return nextQuestion(nextState.missingFields);
  }

  return `ข้อมูลครบสำหรับร่างสรุปแล้วค่ะ ระบบแนะนำ ${nextState.department.name} และส่งให้เจ้าหน้าที่ตรวจทานก่อนยืนยัน`;
}

function nextQuestion(missingFields) {
  if (!missingFields.length) {
    return "ข้อมูลครบแล้วค่ะ เจ้าหน้าที่กำลังตรวจทานสรุปก่อนส่งต่อ";
  }

  const [key, label] = missingFields[0];
  const prompts = {
    duration: "อาการนี้เป็นมานานเท่าไรแล้วคะ",
    severity: "ให้คะแนนความรุนแรง 0-10 และยังทำกิจวัตรได้ไหมคะ",
    allergies: "มีประวัติแพ้ยา อาหาร หรือวัคซีนไหมคะ",
    medications: "มียาที่ใช้ประจำหรือยาที่รับประทานเองก่อนมารพ.ไหมคะ",
    conditions: "มีโรคประจำตัวหรือกำลังตั้งครรภ์ไหมคะ",
    recentCare: "ก่อนหน้านี้ได้รับการรักษาหรือพบแพทย์ที่ไหนมาบ้างคะ",
    preferredHospital: "สะดวกไปโรงพยาบาลหรือแผนกใดเป็นพิเศษไหมคะ",
  };

  return prompts[key] || `ขอข้อมูลเพิ่มเติมเรื่อง${label}ค่ะ`;
}

function updateState(partial) {
  state = deriveState({
    ...state,
    ...partial,
  });
  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

render();
