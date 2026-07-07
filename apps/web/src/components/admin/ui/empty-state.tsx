type Props = {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({ emoji = "📭", title, description, action }: Props) {
  return (
    <div className="admin-empty-state">
      <span className="admin-empty-state-icon" aria-hidden>
        {emoji}
      </span>
      <h3>{title}</h3>
      {description ? <p className="admin-muted">{description}</p> : null}
      {action ? <div className="admin-empty-state-action">{action}</div> : null}
    </div>
  );
}
