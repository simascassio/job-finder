import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { Notifications } from "../Notifications/Notifications";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import "./Header.css";

export function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const firstName = user?.name.split(" ")[0] ?? "Usuário";
  const initials = user?.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? "JF";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="app-header">
      <div className="app-header__inner container">
        <Link to="/home" className="brand" onClick={() => setMenuOpen(false)} aria-label="JobFinder início">
          <span className="brand__mark"><Icon name="briefcase" size={17} /></span>
          <span>JobFinder</span>
        </Link>

        <nav className={`header-nav ${menuOpen ? "header-nav--open" : ""}`} aria-label="Navegação principal">
          <NavLink to="/home" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "header-nav__link header-nav__link--active" : "header-nav__link"}>
            Dashboard
          </NavLink>
          <a href="#busca" onClick={() => setMenuOpen(false)} className="header-nav__link">Encontrar vagas</a>
          <a href="#buscas" onClick={() => setMenuOpen(false)} className="header-nav__link">Minhas buscas</a>
        </nav>

        <div className="app-header__actions">
          <div className="notification-wrap">
            <button type="button" className="header-icon-button" aria-label="Abrir notificações" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}>
              <Icon name="bell" size={19} />
              <span className="notification-dot" aria-hidden="true">3</span>
            </button>
            {notificationsOpen ? <Notifications onClose={() => setNotificationsOpen(false)} /> : null}
          </div>

          <ThemeToggle />

          <div className="user-menu">
            <div className="user-menu__avatar" aria-hidden="true">{initials}</div>
            <div className="user-menu__text"><strong>{firstName}</strong><span>Conta</span></div>
            <button type="button" className="user-menu__logout" onClick={handleLogout} aria-label="Sair"><Icon name="logout" size={18} /></button>
          </div>

          <Button
            type="button" variant="ghost" size="sm"
            className="header-mobile-menu" icon={menuOpen ? "close" : "menu"}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
