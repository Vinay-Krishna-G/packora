import { FileImportance } from "@codemelt/shared";

export type EntrypointType = "server" | "frontend" | "app-shell" | "router-root" | "layout-root";

export interface FileSemanticSummary {
  path: string;
  name: string;
  summary: string;
  importance: FileImportance;
  isEntrypoint: boolean;
  entrypointType?: EntrypointType;
  routes?: string[];
  exports?: string[];
  imports?: string[];
}

export interface DirectorySemanticSummary {
  path: string;
  summary: string;
  itemCount: number;
}

export interface RouteDetail {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "ALL" | "UNKNOWN";
  handlerFile: string;
}

export interface RequestFlow {
  name: string;
  steps: string[];
}

export interface SemanticRepositoryAnalysis {
  fileSummaries: Record<string, FileSemanticSummary>;
  directorySummaries: Record<string, DirectorySemanticSummary>;
  entrypoints: FileSemanticSummary[];
  routes: RouteDetail[];
  flows: RequestFlow[];
}
