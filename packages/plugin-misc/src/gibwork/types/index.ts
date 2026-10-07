export interface GibworkCreateTaskReponse {
  status: "success" | "error";
  taskId?: string | undefined;
  signature?: string | undefined;
}
