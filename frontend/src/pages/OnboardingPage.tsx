import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/profile';
import { useAuthStore } from '../store/authStore';
import { RO_SERVERS, JOB_TREE, CONTENT_TYPES, ROLE_LABELS, TIER_LABELS } from '../data/roData';
import type { JobNode } from '../data/roData';
import toast from 'react-hot-toast';

const STEPS = ['서버', '직업', '콘텐츠', '스타일', '소개'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1: 서버
  const [serverName, setServerName] = useState('');
  const [customServer, setCustomServer] = useState('');
  const [serverType, setServerType] = useState<'OFFICIAL' | 'PRIVATE'>('OFFICIAL');
  const [serverRegion, setServerRegion] = useState('GLOBAL');

  // Step 2: 직업
  const [selectedBase, setSelectedBase] = useState<JobNode | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<JobNode | null>(null);
  const [selectedJob, setSelectedJob] = useState<{ name: string; tier: string; role: string } | null>(null);
  const [baseLevel, setBaseLevel] = useState(99);

  // Step 3: 콘텐츠
  const [contents, setContents] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState('BOTH');

  // Step 4: 스타일
  const [voiceChat, setVoiceChat] = useState('OPTIONAL');
  const [playTimeStart, setPlayTimeStart] = useState('19:00');
  const [playTimeEnd, setPlayTimeEnd] = useState('23:00');
  const [experienceLevel, setExperienceLevel] = useState('VETERAN');

  // Step 5: 소개
  const [bio, setBio] = useState('');
  const [guildName, setGuildName] = useState('');

  const officialServers = RO_SERVERS.filter(s => s.type === 'OFFICIAL');
  const privateServers = RO_SERVERS.filter(s => s.type === 'PRIVATE');

  const getEffectiveServer = () => serverName === '__CUSTOM__' ? customServer : serverName;
  const canNext = () => {
    if (step === 0) return getEffectiveServer().length > 0;
    if (step === 1) return selectedJob !== null;
    if (step === 2) return contents.length > 0;
    return true;
  };

  const toggleContent = (val: string) => {
    setContents(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  // 직업 트리에서 최종 직업 추출
  function getLeafJobs(node: JobNode): { name: string; tier: string; role: string }[] {
    const results: { name: string; tier: string; role: string }[] = [];
    function walk(n: JobNode) {
      results.push({ name: n.name, tier: n.tier, role: n.role });
      if (n.children) n.children.forEach(walk);
    }
    walk(node);
    return results;
  }

  const handleSubmit = async () => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      const finalServer = getEffectiveServer();
      const foundServer = RO_SERVERS.find(s => s.name === finalServer);

      await profileApi.create({
        serverName: finalServer,
        serverType: foundServer?.type || serverType,
        serverRegion: foundServer?.region || serverRegion,
        jobClass: selectedJob.name,
        jobTier: selectedJob.tier,
        baseLevel,
        role: selectedJob.role,
        contentPreference: contents.join(','),
        lookingFor,
        experienceLevel,
        guildName: guildName || undefined,
        voiceChat,
        playTimeStart,
        playTimeEnd,
        bio,
      });

      // hasProfile 업데이트
      if (user && accessToken && refreshToken) {
        setAuth(accessToken, refreshToken, { ...user, hasProfile: true });
      }
      toast.success('프로필 설정 완료! 매칭을 시작하세요 ⚔️');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || '프로필 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <div className="app-header">
        <h2>⚔️ 프로필 설정</h2>
        <span className="caption">Step {step + 1} / {STEPS.length}</span>
      </div>

      {/* 스테퍼 */}
      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`stepper-step ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
              {i < step ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`stepper-line ${i < step ? 'completed' : i === step ? 'active' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div className="page-content">
        <div className="card animate-fade-in" style={{ marginBottom: 'var(--sp-2)' }}>

          {/* === STEP 0: 서버 === */}
          {step === 0 && (
            <>
              <h3 style={{ marginBottom: 'var(--sp-2)' }}>🖥️ 서버 선택</h3>
              <p className="caption" style={{ marginBottom: 'var(--sp-2)' }}>플레이 중인 서버를 선택하세요</p>

              <div style={{ marginBottom: 'var(--sp-2)' }}>
                <label className="caption" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>공식 서버</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {officialServers.map(s => (
                    <button key={s.name} type="button"
                      className={`tag ${serverName === s.name ? 'tag-active' : ''}`}
                      onClick={() => { setServerName(s.name); setServerType('OFFICIAL'); setServerRegion(s.region); }}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 'var(--sp-2)' }}>
                <label className="caption" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>프라이빗 서버</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {privateServers.map(s => (
                    <button key={s.name} type="button"
                      className={`tag ${serverName === s.name ? 'tag-active' : ''}`}
                      onClick={() => { setServerName(s.name); setServerType('PRIVATE'); setServerRegion(s.region); }}>
                      {s.name}
                    </button>
                  ))}
                  <button type="button"
                    className={`tag ${serverName === '__CUSTOM__' ? 'tag-active' : ''}`}
                    onClick={() => { setServerName('__CUSTOM__'); setServerType('PRIVATE'); }}>
                    ✏️ 직접 입력
                  </button>
                </div>
              </div>

              {serverName === '__CUSTOM__' && (
                <input className="input-field" placeholder="서버 이름 입력"
                  value={customServer} onChange={e => setCustomServer(e.target.value)}
                  style={{ width: '100%' }} />
              )}
            </>
          )}

          {/* === STEP 1: 직업 === */}
          {step === 1 && (
            <>
              <h3 style={{ marginBottom: 'var(--sp-2)' }}>⚔️ 직업 선택</h3>

              <div style={{ marginBottom: 'var(--sp-2)' }}>
                <label className="caption" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>1차 직업</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {JOB_TREE.map(j => (
                    <button key={j.name} type="button"
                      className={`tag ${selectedBase?.name === j.name ? 'tag-gold' : ''}`}
                      onClick={() => { setSelectedBase(j); setSelectedBranch(null); setSelectedJob(null); }}>
                      {ROLE_LABELS[j.role]?.emoji} {j.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedBase?.children && (
                <div style={{ marginBottom: 'var(--sp-2)' }}>
                  <label className="caption" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>계열 선택</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedBase.children.map(j => (
                      <button key={j.name} type="button"
                        className={`tag ${selectedBranch?.name === j.name ? 'tag-blue' : ''}`}
                        onClick={() => { setSelectedBranch(j); setSelectedJob(null); }}>
                        {j.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedBranch && (
                <div style={{ marginBottom: 'var(--sp-2)' }}>
                  <label className="caption" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>최종 직업</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {getLeafJobs(selectedBranch).map(j => (
                      <button key={j.name} type="button"
                        className={`tag ${selectedJob?.name === j.name ? 'tag-gold' : ''}`}
                        onClick={() => setSelectedJob(j)}>
                        {ROLE_LABELS[j.role]?.emoji} {j.name}
                        <span className="caption" style={{ marginLeft: '4px' }}>({TIER_LABELS[j.tier]})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob && (
                <div style={{ marginTop: 'var(--sp-2)' }}>
                  <label className="caption" style={{ display: 'block', marginBottom: '4px' }}>Base Level</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="range" min={1} max={275} value={baseLevel}
                      onChange={e => setBaseLevel(Number(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--gold)' }} />
                    <span style={{ color: 'var(--gold)', fontWeight: 700, minWidth: '40px' }}>Lv.{baseLevel}</span>
                  </div>
                  <div className="tag tag-gold" style={{ marginTop: '8px' }}>
                    {ROLE_LABELS[selectedJob.role]?.emoji} {ROLE_LABELS[selectedJob.role]?.label}
                  </div>
                </div>
              )}
            </>
          )}

          {/* === STEP 2: 콘텐츠 === */}
          {step === 2 && (
            <>
              <h3 style={{ marginBottom: 'var(--sp-2)' }}>🎯 콘텐츠 선호</h3>
              <p className="caption" style={{ marginBottom: 'var(--sp-2)' }}>주로 즐기는 콘텐츠를 선택하세요 (복수 선택)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--sp-3)' }}>
                {CONTENT_TYPES.map(c => (
                  <button key={c.value} type="button"
                    className={`tag ${contents.includes(c.value) ? 'tag-active' : ''}`}
                    style={{ padding: '8px 14px', fontSize: '14px' }}
                    onClick={() => toggleContent(c.value)}>
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>

              <label className="caption" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>찾는 대상</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { v: 'PARTY', l: '🎯 파티원' },
                  { v: 'GUILD', l: '🏰 길드' },
                  { v: 'BOTH', l: '🔄 둘 다' },
                ].map(o => (
                  <button key={o.v} type="button"
                    className={`tag ${lookingFor === o.v ? 'tag-gold' : ''}`}
                    onClick={() => setLookingFor(o.v)}>
                    {o.l}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* === STEP 3: 스타일 === */}
          {step === 3 && (
            <>
              <h3 style={{ marginBottom: 'var(--sp-2)' }}>🎤 플레이 스타일</h3>

              <div style={{ marginBottom: 'var(--sp-3)' }}>
                <label className="caption" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>보이스챗</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { v: 'REQUIRED', l: '🎤 필수' },
                    { v: 'OPTIONAL', l: '🔇 선택' },
                    { v: 'NONE', l: '❌ 안함' },
                  ].map(o => (
                    <button key={o.v} type="button"
                      className={`tag ${voiceChat === o.v ? 'tag-gold' : ''}`}
                      onClick={() => setVoiceChat(o.v)}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 'var(--sp-3)' }}>
                <label className="caption" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>주 플레이 시간</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="time" className="input-field" value={playTimeStart}
                    onChange={e => setPlayTimeStart(e.target.value)} style={{ flex: 1 }} />
                  <span className="caption">~</span>
                  <input type="time" className="input-field" value={playTimeEnd}
                    onChange={e => setPlayTimeEnd(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>

              <div>
                <label className="caption" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>경험 수준</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { v: 'NEWBIE', l: '🌱 초보' },
                    { v: 'RETURNING', l: '🔄 복귀' },
                    { v: 'VETERAN', l: '⭐ 베테랑' },
                  ].map(o => (
                    <button key={o.v} type="button"
                      className={`tag ${experienceLevel === o.v ? 'tag-gold' : ''}`}
                      onClick={() => setExperienceLevel(o.v)}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* === STEP 4: 소개 === */}
          {step === 4 && (
            <>
              <h3 style={{ marginBottom: 'var(--sp-2)' }}>📝 자기소개</h3>

              <div className="input-group" style={{ marginBottom: 'var(--sp-2)' }}>
                <label>길드 이름 (선택)</label>
                <input className="input-field" placeholder="현재 소속 길드"
                  value={guildName} onChange={e => setGuildName(e.target.value)} />
              </div>

              <div className="input-group">
                <label>한줄 소개 ({bio.length}/200)</label>
                <textarea className="input-field" placeholder="팀워크 좋은 파티원을 찾고 있습니다 🛡️"
                  value={bio} onChange={e => setBio(e.target.value)}
                  maxLength={200} rows={3}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }} />
              </div>

              {/* 프리뷰 */}
              <div className="card card-gold" style={{ marginTop: 'var(--sp-3)' }}>
                <p className="caption" style={{ marginBottom: '8px' }}>프로필 미리보기</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '36px' }}>{ROLE_LABELS[selectedJob?.role || 'TANK']?.emoji}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--gold)' }}>{user?.nickname}</p>
                    <p className="caption">{selectedJob?.name} ({TIER_LABELS[selectedJob?.tier || 'THIRD']}) Lv.{baseLevel}</p>
                    <p className="caption">📍 {getEffectiveServer()}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 네비게이션 버튼 */}
        <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
          {step > 0 && (
            <button className="btn btn-outline" style={{ flex: 1 }}
              onClick={() => setStep(s => s - 1)}>
              ← 이전
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" style={{ flex: 1 }}
              disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
              다음 →
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }}
              disabled={loading} onClick={handleSubmit}>
              {loading ? '저장 중...' : '⚔️ 프로필 완료'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
