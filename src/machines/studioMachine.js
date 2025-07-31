import { createMachine } from "xstate";

/**
 * Studio wizard state machine.
 */
export const studioMachine = createMachine({
  id: "studio",
  initial: "topics",
  context: {
    topicA: "",
    topicB: "",
    intersection: "",
    colors: ["#60a5fa", "#f472b6"],
    cid: "",
    txHash: "",
  },
  states: {
    topics: {
      on: {
        NEXT: [
          {
            cond: "topicsEntered",
            target: "word"
          }
        ],
        SET_FIELD: { actions: "setField" }
      }
    },
    word: {
      on: {
        NEXT: [
          {
            cond: "wordSelected",
            target: "style"
          }
        ],
        PREV: { target: "topics" },
        SET_FIELD: { actions: "setField" }
      }
    },
    style: {
      on: {
        NEXT: [
          {
            cond: "colorsChosen",
            target: "publish"
          }
        ],
        PREV: { target: "word" },
        SET_FIELD: { actions: "setField" }
      }
    },
    publish: {
      on: {
        NEXT: [
          {
            cond: "hasCid",
            target: "mint"
          }
        ],
        PREV: { target: "style" },
        SET_FIELD: { actions: "setField" }
      }
    },
    mint: {
      on: {
        PREV: { target: "publish" },
        SET_FIELD: { actions: "setField" }
      }
    }
  }
}, {
  actions: {
    setField: (ctx, evt) => {
      if (evt.key && evt.value !== undefined) {
        ctx[evt.key] = evt.value;
      }
    }
  },
  guards: {
    topicsEntered: (ctx) => ctx.topicA.trim() && ctx.topicB.trim(),
    wordSelected: (ctx) => !!ctx.intersection,
    colorsChosen: (ctx) => Array.isArray(ctx.colors) && ctx.colors.length === 2,
    hasCid: (ctx) => !!ctx.cid,
  }
});