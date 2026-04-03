import { highFrequencyMetaMap } from "@/lib/high-frequency-meta";

export type VocabularyItem = {
  english: string;
  chinese: string;
  category: string;
  ipa?: string;
};

export function toWordSlug(word: string) {
  return encodeURIComponent(word.trim().toLowerCase());
}

export function fromWordSlug(slug: string) {
  return decodeURIComponent(slug).trim().toLowerCase();
}

export function findVocabularyItem(word: string) {
  const target = word.trim().toLowerCase();
  return (
    vocabularyItems.find((item) => item.english.trim().toLowerCase() === target) ||
    null
  );
}

export function findWordDetail(word: string) {
  const target = word.trim().toLowerCase();
  const base = findVocabularyItem(target);
  if (base) {
    return {
      english: base.english,
      chinese: base.chinese,
      category: base.category,
      ipa: base.ipa || "",
      source: "manual" as const,
    };
  }
  const hf = highFrequencyMetaMap[target];
  if (hf) {
    return {
      english: hf.word,
      chinese: hf.chinese,
      category: `高频词分级-${hf.level}`,
      ipa: hf.ipa || "",
      source: "high-frequency" as const,
    };
  }
  return null;
}

export const vocabularyItems: VocabularyItem[] = [
  { english: "ability", chinese: "能力", category: "core" },
  { english: "achieve", chinese: "实现", category: "core" },
  { english: "adapt", chinese: "适应", category: "core" },
  { english: "analyze", chinese: "分析", category: "core" },
  { english: "arrange", chinese: "安排", category: "core" },
  { english: "attend", chinese: "参加", category: "work" },
  { english: "balance", chinese: "平衡", category: "core" },
  { english: "benefit", chinese: "收益", category: "business" },
  { english: "budget", chinese: "预算", category: "business" },
  { english: "candidate", chinese: "候选人", category: "work" },
  { english: "capacity", chinese: "产能", category: "business" },
  { english: "challenge", chinese: "挑战", category: "core" },
  { english: "clarify", chinese: "澄清", category: "work" },
  { english: "client", chinese: "客户", category: "business" },
  { english: "collaborate", chinese: "协作", category: "work" },
  { english: "commitment", chinese: "承诺", category: "business" },
  { english: "communicate", chinese: "沟通", category: "work" },
  { english: "compare", chinese: "比较", category: "core" },
  { english: "complete", chinese: "完成", category: "core" },
  { english: "confirm", chinese: "确认", category: "work" },
  { english: "connect", chinese: "连接", category: "core" },
  { english: "consistency", chinese: "一致性", category: "business" },
  { english: "contract", chinese: "合同", category: "business" },
  { english: "contribute", chinese: "贡献", category: "work" },
  { english: "coordinate", chinese: "协调", category: "work" },
  { english: "deadline", chinese: "截止日期", category: "work" },
  { english: "decision", chinese: "决策", category: "core" },
  { english: "deliver", chinese: "交付", category: "work" },
  { english: "demand", chinese: "需求", category: "business" },
  { english: "depend", chinese: "依赖", category: "core" },
  { english: "describe", chinese: "描述", category: "core" },
  { english: "develop", chinese: "发展", category: "core" },
  { english: "discuss", chinese: "讨论", category: "work" },
  { english: "efficient", chinese: "高效的", category: "work" },
  { english: "emergency", chinese: "紧急情况", category: "daily" },
  { english: "encourage", chinese: "鼓励", category: "daily" },
  { english: "estimate", chinese: "估算", category: "work" },
  { english: "evaluate", chinese: "评估", category: "business" },
  { english: "execute", chinese: "执行", category: "work" },
  { english: "expectation", chinese: "预期", category: "business" },
  { english: "feedback", chinese: "反馈", category: "work" },
  { english: "flexible", chinese: "灵活的", category: "core" },
  { english: "focus", chinese: "专注", category: "core" },
  { english: "follow-up", chinese: "跟进", category: "work" },
  { english: "forecast", chinese: "预测", category: "business" },
  { english: "framework", chinese: "框架", category: "work" },
  { english: "handover", chinese: "交接", category: "work" },
  { english: "highlight", chinese: "重点", category: "work" },
  { english: "improve", chinese: "改进", category: "core" },
  { english: "initiative", chinese: "主动性", category: "work" },
  { english: "insight", chinese: "洞察", category: "business" },
  { english: "integrate", chinese: "整合", category: "work" },
  { english: "issue", chinese: "问题", category: "work" },
  { english: "justify", chinese: "论证", category: "business" },
  { english: "launch", chinese: "发布", category: "business" },
  { english: "leverage", chinese: "利用", category: "business" },
  { english: "maintain", chinese: "维护", category: "work" },
  { english: "milestone", chinese: "里程碑", category: "work" },
  { english: "negotiate", chinese: "谈判", category: "business" },
  { english: "objective", chinese: "目标", category: "business" },
  { english: "optimize", chinese: "优化", category: "business" },
  { english: "organize", chinese: "组织", category: "work" },
  { english: "outcome", chinese: "结果", category: "core" },
  { english: "ownership", chinese: "主人翁意识", category: "work" },
  { english: "partnership", chinese: "合作关系", category: "business" },
  { english: "performance", chinese: "绩效", category: "work" },
  { english: "pipeline", chinese: "管线", category: "business" },
  { english: "plan", chinese: "计划", category: "core" },
  { english: "prepare", chinese: "准备", category: "core" },
  { english: "priority", chinese: "优先级", category: "work" },
  { english: "process", chinese: "流程", category: "work" },
  { english: "proposal", chinese: "提案", category: "business" },
  { english: "quality", chinese: "质量", category: "core" },
  { english: "recommend", chinese: "建议", category: "work" },
  { english: "record", chinese: "记录", category: "work" },
  { english: "reduce", chinese: "减少", category: "business" },
  { english: "refine", chinese: "优化", category: "work" },
  { english: "reliable", chinese: "可靠的", category: "core" },
  { english: "report", chinese: "汇报", category: "work" },
  { english: "request", chinese: "请求", category: "work" },
  { english: "resolve", chinese: "解决", category: "work" },
  { english: "resource", chinese: "资源", category: "business" },
  { english: "review", chinese: "复盘", category: "work" },
  { english: "risk", chinese: "风险", category: "business" },
  { english: "schedule", chinese: "日程", category: "work" },
  { english: "solution", chinese: "方案", category: "work" },
  { english: "stakeholder", chinese: "利益相关方", category: "business" },
  { english: "standard", chinese: "标准", category: "work" },
  { english: "strategy", chinese: "策略", category: "business" },
  { english: "support", chinese: "支持", category: "work" },
  { english: "sync", chinese: "同步", category: "work" },
  { english: "target", chinese: "目标", category: "business" },
  { english: "timeline", chinese: "时间线", category: "work" },
  { english: "track", chinese: "跟踪", category: "work" },
  { english: "update", chinese: "更新", category: "work" },
  { english: "value", chinese: "价值", category: "business" },
  { english: "workflow", chinese: "工作流", category: "work" },

  { english: "How are you doing today?", chinese: "你今天怎么样？", category: "daily-dialogue" },
  { english: "Nice to meet you.", chinese: "很高兴认识你。", category: "daily-dialogue" },
  { english: "Could you speak a little slower?", chinese: "你可以说慢一点吗？", category: "daily-dialogue" },
  { english: "Can you repeat that, please?", chinese: "请再说一遍好吗？", category: "daily-dialogue" },
  { english: "What do you think about this idea?", chinese: "你怎么看这个想法？", category: "daily-dialogue" },
  { english: "Let's keep in touch.", chinese: "我们保持联系。", category: "daily-dialogue" },
  { english: "I totally agree with you.", chinese: "我完全同意你。", category: "daily-dialogue" },
  { english: "I see your point.", chinese: "我明白你的观点。", category: "daily-dialogue" },
  { english: "Could you help me with this?", chinese: "你能帮我处理这个吗？", category: "daily-dialogue" },
  { english: "I'll get back to you soon.", chinese: "我会尽快回复你。", category: "daily-dialogue" },
  { english: "Let's discuss this tomorrow.", chinese: "我们明天讨论这个。", category: "daily-dialogue" },
  { english: "Do you have a minute?", chinese: "你有一分钟吗？", category: "daily-dialogue" },
  { english: "I'm working on it now.", chinese: "我正在处理。", category: "daily-dialogue" },
  { english: "Thanks for your patience.", chinese: "感谢你的耐心。", category: "daily-dialogue" },
  { english: "I'll send you the details.", chinese: "我会把细节发你。", category: "daily-dialogue" },
  { english: "Let's align on the next steps.", chinese: "我们对齐下一步。", category: "daily-dialogue" },
  { english: "Could we reschedule the meeting?", chinese: "我们能改个会议时间吗？", category: "daily-dialogue" },
  { english: "Please let me know your availability.", chinese: "请告诉我你的空闲时间。", category: "daily-dialogue" },
  { english: "That sounds good to me.", chinese: "我觉得可以。", category: "daily-dialogue" },
  { english: "No worries, take your time.", chinese: "没关系，你慢慢来。", category: "daily-dialogue" },
];
