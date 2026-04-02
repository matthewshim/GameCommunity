package com.gamecommunity.chat.dto;

import com.gamecommunity.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class ChatMessageResponse {
    private Long id;
    private Long matchId;
    private Long senderId;
    private String senderNickname;
    private String content;
    private LocalDateTime createdAt;

    public static ChatMessageResponse from(ChatMessage msg) {
        return ChatMessageResponse.builder()
                .id(msg.getId())
                .matchId(msg.getMatch().getId())
                .senderId(msg.getSender().getId())
                .senderNickname(msg.getSender().getNickname())
                .content(msg.getContent())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
