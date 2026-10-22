import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../../components/Button/Button";
import { Icon } from "../../components/Icon/Icon";
import { Input } from "../../components/Input/Input";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import { validateLogin, type LoginFormData } from "../../utils/validation";
import "./Login.css";

const initialForm: LoginFormData = { email: "demo@jobfinder.local", password: "JobFinder123" };

export function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/home";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    setServerError("");
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  function update(field: keyof LoginFormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError("");
  }

  return (
    <main className="auth-page">
      <div className="auth-page__topbar container">
        <Link to="/login" className="brand"><span className="brand__mark"><Icon name="briefcase" size={17} /></span><span>JobFinder</span></Link>
        <ThemeToggle />
      </div>

      <div className="auth-shell container">
        <section className="auth-visual">
          <span className="auth-visual__badge"><Icon name="sparkles" size={15} /> Busca inteligente</span>
          <h1>Encontre oportunidades sem viver em sites de vagas.</h1>
          <p>Configure seus critérios uma vez e acompanhe novas oportunidades em um só lugar.</p>
          <div className="auth-visual__metrics">
            <div><strong>94%</strong><span>compatibilidade demonstrativa</span></div>
            <div><strong>1 painel</strong><span>para organizar suas buscas</span></div>
          </div>
        </section>

        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card__head">
            <p className="eyebrow">Bem-vindo de volta</p>
            <h2 id="login-title">Entre na sua conta</h2>
            <p>Acesse suas buscas salvas e acompanhe novas oportunidades.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <Input label="E-mail" type="email" name="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="voce@email.com" autoComplete="email" error={errors.email} icon="user" />

            <div className="field">
              <label className="field__label" htmlFor="password">Senha</label>
              <div className={`field__control ${errors.password ? "field__control--error" : ""}`}>
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => update("password", event.target.value)} autoComplete="current-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}><Icon name={showPassword ? "eye-off" : "eye"} size={18} /></button>
              </div>
              {errors.password ? <p className="field__error" id="password-error">{errors.password}</p> : null}
            </div>

            {serverError ? <div className="auth-alert auth-alert--error" role="alert">{serverError}</div> : null}
            <Button type="submit" size="lg" fullWidth loading={loading}>Entrar</Button>
            <div className="auth-form__links"><Link to="/recuperar-senha">Esqueci minha senha</Link></div>
          </form>

          <div className="auth-divider"><span>ou</span></div>
          <p className="auth-card__footer">Ainda não tem uma conta? <Link to="/cadastro">Criar minha conta</Link></p>
          <p className="demo-note">Demonstração: demo@jobfinder.local · JobFinder123</p>
        </section>
      </div>
    </main>
  );
}
