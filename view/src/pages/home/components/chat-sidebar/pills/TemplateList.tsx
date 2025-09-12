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
      <div className="min-h-[200px] flex items-center justify-center rounded-xl mx-4 my-6 border border-[#12382B] bg-[#161717]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#12382B] border-t-white rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-300 font-medium">Loading templates...</p>
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
    <div className="h-screen flex flex-col custom-scroll bg-[#161717] text-gray-200">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4 p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#12382B] rounded-xl mb-4 shadow-lg">
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
          <h1 className="text-3xl font-bold text-white mb-2">
            Message Templates
          </h1>
          <p className="text-gray-400 text-lg">
            Manage and forward your template collection
          </p>
        </div>
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-2xl border border-[#12382B] shadow-lg hover:shadow-xl transition-all duration-300 bg-[#1c1c1c] hover:bg-[#222222]"
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Template Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#12382B] rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold text-white">
                            {tpl.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white leading-tight">
                            {tpl.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-white border border-[#12382B] bg-[#12382B]/70">
                        {tpl.language}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-gray-300 border border-[#12382B] bg-[#161717]">
                        {tpl.components.length} components
                      </span>
                    </div>
                  </div>

                  {/* Components */}
                  <div className="flex-1 space-y-3 mb-6">
                    {tpl.components.map((c: TemplateComponent, i: number) => (
                      <div
                        key={i}
                        className="rounded-xl p-4 border border-[#12382B] text-gray-300 bg-[#161717] hover:bg-[#1e1e1e] transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm">{getComponentIcon(c.type)}</span>
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            {c.type}
                          </span>
                        </div>

                        <div>
                          {c.text ? (
                            <p className="text-sm leading-relaxed line-clamp-3 text-gray-200">
                              {c.text}
                            </p>
                          ) : c.buttons ? (
                            <div className="flex flex-wrap gap-2">
                              {c.buttons.map((b: TemplateButton, idx: number) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs border border-[#12382B] bg-[#1e1e1e] text-gray-300"
                                >
                                  {b.text}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="italic text-sm text-gray-500">
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
                      <Button className="w-full bg-[#12382B] hover:bg-[#0f2d22] text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0">
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
      <div className="max-w-7xl mx-auto p-4 text-center border-t border-[#12382B]">
        <p className="text-sm text-gray-400">
          {templates.length} templates available
        </p>
      </div>
    </div>
  );
}
