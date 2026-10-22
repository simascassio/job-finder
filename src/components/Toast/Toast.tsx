import { Icon } from "../Icon/Icon";
import "./Toast.css";

export function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`toast toast--${type}`} role="status">
      <span className="toast__icon"><Icon name={type === "success" ? "check" : "close"} size={16} /></span>
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Fechar mensagem"><Icon name="close" size={14} /></button>
    </div>
  );
}
