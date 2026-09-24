import style from "./emptyState.module.scss";

export default function EmptyState({ title, text, action, compact = false }) {
  return (
    <div className={`${style.empty} ${compact ? style.compact : ""}`}>
      <div className={style.art} aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {action && <div className={style.action}>{action}</div>}
    </div>
  );
}
