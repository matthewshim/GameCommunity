import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data: res } = await authApi.signup(email, password, nickname);
      if (res.success) {
        setAuth(res.data.accessToken, res.data.refreshToken, res.data.user);
        toast.success('모험가 등록 완료! 프로필을 설정해주세요 ⚔️');
        navigate('/onboarding');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || '등록에 실패했습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <div className="auth-logo">
          <span className="auth-icon animate-float">🛡️</span>
          <h1>SyncPlay</h1>
          <p className="auth-subtitle">모험가 등록</p>
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
            <label>닉네임</label>
            <input
              className="input-field"
              type="text" placeholder="프론테라에서 불릴 이름 (2~20자)"
              value={nickname} onChange={(e) => setNickname(e.target.value)}
              required minLength={2} maxLength={20}
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              className="input-field"
              type="password" placeholder="6자 이상"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={6}
            />
          </div>

          {error && <p className="error-text">⚠ {error}</p>}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? '등록 중...' : '모험 시작하기'}
          </button>
        </form>

        <div className="auth-footer">
          이미 모험가이신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}
