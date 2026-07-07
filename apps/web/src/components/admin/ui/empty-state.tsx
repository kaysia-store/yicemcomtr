type Props = {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({ icon = "inbox", title, description, action }: Props) {
  return (
    <div className="admin-empty-state">
      <span className="material-symbols-outlined admin-empty-state-icon" aria-hidden>
        {icon}
      </span>
      <h3>{title}</h3>
      {description ? <p className="admin-muted">{description}</p> : null}
      {action ? <div className="admin-empty-state-action">{action}</div> : null}
    </div>
  );
}
