import type { StateCreator } from "zustand";
import { axiosClient } from "@/lib";

export type Template = {
  id: string;
  name: string;
  language: string;
  status: string;
  category: string;
  components: any[];
};

export type TemplateSlice = {
  showTemplate: boolean;
  templates: Template[] | null;
  toggleShowTemplate: () => void;
  fetchTemplates: () => Promise<void>;
  showTemplateTrue: () => void;
};

export const createTemplateSlice: StateCreator<TemplateSlice> = (set, get) => ({
  showTemplate: false,
  templates: null,

  toggleShowTemplate: () => {
    const current = get().showTemplate;
    set({ showTemplate: !current });

    if (!current && get().templates === null) {
      get().fetchTemplates();
    }
  },
  showTemplateTrue: () => {
    const current = get().showTemplate;
    set({ showTemplate: true });

    if (!current && get().templates === null) {
      get().fetchTemplates();
    }
  },

fetchTemplates: async () => {
  try {
    const res = await axiosClient.get("/whatsapp/templates"); // ✅ fixed
    if (res.data.status === "success") {
      set({ templates: res.data.templates });
    }
  } catch (err) {
    console.error("❌ Failed to fetch templates:", err);
  }
}

});
