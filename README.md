# English Learning Website v2

手机端优先的英语学习网页 App，支持课程学习、连续听、收藏与学习记录，并集成 Sanity CMS 作为内容后台。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

浏览器打开 `http://localhost:3000`。

## 环境变量

在 `.env.local` 配置：

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_READ_TOKEN`

本地开发可以先不填，系统会自动使用内置 seed 数据演示。

部署到 Vercel 时，在 Project Settings > Environment Variables 配置同名变量。

## 启动 Sanity Studio

```bash
npx sanity dev
```

然后访问 `http://localhost:3333` 或项目内路由 `/studio`。

## 配置 Sanity

1. 在 Sanity 官网创建项目并拿到 `projectId`。
2. 把 `projectId` 和 `dataset` 写入 `.env.local`。
3. 启动 Studio 后创建 Course、Sentence、Category。
4. 设置 `isPublished=true` 才会在前台显示。
5. 设置 `isFeatured=true` 会显示在首页推荐区。

## 部署到 Vercel

1. 推送代码到 GitHub 仓库。
2. 在 Vercel 导入该仓库。
3. 配置上述环境变量。
4. 点击 Deploy 完成部署。

## iPhone 使用

1. Safari 打开部署后的网址。
2. 点击分享按钮，选择“添加到主屏幕”。
3. 从主屏幕启动后可以接近原生 App 的体验。

## 目录结构

```text
src/
  app/
    page.tsx
    courses/
    listen/
    favorites/
    progress/
    studio/
  components/learning/
  contexts/
  lib/
  sanity/schemaTypes/
sanity.config.ts
sanity.cli.ts
```
