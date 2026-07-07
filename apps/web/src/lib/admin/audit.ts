type SupabaseClient = ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>;

export type AuditAction = "create" | "update" | "reorder" | "delete";

export type AuditEntry = {
  entityType: string;
  entityId: string;
  action: AuditAction;
  summary: string;
  changes?: Record<string, unknown>;
};

export type AuditLogRow = {
  id: string;
  userEmail: string | null;
  entityType: string;
  entityId: string;
  action: AuditAction;
  summary: string;
  createdAt: string;
};

export async function logAudit(supabase: SupabaseClient, entry: AuditEntry) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("audit_log").insert({
    user_id: user?.id ?? null,
    user_email: user?.email ?? null,
    entity_type: entry.entityType,
    entity_id: entry.entityId,
    action: entry.action,
    summary: entry.summary,
    changes: entry.changes ?? {},
  });

  if (error) throw error;
}

export async function loadRecentAuditLogs(supabase: SupabaseClient, limit = 15): Promise<AuditLogRow[]> {
  const { data, error } = await supabase
    .from("audit_log")
    .select("id, user_email, entity_type, entity_id, action, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    userEmail: row.user_email,
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action as AuditAction,
    summary: row.summary,
    createdAt: row.created_at,
  }));
}
