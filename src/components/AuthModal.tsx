import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword, isConfigured } =
    useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      toast.error('Configurez Firebase dans le fichier .env');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Connexion réussie');
      onClose();
      navigate('/account');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error('Acceptez les conditions générales');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (!isConfigured) {
      toast.error('Configurez Firebase dans le fichier .env');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      toast.success('Compte créé avec succès');
      onClose();
      navigate('/account');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isConfigured) {
      toast.error('Configurez Firebase dans le fichier .env');
      return;
    }
    try {
      await signInWithGoogle();
      toast.success('Connexion Google réussie');
      onClose();
      navigate('/account');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur Google');
    }
  };

  const handleReset = async () => {
    if (!email) {
      toast.error('Entrez votre adresse email');
      return;
    }
    try {
      await resetPassword(email);
      toast.success('Email de réinitialisation envoyé');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[80] data-[state=open]:animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-card p-8 max-h-[90vh] overflow-y-auto">
          <Dialog.Close className="absolute top-4 right-4 text-muted hover:text-primary">
            <X size={24} />
          </Dialog.Close>

          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white font-extrabold">
              N
            </span>
            <span className="text-2xl font-extrabold text-primary">nexora.</span>
          </div>

          <Tabs.Root value={tab} onValueChange={setTab}>
            <Tabs.List className="flex gap-4 mb-6 border-b border-border">
              <Tabs.Trigger
                value="login"
                className="pb-2 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary font-semibold text-muted"
              >
                Se connecter
              </Tabs.Trigger>
              <Tabs.Trigger
                value="register"
                className="pb-2 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary font-semibold text-muted"
              >
                Créer un compte
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium mb-1 block">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-coolblue"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1 block">Mot de passe</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-coolblue pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? 'Chargement...' : 'Se connecter'}
                </button>
              </form>
              <div className="flex items-center gap-3 my-4 text-sm text-muted">
                <span className="flex-1 h-px bg-border" />
                ou
                <span className="flex-1 h-px bg-border" />
              </div>
              <button
                type="button"
                onClick={handleGoogle}
                className="w-full border border-border rounded py-2.5 flex items-center justify-center gap-2 hover:bg-page"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                </svg>
                Continuer avec Google
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-primary hover:underline mt-4 block mx-auto"
              >
                Mot de passe oublié ?
              </button>
            </Tabs.Content>

            <Tabs.Content value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium mb-1 block">Prénom</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-coolblue"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium mb-1 block">Nom</span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-coolblue"
                      required
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-medium mb-1 block">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-coolblue"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1 block">Mot de passe</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-coolblue"
                    required
                    minLength={6}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1 block">Confirmer le mot de passe</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-coolblue"
                    required
                  />
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="accent-primary mt-1"
                  />
                  J&apos;accepte les conditions générales
                </label>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? 'Chargement...' : 'Créer mon compte'}
                </button>
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
