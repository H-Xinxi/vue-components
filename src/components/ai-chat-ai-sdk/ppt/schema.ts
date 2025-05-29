import { z } from "zod";

const coverPageSchema = z
  .object({
    type: z
      .literal("cover")
      .describe("表明此对象代表 ppt 封面页，是 ppt 第一页。"),
    data: z.object({
      title: z.string().describe("标题。对应于用户输入 markdown 中的一级标题"),
      text: z.string().describe("正文"),
    }),
  })
  .describe("ppt 封面页");

const contentsPageSchema = z
  .object({
    type: z
      .literal("contents")
      .describe("表明此对象代表 ppt 目录页, 是 ppt 的第二页"),
    data: z.object({
      items: z
        .array(z.string().describe("目录项"))
        .describe("目录项列表。对应于用户输入 markdown 中的二级标题的列表"),
    }),
  })
  .describe("ppt 目录页");

const contentPageSchema = z
  .object({
    type: z.literal("content").describe("表明此对象代表 ppt 内容页"),
    data: z.object({
      title: z.string().describe("标题。对应与 markdown 三级标题"),
      items: z.array(
        z.object({
          title: z.string().describe("对应与 markdown 三级标题下的列表项"),
          text: z.string(),
        })
      ),
    }),
  })
  .describe("ppt 内容页");

const transitionPageSchema = z
  .object({
    type: z.literal("transition").describe("表明此对象代表 ppt 内容页"),
    data: z.object({
      title: z.string().describe("标题。对应于用户输入 markdown 中的二级标题"),
      text: z.string(),
    }),
  })
  .describe("ppt 过渡页");
const endPageSchema = z.object({
  type: z.literal("end").describe("ppt 最后一页"),
});

const pptSchema = z
  .array(
    z.union([
      coverPageSchema,
      contentsPageSchema,
      contentPageSchema,
      transitionPageSchema,
      endPageSchema,
    ])
  )
  .describe("每一项代表 ppt 的一页");
