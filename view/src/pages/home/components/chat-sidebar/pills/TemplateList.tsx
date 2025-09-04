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
      <div
        className="min-h-[200px] flex items-center justify-center rounded-xl mx-4 my-6 border border-[#2a2b2c]"
        style={{ backgroundColor: "#161717" }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#404142] border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#a8a9aa] font-medium">Loading templates...</p>
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
    <div
      className="h-screen flex flex-col custom-scroll"
      style={{ backgroundColor: "#161717" }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4 p-6 ">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#f1f2f3] mb-2">
            Message Templates
          </h1>
          <p className="text-[#a8a9aa] text-lg">
            Manage and forward your template collection
          </p>
        </div>
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 px-6 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-2xl border border-[#2a2b2c] shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-[#404142]"
                style={{ backgroundColor: "#1a1b1c" }}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Template Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold text-white">
                            {tpl.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#f1f2f3] leading-tight">
                            {tpl.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-blue-200 border border-blue-800/50"
                        style={{ backgroundColor: "rgba(37, 99, 235, 0.15)" }}
                      >
                        {tpl.language}
                      </span>
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-[#d1d2d3] border border-[#404142]"
                        style={{ backgroundColor: "#2a2b2c" }}
                      >
                        {tpl.components.length} components
                      </span>
                    </div>
                  </div>

                  {/* Components */}
                  <div className="flex-1 space-y-3 mb-6">
                    {tpl.components.map((c: TemplateComponent, i: number) => (
                      <div
                        key={i}
                        className="rounded-xl p-4 border border-[#404142] text-[#d1d2d3] bg-[#1f2021] transition-all duration-200 hover:bg-[#242526]"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm">{getComponentIcon(c.type)}</span>
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            {c.type}
                          </span>
                        </div>

                        <div className="text-[#d1d2d3]">
                          {c.text ? (
                            <p className="text-sm leading-relaxed line-clamp-3">
                              {c.text}
                            </p>
                          ) : c.buttons ? (
                            <div className="flex flex-wrap gap-2">
                              {c.buttons.map((b: TemplateButton, idx: number) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs text-[#d1d2d3] border border-[#404142]"
                                  style={{ backgroundColor: "#2a2b2c" }}
                                >
                                  {b.text}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[#808182] italic text-sm">
                              No content
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Forward Button */}
                  <div className="mt-auto">
                    <ForwardTemplate
                      templateName={tpl.name}
                      language={tpl.language}
                    >
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0">
                        <span className="flex items-center justify-center gap-2">
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
                        </span>
                      </Button>
                    </ForwardTemplate>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto p-4 text-center border-t border-[#2a2b2c]">
        <p className="text-sm text-[#808182]">
          {templates.length} templates available
        </p>
      </div>
    </div>
  );
}
