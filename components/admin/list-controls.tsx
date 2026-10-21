export function PublishButton({
  action,
  id,
  published,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  published: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="published" value={published ? "false" : "true"} />
      <button className="btn btn-secondary" type="submit">
        {published ? "Gizle" : "Yayınla"}
      </button>
    </form>
  );
}

export function SortButtons({
  action,
  id,
  index,
  total,
  extra,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  index: number;
  total: number;
  extra?: Record<string, string>;
}) {
  return (
    <div className="flex gap-1">
      <SortForm action={action} direction="up" disabled={index === 0} extra={extra} id={id} label="Yukarı taşı" />
      <SortForm
        action={action}
        direction="down"
        disabled={index === total - 1}
        extra={extra}
        id={id}
        label="Aşağı taşı"
      />
    </div>
  );
}

function SortForm({
  action,
  id,
  direction,
  disabled,
  label,
  extra,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  direction: "up" | "down";
  disabled: boolean;
  label: string;
  extra?: Record<string, string>;
}) {
  const symbol = direction === "up" ? "↑" : "↓";
  if (disabled) {
    return (
      <button aria-label={label} className="icon-btn" disabled type="button">
        {symbol}
      </button>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      {extra
        ? Object.entries(extra).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)
        : null}
      <button aria-label={label} className="icon-btn" type="submit">
        {symbol}
      </button>
    </form>
  );
}
