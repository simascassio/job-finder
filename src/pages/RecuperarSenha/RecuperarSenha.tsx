import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Button } from "../../components/Button/Button";
import { Icon } from "../../components/Icon/Icon";
import { Input } from "../../components/Input/Input";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { requestPasswordRecovery } from "../../services/authService";
import { isValidEmail } from "../../utils/validation";
import "./RecuperarSenha.css";

export function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Digite um e-mail válido.");
      setSuccess(false);
      return;
    }
    setError("");
    setLoading(true);
    await requestPasswordRecovery(email);
    setLoading(false);
    setSuccess(true);
  }

  return (
    <main className="recovery-page auth-page">
      <div className="auth-page__topbar container">
        <Link to="/login" className="brand"><span className="brand__mark"><Icon name="briefcase" size={17} /></span><span>JobFinder</span></Link>
        <ThemeToggle />
      </div>
      <section className="recovery-shell container">
        <div className="recovery-card auth-card">
          <div className="recovery-icon"><Icon name="sparkles" size={21} /></div>
          <p className="eyebrow">Acesso à conta</p>
          <h1>Recupere sua senha</h1>
          <p>Informe o e-mail da sua conta. Nesta versão de demonstração, o envio do link será apenas simulado.</p>
          <form className="recovery-form" onSubmit={handleSubmit} noValidate>
            <Input label="E-mail" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); setSuccess(false); }} placeholder="voce@email.com" error={error} icon="user" />
            {success ? <div className="recovery-success" role="status"><Icon name="check" size={17} /><span>Link de recuperação simulado enviado para <strong>{email}</strong>.</span></div> : null}
            <Button type="submit" size="lg" fullWidth loading={loading}>Enviar link de recuperação</Button>
          </form>
          <Link to="/login" className="recovery-back"><Icon name="arrow-left" size={15} /> Voltar para o login</Link>
        </div>
      </section>
    </main>
  );
}
