import { pgTable, text, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const papers = pgTable("papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  abstract: text("abstract").notNull(),
  authors: text("authors").notNull(),
  url: text("url").notNull(),
  publishedDate: varchar("published_date", { length: 255 }).notNull(),
  journal: varchar("journal", { length: 255 }).notNull(),
  source: varchar("source", { length: 50 }),
});

export const insertPaperSchema = createInsertSchema(papers).omit({ id: true });

export type InsertPaper = z.infer<typeof insertPaperSchema>;
export type Paper = typeof papers.$inferSelect;

// Add source property with TypeScript declaration merging for older code
declare module "./schema" {
  interface Paper {
    source?: string;
  }
}
