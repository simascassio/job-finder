import { useState } from "react";
import { MOCK_NOTIFICATIONS } from "../../data/mockJobs";
import { Icon } from "../Icon/Icon";
import "./Notifications.css";

interface NotificationsProps { onClose: () => void; }

export function Notifications({ onClose }: NotificationsProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((item) => !item.read).length;

  function markAllRead() {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  }

  return (
    <div className="notifications-popover" role="dialog" aria-label="Notificações">
      <div className="notifications-popover__head">
        <div><strong>Notificações</strong><span>{unreadCount} não lidas</span></div>
        <button type="button" onClick={markAllRead} className="notifications-popover__read">Marcar como lidas</button>
      </div>
      <div className="notifications-list">
        {notifications.map((notification) => (
          <button type="button" key={notification.id} className={`notification-item ${notification.read ? "" : "notification-item--unread"}`} onClick={onClose}>
            <span className="notification-item__icon"><Icon name="sparkles" size={15} /></span>
            <span className="notification-item__body">
              <strong>{notification.title}</strong>
              <span>{notification.message}</span>
              <small>{notification.createdAt}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="notifications-popover__foot"><span>Dados demonstrativos do MVP</span></div>
    </div>
  );
}
