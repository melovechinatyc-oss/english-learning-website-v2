import { defineField, defineType } from "sanity";

export const sentenceType = defineType({
  name: "sentence",
  title: "Sentence",
  type: "document",
  fields: [
    defineField({
      name: "course",
      title: "所属课程",
      type: "reference",
      to: [{ type: "course" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "english",
      title: "英文",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "chinese",
      title: "中文翻译",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pronunciationCn",
      title: "中文式发音提示",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "ipa", title: "IPA", type: "string" }),
    defineField({ name: "audioNormal", title: "标准音频 URL", type: "url" }),
    defineField({ name: "audioSlow", title: "慢速音频 URL", type: "url" }),
    defineField({ name: "audioChinese", title: "中文音频 URL", type: "url" }),
    defineField({ name: "tags", title: "标签", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "order", title: "排序", type: "number", initialValue: 1 }),
    defineField({
      name: "isPublished",
      title: "发布",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
