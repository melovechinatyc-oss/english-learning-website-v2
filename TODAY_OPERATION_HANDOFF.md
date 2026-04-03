# 英语学习网站 v2 - 今日操作交接文档（给其它 AI 继续开发）

## 1. 项目总览（先看这里）

- 项目目录：`/home/zhinan/dolphin-emulator/english-learning-website-v2`
- GitHub：`https://github.com/melovechinatyc-oss/english-learning-website-v2`
- 线上地址（Vercel）：`https://english-learning-website-v2.vercel.app`
- 目标用户：零基础上班族
- 核心功能：课程学习、连续听、收藏、进度统计、音标学习、职场词汇

## 2. 线上用了什么工具（你要求写清楚）

### 前端与发布
- 前端框架：`Next.js 16`（App Router + TypeScript）
- 样式组件：`Tailwind CSS` + `shadcn/ui`
- 托管部署：`Vercel`
- 自动部署：`GitHub main` 每次 push 会触发 Vercel 自动构建

### 数据存储与内容来源
- 远程内容存储：`Sanity`（CMS，文档型数据库）
- 本地状态存储：`localStorage`（收藏、进度、播放设置、最近学习）
- 当前读取策略：
1. Sanity 有数据时优先读取 Sanity；
2. Sanity 无数据或查询失败时，自动回退到 `src/lib/seed-data.ts`。

### 语音播放引擎
- 优先播放句子音频 URL（若存在）
- 无音频时使用浏览器 `Web Speech API`（`speechSynthesis`）做 TTS
- 支持语音偏好：`自动 / 偏男声 / 偏女声`

## 3. 今天做了什么（结果）

1. 完整扩展课程内容到 4 个难度：`beginner`、`elementary`、`intermediate`、`advanced`
2. 新增 12 门课程内容，覆盖打招呼、日常交流、上班族词汇、音标、会议、邮件、谈判等
3. 修复“Sanity 空库导致线上无课程”问题（已做 seed 回退）
4. 修复“长句英文朗读卡顿”问题（见第 7 节）
5. 新增首页全站搜索（课程/长句/词汇）
6. 搜索结果全部可点击详情（词汇、单词、长句都可点）
7. 新增并自动导入高频词分级包（5200）
8. 已完成 `lint/build` 并推送上线

## 4. 今日关键提交

- `3c087e0` `feat(content): expand courses from beginner to advanced`
- `6fa7b90` `fix(data): fallback to seed when sanity dataset is empty`
- `550f1f5` `docs: clarify stack and handoff steps; fix long sentence tts stutter`
- `d15e6d5` `feat(search): add fuzzy word/dialog autocomplete and smoother tts`
- `c00dfb5` `feat(audio-search): add 3200-word pack, voice preference, and handoff updates`

查看方式：

```bash
git log --oneline -n 30
```

## 5. 接手必须先看哪些文件

- `src/lib/api.ts`：Sanity 查询与 seed 回退
- `src/lib/queries.ts`：GROQ 查询（含按 sentenceId 查询）
- `src/lib/seed-data.ts`：课程与句子内容
- `src/lib/vocabulary-data.ts`：基础词汇与常用对话
- `src/components/learning/courses-search.tsx`：搜索与联想
- `src/components/learning/continuous-listen-player.tsx`：连续听与 TTS 播放
- `src/components/learning/listen-settings-panel.tsx`：语音偏好等播放设置
- `src/app/sentences/[id]/page.tsx`：长句详情页
- `src/app/vocabulary/[word]/page.tsx`：词汇详情页
- `src/app/page.tsx`：首页搜索入口
- `public/data/high-frequency-5200.txt`：5200 高频词包

## 6. 下一位接手该怎么做（一目了然）

1. 拉代码

```bash
cd /home/zhinan/dolphin-emulator/english-learning-website-v2
git pull origin main
git status --short
```

2. 启动本地

```bash
npm install
cp .env.example .env.local
npm run dev
```

3. 先跑质量检查

```bash
npm run lint
npm run build
```

4. 页面验收清单
- `/`：首页有搜索框，输入后出现联想
- `/courses`：能看到课程，不应出现“暂无课程”
- `/courses/[slug]`：句子、翻译、音标显示正常
- `/listen/[slug]`：长句播放顺滑，暂停/继续可用
- `/vocabulary/[word]`：词汇详情可打开
- `/sentences/[id]`：长句详情可打开
- `/favorites`、`/progress`：数据可保存并刷新后仍在

5. 发布流程

```bash
git add .
git commit -m "feat: xxx"
git push origin main
```

6. 线上复测
- 打开：`https://english-learning-website-v2.vercel.app/`
- 检查首页搜索是否联想并可点击跳详情

## 7. BUG 记录与解决方案

### BUG：长句英文播放卡顿、不顺畅

根因：
- 旧逻辑每次 TTS 前都会 `speechSynthesis.cancel()`，导致长句经常被打断。
- 长文本一次性朗读，浏览器 TTS 在部分设备上稳定性差。

已修复：
1. 长句仅在超长时切分，避免碎停顿；
2. 去掉每段前强制 `cancel()`；
3. 增加当前音频实例管理，暂停时可立即停止；
4. 支持语音偏好（自动/偏男声/偏女声）。

修复文件：
- `src/components/learning/continuous-listen-player.tsx`
- `src/components/learning/listen-settings-panel.tsx`
- `src/lib/learning-storage.ts`

### BUG：词汇搜索结果不能点击详情

根因：
- 搜索建议中“词汇”项原先只有文本展示，没有详情链接。

已修复：
1. 词汇结果跳转：`/vocabulary/[word]`
2. 长句结果跳转：`/sentences/[id]`
3. 首页和课程页搜索体验统一。

## 8. 常见故障速查

### 手机端女声、PC 端男声
- 这是系统语音库差异（iOS/Android/Windows/macOS 默认 voice 不同），不是业务逻辑报错。
- 当前已加“语音偏好”尽量统一；若要完全一致，需要统一云端 TTS 音频。

### 线上显示“暂无课程”
- 原因：Sanity 有配置但内容未发布。
- 处理：当前代码会回退 seed；若没生效，触发重部署：

```bash
git commit --allow-empty -m "chore: trigger vercel redeploy"
git push origin main
```

### Sanity 环境变量
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_READ_TOKEN`（可选）

## 9. 下一阶段建议（给后续 AI）

1. 增加“seed 一键导入 Sanity 脚本”
2. 给连续听播放器补测试（重点测长句、暂停、恢复）
3. 接入统一云端 TTS 音频（实现 PC/手机音色与流畅性更一致）
4. 把 5200 高频词继续扩到 8000+，并补中文释义与例句

## 10. 维护规则（强制）

- 每次新增/修改功能，必须同步更新本文件 `TODAY_OPERATION_HANDOFF.md`。
- 更新内容至少包括：改了什么、改了哪些文件、如何验证、遇到什么问题与解决方案。
