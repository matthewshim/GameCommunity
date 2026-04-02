import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '../store/authStore';
import { chatApi, evaluationApi } from '../api/chat';
import type { ChatMsg } from '../api/chat';
import toast from 'react-hot-toast';

export default function ChatRoomPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [showEval, setShowEval] = useState(false);
  const [evalDone, setEvalDone] = useState(false);
  const [scores, setScores] = useState({ communication: 3, teamwork: 3, mentality: 3 });
  const clientRef = useRef<Client | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mid = Number(matchId);

  // 채팅 이력 로드
  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await chatApi.getMessages(mid);
        if (res.success) setMessages(res.data);
        // 평가 상태 확인
        const { data: evalRes } = await evaluationApi.get(mid);
        if (evalRes.success && evalRes.data) setEvalDone(true);
      } catch { /* ignore */ }
    })();
  }, [mid]);

  // WebSocket 연결
  useEffect(() => {
    const wsUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:8080/ws' : `https://${window.location.hostname}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/match/${mid}`, (msg) => {
          const data: ChatMsg = JSON.parse(msg.body);
          setMessages(prev => [...prev, data]);
        });
      },
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;
    return () => { client.deactivate(); };
  }, [mid]);

  // 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${mid}`,
      body: JSON.stringify({
        matchId: mid,
        senderId: user?.id,
        senderNickname: user?.nickname,
        content: input.trim(),
      }),
    });
    setInput('');
  };

  const handleEval = async () => {
    try {
      const { data: res } = await evaluationApi.submit(mid, scores);
      if (res.success) {
        toast.success('매너 평가 완료!');
        setEvalDone(true);
        setShowEval(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || '평가에 실패했습니다.');
    }
  };

  const ScoreRow = ({ label, emoji, field }: { label: string; emoji: string; field: keyof typeof scores }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', marginBottom: 'var(--sp-1)' }}>
      <span style={{ width: '80px', fontSize: '14px' }}>{emoji} {label}</span>
      <div style={{ flex: 1 }}>
        <div className="manner-gauge">
          <div className="manner-gauge-fill" style={{ width: `${scores[field] * 20}%` }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setScores(s => ({ ...s, [field]: n }))}
            style={{
              width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: scores[field] >= n ? 'var(--gold)' : 'var(--surface-alt)',
              color: scores[field] >= n ? '#000' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: '12px',
            }}>{n}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div className="app-header" style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/chat')}>←</button>
          <h2 style={{ fontSize: '16px' }}>💬 채팅</h2>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: connected ? '#22C55E' : '#EF4444',
          }} />
        </div>
        {!evalDone && (
          <button className="btn btn-outline btn-sm" onClick={() => setShowEval(true)}>
            ⭐ 평가
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 'var(--sp-2)',
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--sp-6)', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '36px', marginBottom: 'var(--sp-1)' }}>⚔️</p>
            <p>첫 메시지를 보내보세요!</p>
          </div>
        )}
        {messages.map(msg => {
          const isMine = msg.senderId === user?.id;
          return (
            <div key={msg.id} style={{
              display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '70%', padding: '10px 14px', borderRadius: '12px',
                background: isMine ? 'var(--primary)' : 'var(--surface-alt)',
                color: 'var(--text-primary)',
              }}>
                {!isMine && (
                  <p style={{ fontSize: '11px', color: 'var(--gold)', marginBottom: '4px', fontWeight: 600 }}>
                    {msg.senderNickname}
                  </p>
                )}
                <p style={{ fontSize: '14px', lineHeight: 1.5 }}>{msg.content}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'right' }}>
                  {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{
        flexShrink: 0, padding: 'var(--sp-1) var(--sp-2)',
        borderTop: '1px solid var(--border)', background: 'var(--surface)',
        display: 'flex', gap: 'var(--sp-1)',
      }}>
        <input className="input-field" style={{ flex: 1, marginBottom: 0 }}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..." />
        <button className="btn btn-primary" style={{ padding: '0 20px' }} onClick={sendMessage}>
          전송
        </button>
      </div>

      {/* 평가 모달 */}
      {showEval && (
        <div className="modal-overlay" onClick={() => setShowEval(false)}>
          <div className="modal-box animate-fade-in" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">⭐ 매너 평가</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-3)', fontSize: '14px' }}>
              상대방의 매너를 평가해주세요 (1~5점)
            </p>
            <ScoreRow label="소통" emoji="💬" field="communication" />
            <ScoreRow label="팀워크" emoji="🤝" field="teamwork" />
            <ScoreRow label="멘탈" emoji="💪" field="mentality" />
            <div style={{ display: 'flex', gap: 'var(--sp-1)', marginTop: 'var(--sp-3)' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleEval}>
                평가 완료
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowEval(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
