import { defineStore } from "pinia";

export const useRootElementStore = defineStore("rootElementStore", {
  state: (): { height: number; width: number } => ({ height: 0, width: 0 }),
  getters: {
    getHeight: (state) => state.height,
    getWidth: (state) => state.width,
  },
  actions: {
    setHeight(arg: number) {
      this.height = arg;
    },
    setWidth(arg: number) {
      this.width = arg;
    },
  },
});
