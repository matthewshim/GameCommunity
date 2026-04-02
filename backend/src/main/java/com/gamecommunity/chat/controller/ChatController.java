package com.gamecommunity.chat.controller;

import com.gamecommunity.chat.dto.ChatMessageRequest;
import com.gamecommunity.chat.dto.ChatMessageResponse;
import com.gamecommunity.chat.service.ChatService;
import com.gamecommunity.common.dto.ApiResponse;
import com.gamecommunity.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * WebSocket STOMP: 메시지 전송
     * Client sends to: /app/chat/{matchId}
     * Broadcast to: /topic/match/{matchId}
     */
    @MessageMapping("/chat/{matchId}")
    @SendTo("/topic/match/{matchId}")
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        return chatService.saveMessage(request);
    }

    /**
     * REST: 채팅 이력 조회
     */
    @GetMapping("/api/chat/{matchId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getMessages(
            @PathVariable Long matchId) {
        List<ChatMessageResponse> messages = chatService.getMessages(matchId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }
}
