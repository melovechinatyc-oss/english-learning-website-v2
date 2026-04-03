import { defineField, defineType } from "sanity";

export const courseType = defineType({
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "标题",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "简介", type: "text" }),
    defineField({
      name: "difficulty",
      title: "难度",
      type: "string",
      options: {
        list: [
          { title: "零基础", value: "beginner" },
          { title: "初级", value: "elementary" },
          { title: "中级", value: "intermediate" },
        ],
      },
      initialValue: "beginner",
    }),
    defineField({
      name: "estimatedMinutes",
      title: "预计分钟",
      type: "number",
      initialValue: 10,
    }),
    defineField({ name: "coverImage", title: "封面图", type: "image" }),
    defineField({ name: "category", title: "分类", type: "string" }),
    defineField({ name: "order", title: "排序", type: "number", initialValue: 1 }),
    defineField({
      name: "isFeatured",
      title: "首页推荐",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isPublished",
      title: "发布",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
