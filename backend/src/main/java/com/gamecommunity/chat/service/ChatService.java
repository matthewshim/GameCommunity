package com.gamecommunity.chat.service;

import com.gamecommunity.chat.dto.ChatMessageRequest;
import com.gamecommunity.chat.dto.ChatMessageResponse;
import com.gamecommunity.chat.entity.ChatMessage;
import com.gamecommunity.chat.repository.ChatMessageRepository;
import com.gamecommunity.matching.entity.Match;
import com.gamecommunity.matching.repository.MatchRepository;
import com.gamecommunity.user.entity.User;
import com.gamecommunity.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatMessageResponse saveMessage(ChatMessageRequest request) {
        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new IllegalArgumentException("매칭을 찾을 수 없습니다."));
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        ChatMessage message = ChatMessage.builder()
                .match(match)
                .sender(sender)
                .content(request.getContent())
                .build();
        chatMessageRepository.save(message);

        return ChatMessageResponse.from(message);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(Long matchId) {
        return chatMessageRepository.findByMatchIdOrderByCreatedAtAsc(matchId)
                .stream()
                .map(ChatMessageResponse::from)
                .collect(Collectors.toList());
    }
}
