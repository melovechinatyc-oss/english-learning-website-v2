# 英语学习网站 v2 - 今日操作交接文档（给其它 AI 继续开发）

## 1. 项目与目标

- 项目目录：`/home/zhinan/dolphin-emulator/english-learning-website-v2`
- GitHub 仓库：`https://github.com/melovechinatyc-oss/english-learning-website-v2`
- 线上地址：`https://english-learning-website-v2.vercel.app`
- 核心目标：面向零基础上班族，提供从零基础到高级的英语学习内容，支持课程学习、连续听、收藏、进度统计、音标与词汇训练。

---

## 2. 今日已完成事项（结果导向）

1. 完成并扩展课程难度体系  
   - `beginner / elementary / intermediate / advanced` 全部可用。

2. 扩展完整 seed 学习内容（可直接用）  
   - 已覆盖：打招呼、日常交流、上班族核心词汇、音标入门、会议、协作、邮件、问题沟通、演讲、谈判等。
   - 当前共 12 门课程，每门 6 句示例句（含中文、音标、中文谐音、标签）。

3. 修复“Sanity 已配置但数据库为空导致前台无课程”的问题  
   - 已实现兜底逻辑：若 Sanity 查询为空或失败，自动回退到本地 seed 内容，保证页面一定有内容显示。

4. 完成构建验证并部署到线上  
   - `npm run lint` 通过。
   - `npm run build` 通过。
   - 已推送 `main` 并触发 Vercel 自动部署。
   - 线上已确认出现课程内容（不再是“暂无课程”）。

---

## 3. 今日关键提交（按时间）

- `3c087e0` `feat(content): expand courses from beginner to advanced`
- `6fa7b90` `fix(data): fallback to seed when sanity dataset is empty`
- `edad8ae` `chore: trigger vercel redeploy`

查看方式：

```bash
git log --oneline -n 12
```

---

## 4. 今日主要改动文件（给其它 AI 快速定位）

1. `src/types/learning.ts`  
   - `Difficulty` 增加 `advanced`。

2. `src/components/learning/course-card.tsx`  
   - 难度映射增加“高级”。

3. `src/sanity/schemaTypes/course.ts`  
   - Sanity 课程 schema 的 difficulty 选项加入 `advanced`。

4. `src/lib/seed-data.ts`  
   - 重构并扩展课程与句子内容（12 门课，覆盖零基础到高级、音标、职场词汇、日常交流）。

5. `src/lib/api.ts`  
   - 新增“Sanity 空数据自动回退 seed”逻辑，覆盖：
     - `getCourses`
     - `getFeaturedCourses`
     - `getCourseBySlug`
     - `getSentencesByCourseSlug`

---

## 5. 标准操作步骤（SOP）

> 给其它 AI：按以下顺序执行，不要跳步。

1. 拉取并确认代码状态

```bash
cd /home/zhinan/dolphin-emulator/english-learning-website-v2
git pull origin main
git status --short
```

2. 安装依赖与本地启动

```bash
npm install
cp .env.example .env.local
npm run dev
```

3. 本地自检（至少）

```bash
npm run lint
npm run build
```

4. 功能验证页面
   - `/courses`：课程列表是否显示 12 门课程
   - `/courses/[slug]`：课程详情是否正常
   - `/listen/[slug]`：连续听是否可播放
   - `/favorites`、`/progress`：收藏/进度是否可记录

5. 发布

```bash
git add .
git commit -m "feat: your change summary"
git push origin main
```

6. 等待 Vercel 自动部署，在线检查 `/courses` 页面。

---

## 6. 常见问题与解决方案（重点）

### 问题 A：线上显示“暂无课程”

现象：
- `/courses` 页面只有“暂无课程，请先在后台发布课程内容。”

根因：
- 已配置 Sanity 环境变量，但 Sanity 后台还没有已发布课程数据。

解决：
1. 当前代码已带兜底，会回退 seed；若仍未生效，通常是部署未更新。
2. 执行一次空提交触发重部署：

```bash
git commit --allow-empty -m "chore: trigger vercel redeploy"
git push origin main
```

3. 等待部署完成后刷新页面。

---

### 问题 B：Vercel 没自动更新到最新代码

解决：
1. 确认 `git push origin main` 成功。
2. 在 Vercel 控制台确认最新 commit 是否被拉取。
3. 若未触发，使用“空提交重发”方案（同上）。

---

### 问题 C：Sanity 相关变量导致读取异常

必要变量：
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

说明：
- 即使变量存在，只要 Sanity 没内容，系统也应回退 seed。
- 若未来改掉兜底逻辑，需要保证 Sanity 中 `isPublished=true` 才能显示。

---

### 问题 D：构建失败

标准排查顺序：
1. `npm install` 是否完整。
2. `npm run lint` 错误先修复。
3. `npm run build` 查看首个报错文件定位。
4. 若是环境变量报错，先对照 `.env.example` 补齐。

---

## 7. 下一阶段待办（建议其它 AI 接力）

1. 把 seed 内容同步写入 Sanity（非必须，但建议）  
   - 目标：让后台可编辑，后续运营只在 CMS 改内容。

2. 增加“词汇量分级目标”模块  
   - 示例：300 / 800 / 1500 / 3000 词阶段目标与学习路径。

3. 增加“上班族 15 分钟学习计划”  
   - 每日任务：听力 + 跟读 + 复习 + 打卡统计。

4. 增加内容导入脚本（可选）  
   - 将 `seedCourses/seedSentences` 一键导入 Sanity，避免手工录入。

---

## 8. 给其它 AI 的工作约束（很重要）

- 用户偏好中文沟通、零基础友好引导。
- 优先自动化执行，尽量少让用户手动敲命令。
- 遇到部署或平台问题，先给“可直接执行”的最短路径解决方案。
- 不要破坏已有“Sanity 空数据回退 seed”的容错能力。
- 每次改动后必须跑：`npm run lint`、`npm run build`。

---

## 9. 一句话交接结论

本项目今天已经完成“零基础到高级 + 音标 + 上班族词汇 + 日常交流”内容扩展并成功上线；若后续继续开发，请在当前 `main` 基础上按本文件 SOP 执行，并保留现有容错与自动部署流程。
