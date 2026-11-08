export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SkillUsed {
  name: string;
  reason?: string;
}

export interface Source {
  title: string;
  snippet: string;
  score?: number;
}

export interface ToolCall {
  name: string;
  args?: Record<string, unknown>;
  result?: string;
}

export interface ChatResponse {
  reply: string;
  skill_used?: SkillUsed | null;
  sources?: Source[] | null;
  tool_calls?: ToolCall[] | null;
}
