import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getFireGeoJSON } from "./mockFireData";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Fire data endpoint
  fire: router({
    getData: publicProcedure.query(() => {
      return getFireGeoJSON();
    }),
  }),

  // AI command endpoint
  ai: router({
    command: publicProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "You are an AI Incident Commander for a wildfire disaster response system. " +
                  "You have access to real-time data from the Camp Fire in Paradise, California. " +
                  "Analyze fire data, asset positions, and telemetry to provide tactical recommendations. " +
                  "Keep responses concise, professional, and actionable. Use military-style brevity.",
              },
              {
                role: "user",
                content: input.message,
              },
            ],
          });

          return {
            response: response.choices[0]?.message?.content || "No response generated.",
          };
        } catch (error) {
          console.error("[AI Command] Error:", error);
          throw new Error("Failed to process AI command");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
