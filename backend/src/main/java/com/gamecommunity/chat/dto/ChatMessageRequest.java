package com.gamecommunity.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageRequest {
    private Long matchId;
    private Long senderId;
    private String senderNickname;
    private String content;
}
