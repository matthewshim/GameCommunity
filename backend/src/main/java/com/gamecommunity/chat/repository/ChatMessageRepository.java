package com.gamecommunity.chat.repository;

import com.gamecommunity.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByMatchIdOrderByCreatedAtAsc(Long matchId);
    long countByMatchId(Long matchId);
}
