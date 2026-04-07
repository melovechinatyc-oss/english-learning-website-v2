# 英语学习网站 v2 - 今日操作交接文档（给其它 AI 继续开发）

## 1. 项目总览（先看这里）

- 项目目录：`/home/zhinan/dolphin-emulator/english-learning-website-v2`
- GitHub：`https://github.com/melovechinatyc-oss/english-learning-website-v2`
- 线上地址（Vercel）：`https://english-learning-website-v2.vercel.app`
- 目标人群：零基础上班族
- 核心功能：课程学习、连续听、收藏、进度统计、音标学习、职场词汇

## 2. 线上使用了什么工具（必须明确）

### 前端与部署
- 前端框架：`Next.js 16`（App Router + TypeScript）
- UI：`Tailwind CSS` + `shadcn/ui`
- 部署平台：`Vercel`
- 自动发布：`GitHub main` 分支 push 后，Vercel 自动构建部署

### 数据存储与内容来源
- 远程 CMS/数据库：`Sanity`（文档型内容存储）
- 当前数据读取策略：
  1. 若 Sanity 有数据，优先读 Sanity；
  2. 若 Sanity 为空或查询失败，自动回退本地 `seed-data.ts`（已实现）。
- 本地学习状态存储：`localStorage`
  - 包含：收藏、学习进度、播放设置、最近学习等。

### 语音播放技术
- 优先使用句子音频 URL（若存在）；
- 无音频时使用浏览器 `Web Speech API` (`speechSynthesis`) 做 TTS；
- 本次已修复长句卡顿（见第 7 节）。

## 3. 今天已经完成的工作

1. 课程体系扩展：`beginner/elementary/intermediate/advanced`
2. 内容扩展：12 门课程，覆盖打招呼、日常交流、上班族词汇、音标、会议、邮件、谈判等
3. 修复空数据问题：Sanity 空库时自动回退 seed，不再出现线上无课程
4. 新增模糊搜索 + 自动联想：
   - 支持课程/句子/词汇混合搜索；
   - 输入时自动弹出相关词汇与对话；
   - 支持英文模糊匹配和中文匹配；
   - 首页和课程页都可用。
5. 新增“5000+ 高频词分级包（零基础/初级/中级/高级）”并自动导入搜索索引：
   - 数据文件：`public/data/high-frequency-5200.txt`
   - 自动导入方式：前端搜索组件启动时自动加载并分级显示。
6. 新增可点击详情页（词汇/长句）：
   - 词汇详情：`/vocabulary/[word]`
   - 长句详情：`/sentences/[id]`
7. 优化连续听 TTS：
   - 仅超长句切分，减少“逗号级卡顿”；
   - 增加语音偏好（自动/偏男声/偏女声）；
   - 停止播放时同步停止当前音频和语音队列。
8. 接入统一云端 TTS 音频方案（根治跨端音色/卡顿差异）：
   - 为 seed 句子批量生成固定音频文件（英/中/发音提示）；
   - 播放器优先播放固定 mp3，失败时才回退浏览器 TTS。
9. 构建与部署：`lint/build` 通过并发布到线上

## 4. 今日关键提交

- `3c087e0` `feat(content): expand courses from beginner to advanced`
- `6fa7b90` `fix(data): fallback to seed when sanity dataset is empty`
- `edad8ae` `chore: trigger vercel redeploy`
- `ba309ec` `docs: add today operation handoff guide`
- `550f1f5` `docs: clarify stack and handoff steps; fix long sentence tts stutter`
- `bcde0fa` `docs: clarify production tools, storage, handoff and bug notes`
- `d15e6d5` `feat(search): add fuzzy word/dialog autocomplete and smoother tts`
- `c00dfb5` `feat(audio-search): add 3200-word pack, voice preference, and handoff updates`

查看：

```bash
git log --oneline -n 20
```

## 5. 关键文件定位（接手时优先看）

- `src/lib/seed-data.ts`：课程与句子 seed 内容
- `src/lib/api.ts`：Sanity 查询 + seed 回退逻辑
- `src/components/learning/continuous-listen-player.tsx`：连续听播放器与 TTS 播放
- `src/components/learning/courses-search.tsx`：课程/句子/词汇模糊搜索与自动联想
- `src/lib/vocabulary-data.ts`：基础词汇与常用对话
- `src/app/sentences/[id]/page.tsx`：长句详情页
- `src/app/vocabulary/[word]/page.tsx`：词汇详情页
- `src/app/page.tsx`：首页全站搜索入口
- `public/data/high-frequency-5200.txt`：5000+ 高频词包数据
- `public/audio/seed/*`：统一云端 TTS 生成的固定音频文件（216 个）
- `scripts/generate_seed_audio.py`：批量生成 seed 音频脚本
- `src/contexts/learning-context.tsx`：学习状态上下文
- `src/lib/learning-storage.ts`：localStorage 读写
- `src/sanity/schemaTypes/*`：Sanity 内容模型

## 6. 接手人下一步该怎么做（一目了然）

1. 拉代码并确认状态

```bash
cd /home/zhinan/dolphin-emulator/english-learning-website-v2
git pull origin main
git status --short
```

2. 本地启动

```bash
npm install
cp .env.example .env.local
npm run dev
```

3. 必跑验证

```bash
npm run lint
npm run build
```

4. 页面检查清单
- `/`：首页有搜索框，输入后有联想结果
- `/courses`：应显示课程卡片，不应出现“暂无课程”
- `/courses/[slug]`：句子、音标、翻译应正常
- `/listen/[slug]`：长句播放应连续、不明显卡顿
- `/vocabulary/[word]`：词汇详情可打开
- `/sentences/[id]`：长句详情可打开
- `/favorites`、`/progress`：可记录并刷新后保留

5. 发布步骤

```bash
git add .
git commit -m "feat: xxx"
git push origin main
```

6. 部署后在线回归
- 打开 `https://english-learning-website-v2.vercel.app/`
- 验证首页搜索联想可点击到词汇/长句详情
- 至少验证 1 门长句课程的连续听体验

## 7. 已知问题与处理记录

### 问题：长句英文朗读卡顿、不顺畅

根因（已定位）：
- 旧逻辑在每次朗读前都会 `speechSynthesis.cancel()`，会打断当前队列，长句更容易出现停顿/重启感。
- 长文本一次性送入 TTS，浏览器引擎在部分设备上表现不稳定。

修复方案（已实现）：
1. 新增长句分段函数：按中英文标点和长度切分句子，分段顺序朗读；
2. 去掉每段前强制 `cancel()`；
3. 停止播放时精确终止当前 TTS + 当前音频实例，避免“半停半播”；
4. 保持原有播放设置（速度、重复、停顿、自动下一句）兼容。

修复文件：
- `src/components/learning/continuous-listen-player.tsx`

### 问题：手机端是女声、PC 端是男声

根因（浏览器/系统机制）：
- Web Speech API 调用的是“设备操作系统自带语音库”，不同设备默认语音不同；
- iOS/Safari 常见默认英文语音为女声，PC 可能默认男声；
- 因此不接入同一套云端 TTS 音频时，跨设备音色无法 100% 一致。

当前处理（已落地）：
1. 新增语音偏好设置：`自动 / 偏男声 / 偏女声`；
2. 播放时按偏好尽量匹配同语言 voice；
3. 超长句才切分，降低手机端卡顿概率。
4. 新增统一音频优先播放：seed 句子优先播 `public/audio/seed/*.mp3`，跨端音色与节奏保持一致。

当前结论：
- 对 seed 课程，PC 与手机会优先使用同一套固定音频，音色与流畅性基本一致；
- 仅当固定音频缺失或加载失败时，才回退浏览器本地 TTS。

### 问题：线上偶发显示旧内容

解决：
- 推送一次空提交强制触发 Vercel 重部署。

```bash
git commit --allow-empty -m "chore: trigger vercel redeploy"
git push origin main
```

### 问题：词汇结果不能点击详情

根因：
- 搜索建议里词汇项此前没有详情路由链接。

解决（已完成）：
1. 新增词汇详情路由：`/vocabulary/[word]`
2. 新增长句详情路由：`/sentences/[id]`
3. 首页搜索与课程页搜索统一使用可点击联想逻辑。

## 8. 环境变量（Sanity）

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_READ_TOKEN`（可选，用于需要鉴权读取时）

说明：
- 即使上述变量已配置，只要 Sanity 暂无课程数据，前台也会回退 seed。

## 9. 后续建议（给下一位 AI）

1. 增加“seed 一键导入 Sanity 脚本”，让运营可以在 CMS 后台改内容。
2. 为连续听播放器补自动化测试（特别是长句分段与暂停恢复）。
3. 为 Sanity 后台新增句子也提供自动音频生成链路（避免新内容回退本地 TTS）。
4. 基于 `high-frequency-5200.txt` 增加可视化词汇闯关（零基础/初级/中级/高级）。

## 10. 维护规则（强制）

- **以后每次新增/修改功能，必须同步更新本文件 `TODAY_OPERATION_HANDOFF.md`。**
- 更新内容至少包含：
1. 改了什么功能；
2. 改了哪些文件；
3. 如何验证；
4. 遇到什么问题、怎么解决；
5. 对下一位接手者的影响。

## 11. 最新补充（词汇中文/音标/朗读）

- 新增 5200 高频词元数据（中文释义 + 音标 + 分级 + 词频排名）：
  - `public/data/high-frequency-5200-meta.json`
  - `src/lib/high-frequency-meta.ts`
- 当前覆盖结果：
  - 5200 词均有中文释义；
  - 5200 词均有音标（ECDICT + IPA 兜底生成）。
- 词汇详情页补齐：
  - 中文释义优先使用高频词元数据；
  - 音标展示（有数据则显示）；
  - “朗读单词”按钮（浏览器 TTS）。
- 搜索联想补齐：
  - 高频词结果展示中文，不再只显示英文。
- 生成脚本：
  - `scripts/build_high_frequency_meta.py`（基于 ECDICT 自动构建 5200 词元数据）。

## 12. 最新补充（连续听卡顿差异）

- 现象：课程卡片进入“连续听”时，手机端长句偶发卡顿；搜索页单词朗读更顺滑。
- 根因：
  - 连续听优先走网络 mp3，首播时可能受移动网络抖动影响；
  - 搜索页单词朗读走本地 TTS，延迟更小。
- 修复（已完成）：
  1. 连续听播放器新增音频预加载（当前句 + 下一句，英/中/发音）；
  2. 新增音频缓存复用，避免每次重新拉流；
  3. 播放前等待 `canplaythrough/loadeddata`（含超时保护）降低首播顿挫。
- 关键文件：
  - `src/components/learning/continuous-listen-player.tsx`

## 13. 暂缓事项记录

- 用户最新反馈：手机端“课程卡片进入连续听”仍有卡顿体感。
- 当前决定：该问题**暂缓到下次处理**，本次不再继续改动业务代码，避免引入新风险。
- 下次排查优先级建议：
  1. 接入离线缓存（Service Worker）预缓存首课音频；
  2. 增加移动端网络抖动下的重试与降级策略；
  3. 真机抓取播放时序日志（首帧时间、缓冲时长、切句时延）。

## 12. 最新补充（连续听卡顿差异）

- 现象：课程卡片区域进入“连续听”时，手机端长句偶发卡顿；而搜索页单词朗读更顺滑。
- 根因：
  - 连续听优先走网络 mp3，首播时可能受移动网络抖动影响；
  - 搜索页单词朗读主要走本地 TTS，延迟感更小。
- 修复（已完成）：
  1. 连续听播放器新增音频预加载（当前句 + 下一句，英/中/发音）；
  2. 新增音频缓存复用，避免每次 new Audio 重新拉流；
  3. 播放前等待 `canplaythrough/loadeddata`（含超时保护）以减少首播顿挫。
- 关键文件：
  - `src/components/learning/continuous-listen-player.tsx`

## 14. 最新补充（iOS 句子卡片朗读卡顿）

- 现象：iOS 端在课程详情页点单句卡片的“标准/慢速”朗读时，长句比连续听更容易卡顿。
- 根因：
  - `SentenceCard` 之前没有复用 seed 固定音频，而是优先走浏览器 TTS；
  - 每次播放都 `new Audio()`，没有预加载与缓存，移动端首播更容易顿一下；
  - TTS 回退路径对长句没有复用连续听里的分段策略。
- 修复（已完成）：
  1. 句子卡片优先播放 `public/audio/seed/*.mp3` 固定音频；
  2. 为句子卡片新增音频缓存与预加载，减少 iOS 首播卡顿；
  3. TTS 回退补齐长句分段与语音偏好选择；
  4. 单句循环停止时同步终止当前音频与 TTS。
- 关键文件：
  - `src/components/learning/sentence-card.tsx`
