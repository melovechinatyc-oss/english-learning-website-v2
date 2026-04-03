import { Course, Sentence } from "@/types/learning";

type SentenceInput = Omit<Sentence, "_id" | "courseSlug" | "order" | "isPublished">;

export const seedCourses: Course[] = [
  { _id: "course-office-greeting", title: "上班打招呼", slug: "office-greeting", description: "零基础上班族第一课，先会开口问候。", difficulty: "beginner", estimatedMinutes: 12, category: "职场", order: 1, isFeatured: true, isPublished: true },
  { _id: "course-self-introduction", title: "自我介绍", slug: "self-introduction", description: "介绍姓名、岗位和职责。", difficulty: "beginner", estimatedMinutes: 15, category: "职场", order: 2, isFeatured: true, isPublished: true },
  { _id: "course-daily-smalltalk", title: "日常交流", slug: "daily-smalltalk", description: "上班路上、午休、下班常用交流。", difficulty: "beginner", estimatedMinutes: 14, category: "日常", order: 3, isFeatured: true, isPublished: true },
  { _id: "course-phonetics-basic", title: "英语音标入门", slug: "phonetics-basic", description: "元音、辅音与重音入门，适合零基础。", difficulty: "beginner", estimatedMinutes: 20, category: "音标", order: 4, isFeatured: true, isPublished: true },
  { _id: "course-vocabulary-core", title: "上班族核心词汇", slug: "vocabulary-core", description: "从高频词入手，逐步扩大词汇量。", difficulty: "beginner", estimatedMinutes: 18, category: "词汇", order: 5, isFeatured: false, isPublished: true },
  { _id: "course-meeting-basic", title: "会议表达（初级）", slug: "meeting-basic", description: "会前、会中、会后核心句型。", difficulty: "elementary", estimatedMinutes: 18, category: "会议", order: 6, isFeatured: false, isPublished: true },
  { _id: "course-work-collab", title: "同事协作（初级）", slug: "work-collab", description: "请求帮助、分配任务、确认交付。", difficulty: "elementary", estimatedMinutes: 16, category: "协作", order: 7, isFeatured: false, isPublished: true },
  { _id: "course-travel-daily", title: "出差交流（初级）", slug: "travel-daily", description: "机场、酒店、交通全流程。", difficulty: "elementary", estimatedMinutes: 17, category: "旅行", order: 8, isFeatured: false, isPublished: true },
  { _id: "course-email-writing", title: "邮件写作（中级）", slug: "email-writing", description: "清晰、礼貌、可执行的英文邮件。", difficulty: "intermediate", estimatedMinutes: 22, category: "职场写作", order: 9, isFeatured: false, isPublished: true },
  { _id: "course-problem-solving", title: "问题沟通（中级）", slug: "problem-solving", description: "描述问题、定位原因、给出方案。", difficulty: "intermediate", estimatedMinutes: 22, category: "职场沟通", order: 10, isFeatured: false, isPublished: true },
  { _id: "course-presentation-advanced", title: "汇报演讲（高级）", slug: "presentation-advanced", description: "结构化汇报与观点表达。", difficulty: "advanced", estimatedMinutes: 25, category: "演讲", order: 11, isFeatured: false, isPublished: true },
  { _id: "course-negotiation-advanced", title: "商务谈判（高级）", slug: "negotiation-advanced", description: "目标、底线、让步与共识。", difficulty: "advanced", estimatedMinutes: 25, category: "商务", order: 12, isFeatured: false, isPublished: true },
];

function createSentences(
  courseSlug: string,
  baseId: number,
  items: SentenceInput[],
): Sentence[] {
  return items.map((item, index) => ({
    _id: `s${baseId + index}`,
    courseSlug,
    order: index + 1,
    isPublished: true,
    ...item,
  }));
}

export const seedSentences: Sentence[] = [
  ...createSentences("office-greeting", 1, [
    { english: "Good morning. How are you today?", chinese: "早上好，你今天怎么样？", pronunciationCn: "古德 摸宁。好 啊 尤 吐得？", ipa: "/ɡʊd ˈmɔːrnɪŋ/ /haʊ ɑːr juː təˈdeɪ/", tags: ["greeting"] },
    { english: "Nice to see you again.", chinese: "很高兴再次见到你。", pronunciationCn: "奈斯 吐 西 尤 额根。", ipa: "/naɪs tə siː juː əˈɡen/", tags: ["greeting"] },
    { english: "Did you sleep well?", chinese: "你昨晚睡得好吗？", pronunciationCn: "迪德 尤 斯利普 威尔？", ipa: "/dɪd juː sliːp wel/", tags: ["smalltalk"] },
    { english: "Let's have a productive day.", chinese: "让我们高效地过完今天。", pronunciationCn: "莱次 海夫 额 普若达克提夫 得。", ipa: "/lets hæv ə prəˈdʌktɪv deɪ/", tags: ["work"] },
    { english: "See you in the meeting room.", chinese: "会议室见。", pronunciationCn: "西 尤 因 则 密停 如姆。", ipa: "/siː juː ɪn ðə ˈmiːtɪŋ ruːm/", tags: ["meeting"] },
    { english: "Have a great start.", chinese: "祝你开工顺利。", pronunciationCn: "海夫 额 格瑞特 斯达特。", ipa: "/hæv ə ɡreɪt stɑːrt/", tags: ["encourage"] },
  ]),
  ...createSentences("self-introduction", 20, [
    { english: "Hi, I'm Amy from the operations team.", chinese: "你好，我是运营组的 Amy。", pronunciationCn: "嗨，艾姆 埃米 福肉姆 迪 欧派瑞神 提姆。", ipa: "/haɪ aɪm ˈeɪmi frəm ði ˌɑːpəˈreɪʃənz tiːm/", tags: ["intro"] },
    { english: "I joined the company this month.", chinese: "我这个月加入公司。", pronunciationCn: "艾 角因德 则 康帕尼 迪斯 芒斯。", ipa: "/aɪ dʒɔɪnd ðə ˈkʌmpəni ðɪs mʌnθ/", tags: ["intro"] },
    { english: "My role is project assistant.", chinese: "我的岗位是项目助理。", pronunciationCn: "麦 柔 以兹 普若杰克特 额西斯坦特。", ipa: "/maɪ roʊl ɪz ˈprɑːdʒekt əˈsɪstənt/", tags: ["job"] },
    { english: "I focus on schedule tracking.", chinese: "我主要跟进项目进度。", pronunciationCn: "艾 佛口斯 昂 斯凯久 垂克英。", ipa: "/aɪ ˈfoʊkəs ɑːn ˈskedʒuːl ˈtrækɪŋ/", tags: ["job"] },
    { english: "Please call me Amy.", chinese: "请叫我 Amy。", pronunciationCn: "普利兹 考 米 埃米。", ipa: "/pliːz kɔːl mi ˈeɪmi/", tags: ["intro"] },
    { english: "I'm glad to work with you all.", chinese: "很高兴与大家共事。", pronunciationCn: "艾姆 格莱德 吐 沃克 维兹 尤 哦。", ipa: "/aɪm ɡlæd tə wɜːrk wɪð juː ɔːl/", tags: ["intro"] },
  ]),
  ...createSentences("daily-smalltalk", 40, [
    { english: "How was your commute this morning?", chinese: "你今天早上通勤怎么样？", pronunciationCn: "好 沃兹 尤儿 康缪特 迪斯 摸宁？", ipa: "/haʊ wəz jʊr kəˈmjuːt ðɪs ˈmɔːrnɪŋ/", tags: ["daily"] },
    { english: "The weather is nice today.", chinese: "今天天气不错。", pronunciationCn: "则 威泽 以兹 奈斯 吐得。", ipa: "/ðə ˈweðər ɪz naɪs təˈdeɪ/", tags: ["daily"] },
    { english: "What are you having for lunch?", chinese: "你午饭吃什么？", pronunciationCn: "沃特 啊 尤 海文 佛 朗吃？", ipa: "/wʌt ɑːr juː ˈhævɪŋ fɔːr lʌntʃ/", tags: ["daily"] },
    { english: "Do you have plans after work?", chinese: "你下班后有安排吗？", pronunciationCn: "杜 尤 海夫 普兰兹 埃夫特 沃克？", ipa: "/duː juː hæv plænz ˈæftər wɜːrk/", tags: ["daily"] },
    { english: "Let's grab coffee later.", chinese: "我们待会儿去喝咖啡吧。", pronunciationCn: "莱次 格瑞布 考菲 莱特。", ipa: "/lets ɡræb ˈkɔːfi ˈleɪtər/", tags: ["daily"] },
    { english: "Have a relaxing evening.", chinese: "祝你晚上放松愉快。", pronunciationCn: "海夫 额 瑞拉克星 伊夫宁。", ipa: "/hæv ə rɪˈlæksɪŋ ˈiːvnɪŋ/", tags: ["daily"] },
  ]),
  ...createSentences("phonetics-basic", 60, [
    { english: "Ship and sheep are different sounds.", chinese: "ship 和 sheep 发音不同。", pronunciationCn: "西普 安德 希普 啊 迪夫润特 桑兹。", ipa: "/ʃɪp/ vs /ʃiːp/", tags: ["phonetic", "vowel"] },
    { english: "Cat uses /ae/, cut uses /ʌ/.", chinese: "cat 用 /ae/，cut 用 /ʌ/。", pronunciationCn: "凯特 优斯 ae，卡特 优斯 阿。", ipa: "/kæt/ vs /kʌt/", tags: ["phonetic", "vowel"] },
    { english: "Think starts with /θ/, sink starts with /s/.", chinese: "think 是 /θ/，sink 是 /s/。", pronunciationCn: "星克 斯达次 维兹 /θ/，辛克 斯达次 维兹 /s/。", ipa: "/θɪŋk/ vs /sɪŋk/", tags: ["phonetic", "consonant"] },
    { english: "Rice and lice have different first sounds.", chinese: "rice 和 lice 的首音不同。", pronunciationCn: "莱斯 安德 莱斯 海夫 迪夫润特 佛斯特 桑兹。", ipa: "/raɪs/ vs /laɪs/", tags: ["phonetic", "consonant"] },
    { english: "Record as noun and record as verb have different stress.", chinese: "record 名词和动词重音不同。", pronunciationCn: "瑞口德 名词 安德 瑞考德 动词 重音不同。", ipa: "noun /ˈrekərd/, verb /rɪˈkɔːrd/", tags: ["phonetic", "stress"] },
    { english: "Practice IPA for ten minutes every day.", chinese: "每天练十分钟音标。", pronunciationCn: "普瑞克提斯 艾披诶 佛 腾 米妮次 埃芙瑞 得。", ipa: "/ˈpræktɪs aɪ piː eɪ/", tags: ["phonetic", "habit"] },
  ]),
  ...createSentences("vocabulary-core", 80, [
    { english: "agenda, schedule, deadline, priority", chinese: "议程、日程、截止日期、优先级", pronunciationCn: "额简达，斯凯久，得得赖恩，普莱哦瑞提", ipa: "/əˈdʒendə/ /ˈskedʒuːl/ /ˈdedlaɪn/ /praɪˈɔːrəti/", tags: ["vocabulary", "work"] },
    { english: "review, update, confirm, discuss", chinese: "复盘、更新、确认、讨论", pronunciationCn: "瑞维尤，阿普得特，肯佛姆，迪斯卡斯", ipa: "/rɪˈvjuː/ /ˈʌpdeɪt/ /kənˈfɜːrm/ /dɪsˈkʌs/", tags: ["vocabulary", "meeting"] },
    { english: "request, support, issue, solution", chinese: "请求、支持、问题、解决方案", pronunciationCn: "瑞奎斯特，萨坡特，依休，色路申", ipa: "/rɪˈkwest/ /səˈpɔːrt/ /ˈɪʃuː/ /səˈluːʃən/", tags: ["vocabulary", "problem"] },
    { english: "budget, invoice, payment, discount", chinese: "预算、发票、付款、折扣", pronunciationCn: "巴杰特，音沃伊斯，配门特，迪斯康特", ipa: "/ˈbʌdʒɪt/ /ˈɪnvɔɪs/ /ˈpeɪmənt/ /ˈdɪskaʊnt/", tags: ["vocabulary", "business"] },
    { english: "airport, boarding, luggage, reservation", chinese: "机场、登机、行李、预订", pronunciationCn: "艾坡特，波丁，拉给只，瑞泽维神", ipa: "/ˈerpɔːrt/ /ˈbɔːrdɪŋ/ /ˈlʌɡɪdʒ/ /ˌrezərˈveɪʃən/", tags: ["vocabulary", "travel"] },
    { english: "practice, repeat, memorize, improve", chinese: "练习、重复、记忆、提升", pronunciationCn: "普瑞克提斯，瑞皮特，麦莫莱兹，音普如夫", ipa: "/ˈpræktɪs/ /rɪˈpiːt/ /ˈmeməraɪz/ /ɪmˈpruːv/", tags: ["vocabulary", "learning"] },
  ]),
  ...createSentences("meeting-basic", 100, [
    { english: "Let's start with today's agenda.", chinese: "我们从今天的议程开始。", pronunciationCn: "莱次 斯达特 维兹 吐得 额简达。", ipa: "/lets stɑːrt wɪð təˈdeɪz əˈdʒendə/", tags: ["meeting"] },
    { english: "Could you share the latest update?", chinese: "你能分享最新进展吗？", pronunciationCn: "库德 尤 谢尔 则 雷特斯特 阿普得特？", ipa: "/kʊd juː ʃer ðə ˈleɪtɪst ˈʌpdeɪt/", tags: ["meeting"] },
    { english: "I have one quick question.", chinese: "我有一个简短问题。", pronunciationCn: "艾 海夫 万 奎克 奎斯晨。", ipa: "/aɪ hæv wʌn kwɪk ˈkwestʃən/", tags: ["meeting"] },
    { english: "Can we move this to next week?", chinese: "我们可以把这个移到下周吗？", pronunciationCn: "看 维 木夫 迪斯 吐 奈克斯特 维克？", ipa: "/kæn wiː muːv ðɪs tə nekst wiːk/", tags: ["meeting"] },
    { english: "Let's summarize the action items.", chinese: "我们总结一下行动项。", pronunciationCn: "莱次 萨玛莱兹 则 艾克神 艾特姆斯。", ipa: "/lets ˈsʌməraɪz ði ˈækʃən ˈaɪtəmz/", tags: ["meeting"] },
    { english: "Thanks everyone. Meeting adjourned.", chinese: "谢谢大家，会议结束。", pronunciationCn: "三克斯 埃芙瑞万。密停 额角恩德。", ipa: "/θæŋks ˈevriwʌn ˈmiːtɪŋ əˈdʒɜːrnd/", tags: ["meeting"] },
  ]),
  ...createSentences("work-collab", 120, [
    { english: "Could you review this file by 3 p.m.?", chinese: "你能在下午三点前看下这个文件吗？", pronunciationCn: "库德 尤 瑞维尤 迪斯 发优 拜 斯瑞 皮艾姆？", ipa: "/kʊd juː rɪˈvjuː ðɪs faɪl baɪ θriː piː em/", tags: ["collab"] },
    { english: "I'll take responsibility for this task.", chinese: "这个任务我来负责。", pronunciationCn: "艾尔 泰克 瑞斯庞色比利提 佛 迪斯 塔斯克。", ipa: "/aɪl teɪk rɪˌspɑːnsəˈbɪləti fɔːr ðɪs tæsk/", tags: ["collab"] },
    { english: "Let's align on the timeline.", chinese: "我们对齐一下时间计划。", pronunciationCn: "莱次 额莱恩 昂 则 泰姆莱恩。", ipa: "/lets əˈlaɪn ɑːn ðə ˈtaɪmlaɪn/", tags: ["collab"] },
    { english: "Please keep me posted.", chinese: "请持续同步给我。", pronunciationCn: "普利兹 凯普 米 泼斯特德。", ipa: "/pliːz kiːp miː ˈpoʊstɪd/", tags: ["collab"] },
    { english: "I appreciate your support.", chinese: "感谢你的支持。", pronunciationCn: "艾 啊普瑞谢特 尤儿 萨坡特。", ipa: "/aɪ əˈpriːʃieɪt jʊr səˈpɔːrt/", tags: ["collab"] },
    { english: "Let me know if you need help.", chinese: "如果你需要帮助告诉我。", pronunciationCn: "莱特 米 诺 依夫 尤 尼德 海普。", ipa: "/let miː noʊ ɪf juː niːd help/", tags: ["collab"] },
  ]),
  ...createSentences("travel-daily", 140, [
    { english: "Where is the check-in counter?", chinese: "值机柜台在哪里？", pronunciationCn: "维尔 以兹 则 切克因 康特？", ipa: "/wer ɪz ðə tʃek ɪn ˈkaʊntər/", tags: ["travel"] },
    { english: "I have a reservation under Lee.", chinese: "我用 Lee 的名字预订了。", pronunciationCn: "艾 海夫 额 瑞泽维神 安德 李。", ipa: "/aɪ hæv ə ˌrezərˈveɪʃən ˈʌndər liː/", tags: ["travel"] },
    { english: "Could you call a taxi for me?", chinese: "你可以帮我叫出租车吗？", pronunciationCn: "库德 尤 考 额 塔克西 佛 米？", ipa: "/kʊd juː kɔːl ə ˈtæksi fɔːr miː/", tags: ["travel"] },
    { english: "How far is the hotel from here?", chinese: "酒店离这里有多远？", pronunciationCn: "好 发 以兹 则 后太尔 佛肉姆 希尔？", ipa: "/haʊ fɑːr ɪz ðə hoʊˈtel frəm hɪr/", tags: ["travel"] },
    { english: "Please print this document.", chinese: "请打印这份文件。", pronunciationCn: "普利兹 普润特 迪斯 多克优门特。", ipa: "/pliːz prɪnt ðɪs ˈdɑːkjumənt/", tags: ["travel"] },
    { english: "My return flight is tomorrow evening.", chinese: "我明晚返程。", pronunciationCn: "麦 瑞特恩 福来特 以兹 图猫肉 伊夫宁。", ipa: "/maɪ rɪˈtɜːrn flaɪt ɪz təˈmɑːroʊ ˈiːvnɪŋ/", tags: ["travel"] },
  ]),
  ...createSentences("email-writing", 160, [
    { english: "Thank you for your quick response.", chinese: "感谢你的快速回复。", pronunciationCn: "三克尤 佛 尤儿 奎克 瑞斯庞斯。", ipa: "/θæŋk juː fɔːr jʊr kwɪk rɪˈspɑːns/", tags: ["email"] },
    { english: "I'm writing to follow up on our discussion.", chinese: "我写邮件跟进我们的讨论。", pronunciationCn: "艾姆 赖丁 吐 发楼阿普 昂 啊迪斯卡申。", ipa: "/aɪm ˈraɪtɪŋ tə ˈfɑːloʊ ʌp ɑːn aʊr dɪˈskʌʃən/", tags: ["email"] },
    { english: "Please find the attached file.", chinese: "请查收附件。", pronunciationCn: "普利兹 发因德 则 额泰吃特 发优。", ipa: "/pliːz faɪnd ði əˈtætʃt faɪl/", tags: ["email"] },
    { english: "Could you confirm by end of day?", chinese: "你能在今天下班前确认吗？", pronunciationCn: "库德 尤 肯佛姆 拜 恩德 啊夫 得？", ipa: "/kʊd juː kənˈfɜːrm baɪ end əv deɪ/", tags: ["email"] },
    { english: "Let me know if anything is unclear.", chinese: "如有不清楚请告诉我。", pronunciationCn: "莱特 米 诺 依夫 埃尼星 以兹 安克利尔。", ipa: "/let miː noʊ ɪf ˈeniθɪŋ ɪz ʌnˈklɪr/", tags: ["email"] },
    { english: "Best regards, Amy.", chinese: "此致，Amy。", pronunciationCn: "贝斯特 瑞嘎兹，埃米。", ipa: "/best rɪˈɡɑːrdz/", tags: ["email"] },
  ]),
  ...createSentences("problem-solving", 180, [
    { english: "We found an issue in the payment flow.", chinese: "我们在支付流程发现了一个问题。", pronunciationCn: "维 发恩德 安 依休 因 则 配门特 佛楼。", ipa: "/wiː faʊnd ən ˈɪʃuː ɪn ðə ˈpeɪmənt floʊ/", tags: ["problem"] },
    { english: "The root cause is still under investigation.", chinese: "根因还在排查中。", pronunciationCn: "则 鲁特 科兹 以兹 斯蒂尔 安德 因维斯提给神。", ipa: "/ðə ruːt kɔːz ɪz stɪl ˈʌndər ɪnˌvestɪˈɡeɪʃən/", tags: ["problem"] },
    { english: "As a workaround, please refresh and retry.", chinese: "临时方案是刷新后重试。", pronunciationCn: "艾兹 额 沃克额绕恩德，普利兹 瑞佛瑞什 安德 瑞踹。", ipa: "/æz ə ˈwɜːrkəraʊnd pliːz rɪˈfreʃ ænd ˌriːˈtraɪ/", tags: ["problem"] },
    { english: "We expect a fix by tomorrow noon.", chinese: "我们预计明天中午前修复。", pronunciationCn: "维 以克斯派克特 额 菲克斯 拜 图猫肉 努恩。", ipa: "/wiː ɪkˈspekt ə fɪks baɪ təˈmɑːroʊ nuːn/", tags: ["problem"] },
    { english: "I'll keep you updated every two hours.", chinese: "我会每两小时同步一次。", pronunciationCn: "艾尔 凯普 尤 阿普得特德 埃芙瑞 图 啊沃兹。", ipa: "/aɪl kiːp juː ʌpˈdeɪtɪd ˈevri tuː aʊərz/", tags: ["problem"] },
    { english: "Thanks for your patience.", chinese: "感谢你的耐心。", pronunciationCn: "三克斯 佛 尤儿 佩申斯。", ipa: "/θæŋks fɔːr jʊr ˈpeɪʃəns/", tags: ["problem"] },
  ]),
  ...createSentences("presentation-advanced", 200, [
    { english: "Today I'd like to outline our strategy.", chinese: "今天我想概述我们的策略。", pronunciationCn: "吐得 艾德 赖克 吐 奥特莱恩 啊 斯特拉提基。", ipa: "/təˈdeɪ aɪd laɪk tə ˈaʊtlaɪn aʊr ˈstrætədʒi/", tags: ["advanced", "presentation"] },
    { english: "Let's look at the key metrics first.", chinese: "我们先看关键指标。", pronunciationCn: "莱次 卢克 艾特 则 凯 米吹克斯 佛斯特。", ipa: "/lets lʊk æt ðə kiː ˈmetrɪks fɜːrst/", tags: ["advanced", "presentation"] },
    { english: "This trend indicates strong market demand.", chinese: "这个趋势说明市场需求强劲。", pronunciationCn: "迪斯 川德 因德凯茨 斯创 马克特 迪曼德。", ipa: "/ðɪs trend ˈɪndɪkeɪts strɔːŋ ˈmɑːrkɪt dɪˈmænd/", tags: ["advanced", "presentation"] },
    { english: "From a risk perspective, we need a backup plan.", chinese: "从风险角度看，我们需要备选方案。", pronunciationCn: "福肉姆 额 瑞斯克 破斯派克提夫，维 尼德 额 拜克阿普 普兰。", ipa: "/frəm ə rɪsk pərˈspektɪv wiː niːd ə ˈbækʌp plæn/", tags: ["advanced", "presentation"] },
    { english: "I'll walk you through the implementation roadmap.", chinese: "我带你过一遍实施路线图。", pronunciationCn: "艾尔 沃克 尤 斯如 则 因普勒门泰神 柔德麦普。", ipa: "/aɪl wɔːk juː θruː ði ˌɪmpləmenˈteɪʃən ˈroʊdmæp/", tags: ["advanced", "presentation"] },
    { english: "I'm happy to take questions now.", chinese: "现在欢迎提问。", pronunciationCn: "艾姆 哈皮 吐 泰克 奎斯晨斯 瑙。", ipa: "/aɪm ˈhæpi tə teɪk ˈkwestʃənz naʊ/", tags: ["advanced", "presentation"] },
  ]),
  ...createSentences("negotiation-advanced", 220, [
    { english: "Our primary goal is long-term partnership.", chinese: "我们的首要目标是长期合作。", pronunciationCn: "奥尔 派玛瑞 够 以兹 朗特姆 帕特纳希普。", ipa: "/aʊr ˈpraɪmeri ɡoʊl ɪz lɔːŋ tɜːrm ˈpɑːrtnərʃɪp/", tags: ["advanced", "negotiation"] },
    { english: "Let's align on scope and timeline first.", chinese: "我们先对齐范围和时间线。", pronunciationCn: "莱次 额莱恩 昂 斯扣普 安德 泰姆莱恩 佛斯特。", ipa: "/lets əˈlaɪn ɑːn skoʊp ænd ˈtaɪmlaɪn fɜːrst/", tags: ["advanced", "negotiation"] },
    { english: "This offer is beyond our current budget.", chinese: "这个报价超出我们当前预算。", pronunciationCn: "迪斯 奥佛 以兹 比样德 奥尔 科润特 巴杰特。", ipa: "/ðɪs ˈɔːfər ɪz bɪˈjɑːnd aʊr ˈkɜːrənt ˈbʌdʒɪt/", tags: ["advanced", "negotiation"] },
    { english: "Could we explore a phased approach?", chinese: "我们可以考虑分阶段方案吗？", pronunciationCn: "库德 维 依克斯普洛尔 额 菲斯特 额破吃？", ipa: "/kʊd wiː ɪkˈsplɔːr ə feɪzd əˈproʊtʃ/", tags: ["advanced", "negotiation"] },
    { english: "If we adjust volume, can you improve pricing?", chinese: "如果我们调整数量，你们能优化价格吗？", pronunciationCn: "依夫 维 额贾斯特 沃留姆，看 尤 音普如夫 普莱辛？", ipa: "/ɪf wiː əˈdʒʌst ˈvɑːljuːm kæn juː ɪmˈpruːv ˈpraɪsɪŋ/", tags: ["advanced", "negotiation"] },
    { english: "Great, we have a deal.", chinese: "很好，我们达成一致。", pronunciationCn: "格瑞特，维 海夫 额 迪尔。", ipa: "/ɡreɪt wiː hæv ə diːl/", tags: ["advanced", "negotiation"] },
  ]),
];
