import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data: res } = await authApi.login(email, password);
      if (res.success) {
        setAuth(res.data.accessToken, res.data.refreshToken, res.data.user);
        toast.success('로그인 성공! 🎮');
        navigate(res.data.user.hasProfile ? '/matching' : '/onboarding');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || '로그인에 실패했습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>⚔️ SyncPlay</h1>
          <p>라그나로크 온라인 파티/길드 매칭</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>이메일</label>
            <input
              className={`input-field ${error ? 'input-error' : ''}`}
              type="email" placeholder="adventurer@prontera.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              className={`input-field ${error ? 'input-error' : ''}`}
              type="password" placeholder="6자 이상"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={6}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <div className="auth-divider">or</div>

          <button className="btn btn-google btn-full" type="button" disabled>
            🔒 Google 로그인 (준비 중)
          </button>
        </form>

        <div className="auth-footer">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
