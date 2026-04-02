import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { matchingApi } from '../api/matching';
import type { Candidate } from '../api/matching';
import { ROLE_LABELS, TIER_LABELS, CONTENT_TYPES } from '../data/roData';
import toast from 'react-hot-toast';

const TIER_CLASS: Record<string, string> = {
  BRONZE: 'tier-bronze', SILVER: 'tier-silver', GOLD: 'tier-gold',
  PLATINUM: 'tier-platinum', DIAMOND: 'tier-diamond',
};

const TIER_EMOJI: Record<string, string> = {
  BRONZE: '🥉', SILVER: '🥈', GOLD: '🥇', PLATINUM: '💎', DIAMOND: '👑',
};

function SwipeCard({
  candidate, onSwipe, style,
}: {
  candidate: Candidate;
  onSwipe: (type: 'GG' | 'PASS') => void;
  style?: React.CSSProperties;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const ggOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) onSwipe('GG');
    else if (info.offset.x < -100) onSwipe('PASS');
  };

  const roleInfo = ROLE_LABELS[candidate.role] || { label: candidate.role, emoji: '⚔️' };
  const contentLabels = candidate.contentPreference
    .map(c => CONTENT_TYPES.find(ct => ct.value === c))
    .filter(Boolean);

  return (
    <motion.div
      className="match-card"
      style={{ x, rotate, position: 'absolute', width: '100%', cursor: 'grab', ...style }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* GG/PASS 오버레이 */}
      <motion.div style={{
        position: 'absolute', top: '20px', right: '20px', opacity: ggOpacity,
        background: 'rgba(34, 197, 94, 0.9)', padding: '8px 20px', borderRadius: '8px',
        fontWeight: 800, fontSize: '24px', color: 'white', zIndex: 10,
        border: '3px solid rgba(34, 197, 94, 1)', transform: 'rotate(-15deg)',
      }}>GG!</motion.div>
      <motion.div style={{
        position: 'absolute', top: '20px', left: '20px', opacity: passOpacity,
        background: 'rgba(239, 68, 68, 0.9)', padding: '8px 20px', borderRadius: '8px',
        fontWeight: 800, fontSize: '24px', color: 'white', zIndex: 10,
        border: '3px solid rgba(239, 68, 68, 1)', transform: 'rotate(15deg)',
      }}>PASS</motion.div>

      {/* 카드 헤더 */}
      <div className="match-card-header">
        <span style={{ fontSize: '72px' }}>{roleInfo.emoji}</span>
      </div>

      {/* 카드 바디 */}
      <div className="match-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p className="match-card-name">{candidate.nickname}</p>
            <p className="match-card-job">
              {candidate.jobClass} ({TIER_LABELS[candidate.jobTier] || candidate.jobTier}) Lv.{candidate.baseLevel}
            </p>
          </div>
          <span className={`tier-badge ${TIER_CLASS[candidate.mannerTier]}`}>
            {TIER_EMOJI[candidate.mannerTier]} {candidate.mannerTier}
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 'var(--sp-1)' }}>
          📍 {candidate.serverName} ({candidate.serverType === 'OFFICIAL' ? '공식' : '프라이빗'})
        </p>

        {/* 태그 */}
        <div className="match-card-tags">
          <span className="tag tag-gold">{roleInfo.emoji} {roleInfo.label}</span>
          {contentLabels.slice(0, 3).map(c => (
            <span key={c!.value} className="tag">{c!.emoji} {c!.label}</span>
          ))}
          {candidate.voiceChat === 'REQUIRED' && <span className="tag tag-blue">🎤 필수</span>}
          {candidate.playTimeStart && (
            <span className="tag">🕐 {candidate.playTimeStart}~{candidate.playTimeEnd}</span>
          )}
        </div>

        {/* 매너 온도 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--sp-1)' }}>
          <span className="caption">매너</span>
          <div className="manner-gauge" style={{ flex: 1 }}>
            <div className="manner-gauge-fill" style={{ width: `${candidate.mannerScore}%` }} />
          </div>
          <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '13px' }}>
            {candidate.mannerScore}°C
          </span>
        </div>

        {/* 자기소개 */}
        {candidate.bio && <div className="match-card-bio">"{candidate.bio}"</div>}
      </div>
    </motion.div>
  );
}

export default function MatchingPage() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState<{ nickname: string; matchId: number } | null>(null);

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await matchingApi.getCandidates(20);
      if (res.success) {
        setCandidates(res.data);
        setCurrentIdx(0);
      }
    } catch (err: any) {
      if (err.response?.status === 500 && err.response?.data?.message?.includes('프로필')) {
        toast.error('프로필을 먼저 설정해주세요!');
        navigate('/onboarding');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadCandidates(); }, [loadCandidates]);

  const handleSwipe = async (type: 'GG' | 'PASS') => {
    const candidate = candidates[currentIdx];
    if (!candidate) return;

    try {
      const { data: res } = await matchingApi.swipe(candidate.userId, type);
      if (res.success && res.data.matched) {
        setShowMatch({ nickname: candidate.nickname, matchId: res.data.matchId! });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || '스와이프에 실패했습니다.');
    }

    setCurrentIdx(prev => prev + 1);
  };

  const current = candidates[currentIdx];

  return (
    <div className="app-layout">
      <div className="app-header">
        <h2>⚔️ SyncPlay</h2>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>홈</button>
      </div>

      <div className="page-content" style={{ position: 'relative', minHeight: '500px' }}>
        {loading && (
          <div className="loading-screen" style={{ minHeight: '400px' }}>
            <div className="spinner" />
            <p className="caption">모험가를 찾고 있습니다...</p>
          </div>
        )}

        {!loading && !current && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-6)' }}>
            <p style={{ fontSize: '48px', marginBottom: 'var(--sp-2)' }}>🏰</p>
            <h3 style={{ marginBottom: 'var(--sp-1)' }}>모든 후보를 확인했습니다</h3>
            <p className="caption" style={{ marginBottom: 'var(--sp-3)' }}>
              잠시 후 새로운 모험가가 나타날 수 있어요!
            </p>
            <button className="btn btn-primary" onClick={loadCandidates}>🔄 다시 찾기</button>
          </div>
        )}

        {!loading && current && (
          <div style={{ position: 'relative', height: '560px' }}>
            <AnimatePresence>
              <SwipeCard
                key={current.userId}
                candidate={current}
                onSwipe={handleSwipe}
              />
            </AnimatePresence>
          </div>
        )}

        {/* GG / PASS 버튼 */}
        {!loading && current && (
          <div className="match-card-actions" style={{ marginTop: 'var(--sp-2)' }}>
            <button className="btn btn-pass" onClick={() => handleSwipe('PASS')}>✖</button>
            <button className="btn btn-gg" onClick={() => handleSwipe('GG')}>GG</button>
          </div>
        )}
      </div>

      {/* 매칭 성공 모달 */}
      {showMatch && (
        <div className="modal-overlay" onClick={() => setShowMatch(null)}>
          <div className="modal-box animate-fade-in" onClick={e => e.stopPropagation()}
            style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '64px', marginBottom: 'var(--sp-2)' }}>🎉</p>
            <h2 className="modal-title" style={{ fontSize: '28px' }}>GG! 매칭 성공!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-3)' }}>
              <strong style={{ color: 'var(--gold)' }}>{showMatch.nickname}</strong>님과 매칭되었습니다!
            </p>
            <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
              <button className="btn btn-primary" style={{ flex: 1 }}
                onClick={() => { setShowMatch(null); navigate(`/chat/${showMatch.matchId}`); }}>
                💬 채팅 시작
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }}
                onClick={() => setShowMatch(null)}>
                계속 매칭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
