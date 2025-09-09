import { useStore } from "@/store";
import { ForwardTemplate } from "./ForwardTemplate";
import { Button } from "@/components";

type TemplateButton = {
  type: string;
  text: string;
};

type TemplateComponent = {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
  format?: string;
  text?: string;
  buttons?: TemplateButton[];
};

export function TemplateList() {
  const templates = useStore((state) => state.templates);
  const showTemplate = useStore((state) => state.showTemplate);

  if (!showTemplate) return null;

  if (!templates) {
    return (
      <div className="min-h-[200px] flex items-center justify-center mx-4 my-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#242626] border-t-green-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm font-medium">Loading templates...</p>
        </div>
      </div>
    );
  }

  const getComponentIcon = (type: string) => {
    switch (type) {
      case "HEADER":
        return "📋";
      case "BODY":
        return "📄";
      case "FOOTER":
        return "🏷️";
      case "BUTTONS":
        return "⚡";
      default:
        return "📦";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#111111]">
      {/* Header */}
      <div className="bg-[#1a1a1a] p-4 border-b border-[#242626] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg font-semibold text-white">Message Templates</h1>
          <p className="text-sm text-gray-400">Manage and forward your templates</p>
        </div>
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-7xl mx-auto space-y-4 pt-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#1a1a1a] rounded-lg border border-[#242626] shadow-md transition-all duration-200 hover:bg-[#1f1f1f]"
            >
              <div className="p-4">
                {/* Template Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {tpl.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {tpl.name}
                      </h3>
                      <span className="text-xs text-gray-400">{tpl.language}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 bg-[#242626] rounded-full px-2 py-1">
                    {tpl.components.length} components
                  </span>
                </div>

                {/* Components */}
                <div className="space-y-3 mb-4">
                  {tpl.components.map((c: TemplateComponent, i: number) => (
                    <div
                      key={i}
                      className="bg-[#242626] rounded-lg p-3 border border-[#2a2a2a]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{getComponentIcon(c.type)}</span>
                        <span className="text-xs font-medium text-gray-300 uppercase">
                          {c.type}
                        </span>
                      </div>
                      <div className="text-gray-200">
                        {c.text ? (
                          <p className="text-sm leading-relaxed line-clamp-3">
                            {c.text}
                          </p>
                        ) : c.buttons ? (
                          <div className="flex flex-wrap gap-2">
                            {c.buttons.map((b: TemplateButton, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs text-gray-200 bg-[#2a2a2a]"
                              >
                                {b.text}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-sm">
                            No content
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Forward Button */}
                <ForwardTemplate
                  templateName={tpl.name}
                  language={tpl.language}
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full flex items-center justify-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Forward Template
                  </Button>
                </ForwardTemplate>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a1a1a] p-3 border-t border-[#242626] text-center">
        <p className="text-sm text-gray-400">
          {templates.length} templates available
        </p>
      </div>
    </div>
  );
}