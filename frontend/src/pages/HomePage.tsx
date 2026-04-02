import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const TIER_CLASS: Record<string, string> = {
  BRONZE: 'tier-bronze',
  SILVER: 'tier-silver',
  GOLD: 'tier-gold',
  PLATINUM: 'tier-platinum',
  DIAMOND: 'tier-diamond',
};

const TIER_EMOJI: Record<string, string> = {
  BRONZE: '🥉', SILVER: '🥈', GOLD: '🥇', PLATINUM: '💎', DIAMOND: '👑',
};

export default function HomePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tierKey = user?.mannerTier || 'GOLD';

  return (
    <div className="app-layout">
      <div className="app-header">
        <h2>⚔️ SyncPlay</h2>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>

        {/* 유저 카드 */}
        <div className="card card-gold animate-fade-in">
          <h3 style={{ marginBottom: 'var(--sp-2)', fontSize: '20px' }}>
            🎮 안녕하세요, <span style={{ color: 'var(--gold)' }}>{user?.nickname}</span>님!
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--sp-2)' }}>
            <span className="caption">매너 온도</span>
            <div style={{ flex: 1 }}>
              <div className="manner-gauge">
                <div className="manner-gauge-fill" style={{ width: `${user?.mannerScore || 50}%` }} />
              </div>
            </div>
            <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '15px' }}>
              {user?.mannerScore}°C
            </span>
          </div>

          <span className={`tier-badge ${TIER_CLASS[tierKey]}`}>
            {TIER_EMOJI[tierKey]} {tierKey}
          </span>
        </div>

        {/* RO 프로필 미설정 */}
        {!user?.hasProfile && (
          <div className="card card-highlight animate-fade-in" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
            <p style={{ marginBottom: 'var(--sp-2)', color: 'var(--text-secondary)' }}>
              RO 프로필을 설정하면 매칭을 시작할 수 있습니다!
            </p>
            <button className="btn btn-primary animate-glow" onClick={() => navigate('/onboarding')}>
              🛡️ RO 프로필 설정
            </button>
          </div>
        )}

        {/* 프로필 설정 완료 */}
        {user?.hasProfile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/matching')}>
              🔥 매칭 시작
            </button>
            <button className="btn btn-secondary btn-full" onClick={() => navigate('/chat')}>
              💬 채팅
            </button>
          </div>
        )}

        {/* 버전 정보 */}
        <div className="card" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
          <p className="caption">✅ Phase 1 MVP Complete</p>
          <p className="caption" style={{ marginTop: '4px' }}>v0.4.0 — 매칭 + 채팅 + 매너 평가</p>
        </div>
      </div>
    </div>
  );
}
