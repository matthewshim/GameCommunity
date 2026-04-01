import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <div className="app-header">
        <h2>⚔️ SyncPlay</h2>
        <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '8px 16px', fontSize: '13px' }}>
          로그아웃
        </button>
      </div>

      <div className="page-content">
        <div style={{ 
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', 
          padding: '32px', border: '1px solid var(--border)', marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>
            🎮 안녕하세요, <span style={{ color: 'var(--primary-light)' }}>{user?.nickname}</span>님!
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>매너 온도</span>
            <div style={{ flex: 1 }}>
              <div className="manner-gauge">
                <div className="manner-gauge-fill" style={{ width: `${user?.mannerScore || 50}%` }}></div>
              </div>
            </div>
            <span style={{ 
              color: 'var(--accent-gg)', fontWeight: 700, fontSize: '14px'
            }}>{user?.mannerScore}°C</span>
          </div>

          <div style={{ 
            display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
            background: 'rgba(108, 92, 231, 0.2)', color: 'var(--primary-light)',
            fontSize: '13px', fontWeight: 600
          }}>
            🏅 {user?.mannerTier} 티어
          </div>
        </div>

        {!user?.hasProfile && (
          <div style={{ 
            background: 'rgba(108, 92, 231, 0.1)', borderRadius: 'var(--radius-lg)',
            padding: '24px', border: '1px solid var(--primary)', textAlign: 'center'
          }}>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
              RO 프로필을 설정하면 매칭을 시작할 수 있습니다!
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/onboarding')}>
              🛡️ RO 프로필 설정하기
            </button>
          </div>
        )}

        {user?.hasProfile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/matching')}>
              🔥 매칭 시작
            </button>
            <button className="btn btn-outline btn-full" onClick={() => navigate('/chat')}>
              💬 채팅
            </button>
          </div>
        )}

        <div style={{ 
          marginTop: '32px', padding: '20px', background: 'var(--bg-surface)', 
          borderRadius: 'var(--radius)', border: '1px solid var(--border)',
          textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px'
        }}>
          <p>🚧 Sprint 2에서 매칭/프로필 기능이 추가됩니다</p>
          <p style={{ marginTop: '4px' }}>v0.1.0 — Phase 1 MVP</p>
        </div>
      </div>
    </div>
  );
}
