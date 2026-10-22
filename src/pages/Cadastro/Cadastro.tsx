import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/Button/Button";
import { Icon } from "../../components/Icon/Icon";
import { Input } from "../../components/Input/Input";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import { formatCPF } from "../../utils/cpf";
import { maskPhone, validateRegistration, type RegistrationFormData } from "../../utils/validation";
import "./Cadastro.css";

const initialForm: RegistrationFormData = {
  name: "", email: "", cpf: "", birthDate: "", phone: "", password: "", confirmPassword: "", termsAccepted: false,
};

export function Cadastro() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field: keyof RegistrationFormData, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError("");
  }

  function handleCPF(event: ChangeEvent<HTMLInputElement>) { update("cpf", formatCPF(event.target.value)); }
  function handlePhone(event: ChangeEvent<HTMLInputElement>) { update("phone", maskPhone(event.target.value)); }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegistration(form);
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await register(form);
      navigate("/home", { replace: true });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page__topbar container">
        <Link to="/login" className="brand"><span className="brand__mark"><Icon name="briefcase" size={17} /></span><span>JobFinder</span></Link>
        <ThemeToggle />
      </div>

      <div className="register-shell container">
        <section className="register-heading">
          <p className="eyebrow">Comece agora</p>
          <h1>Crie seu perfil profissional.</h1>
          <p>Com seu perfil salvo, o JobFinder poderá personalizar buscas e, futuramente, calcular compatibilidade com cada oportunidade.</p>
          <div className="register-note"><Icon name="sparkles" size={17} /><span>Esta versão usa apenas dados locais de demonstração.</span></div>
        </section>

        <section className="auth-card register-card" aria-labelledby="register-title">
          <div className="auth-card__head"><h2 id="register-title">Seus dados</h2><p>Preencha os campos para criar sua conta de teste.</p></div>
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <Input label="Nome completo" name="name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Seu nome completo" autoComplete="name" error={errors.name} />
            <Input label="E-mail" name="email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="voce@email.com" autoComplete="email" error={errors.email} />
            <Input label="CPF" name="cpf" value={form.cpf} onChange={handleCPF} placeholder="000.000.000-00" inputMode="numeric" maxLength={14} error={errors.cpf} hint="A validação usa os dígitos verificadores do CPF." />
            <Input label="Data de nascimento" name="birthDate" type="date" value={form.birthDate} onChange={(event) => update("birthDate", event.target.value)} max={new Date().toISOString().slice(0, 10)} error={errors.birthDate} />
            <Input label="Telefone" name="phone" value={form.phone} onChange={handlePhone} placeholder="(21) 99999-9999" inputMode="tel" maxLength={15} error={errors.phone} />

            <PasswordField label="Senha" value={form.password} onChange={(value) => update("password", value)} show={showPassword} onToggle={() => setShowPassword((show) => !show)} error={errors.password} />
            <PasswordField label="Confirmação de senha" value={form.confirmPassword} onChange={(value) => update("confirmPassword", value)} show={showConfirmPassword} onToggle={() => setShowConfirmPassword((show) => !show)} error={errors.confirmPassword} />

            <label className={`terms-check ${errors.termsAccepted ? "terms-check--error" : ""}`}>
              <input type="checkbox" checked={form.termsAccepted} onChange={(event) => update("termsAccepted", event.target.checked)} aria-describedby={errors.termsAccepted ? "terms-error" : undefined} />
              <span>Li e concordo com os <a href="#termos" onClick={(event) => event.preventDefault()}>termos de uso</a> e <a href="#privacidade" onClick={(event) => event.preventDefault()}>política de privacidade</a>.</span>
            </label>
            {errors.termsAccepted ? <p className="field__error" id="terms-error">{errors.termsAccepted}</p> : null}
            {serverError ? <div className="auth-alert auth-alert--error" role="alert">{serverError}</div> : null}
            <Button type="submit" size="lg" fullWidth loading={loading}>Criar minha conta</Button>
          </form>
          <p className="auth-card__footer register-footer">Já possui uma conta? <Link to="/login">Voltar para o login</Link></p>
        </section>
      </div>
    </main>
  );
}

interface PasswordFieldProps {
  label: string; value: string; error?: string; show: boolean; onChange: (value: string) => void; onToggle: () => void;
}

function PasswordField({ label, value, error, show, onChange, onToggle }: PasswordFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}</label>
      <div className={`field__control ${error ? "field__control--error" : ""}`}>
        <input id={id} type={show ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} autoComplete="new-password" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} placeholder="Mínimo de 8 caracteres" />
        <button type="button" className="password-toggle" onClick={onToggle} aria-label={show ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}><Icon name={show ? "eye-off" : "eye"} size={18} /></button>
      </div>
      {error ? <p className="field__error" id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}
