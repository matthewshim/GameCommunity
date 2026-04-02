import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchingApi } from '../api/matching';
import type { MatchInfo } from '../api/matching';
import toast from 'react-hot-toast';

export default function ChatListPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await matchingApi.getMatches();
        if (res.success) setMatches(res.data);
      } catch {
        toast.error('매칭 목록을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="app-layout">
      <div className="app-header">
        <h2>💬 채팅</h2>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>홈</button>
      </div>

      <div className="page-content">
        {loading && (
          <div className="loading-screen" style={{ minHeight: '200px' }}>
            <div className="spinner" />
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-6)' }}>
            <p style={{ fontSize: '48px', marginBottom: 'var(--sp-2)' }}>💬</p>
            <h3 style={{ marginBottom: 'var(--sp-1)' }}>아직 매칭이 없습니다</h3>
            <p className="caption" style={{ marginBottom: 'var(--sp-3)' }}>
              매칭에서 GG를 눌러 대화를 시작하세요!
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/matching')}>
              🔥 매칭하러 가기
            </button>
          </div>
        )}

        {!loading && matches.map(match => (
          <div
            key={match.matchId}
            className="card card-gold"
            style={{ cursor: 'pointer', marginBottom: 'var(--sp-1)', transition: 'transform 0.2s' }}
            onClick={() => navigate(`/chat/${match.matchId}`)}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'var(--primary)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '24px', flexShrink: 0,
              }}>⚔️</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--gold)' }}>
                  {match.partnerNickname}
                </p>
                <p className="caption">
                  매칭일: {new Date(match.matchedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '20px' }}>›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
