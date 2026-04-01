package com.gamecommunity.profile.service;

import com.gamecommunity.profile.dto.ProfileRequest;
import com.gamecommunity.profile.dto.ProfileResponse;
import com.gamecommunity.profile.entity.GamerProfile;
import com.gamecommunity.profile.repository.GamerProfileRepository;
import com.gamecommunity.user.entity.User;
import com.gamecommunity.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final GamerProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProfileResponse createProfile(Long userId, ProfileRequest request) {
        if (profileRepository.existsByUserId(userId)) {
            throw new IllegalArgumentException("이미 프로필이 존재합니다. 수정을 이용해주세요.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        GamerProfile profile = GamerProfile.builder()
                .user(user)
                .serverName(request.getServerName())
                .serverType(request.getServerType())
                .serverRegion(request.getServerRegion() != null ? request.getServerRegion() : "GLOBAL")
                .jobClass(request.getJobClass())
                .jobTier(request.getJobTier())
                .baseLevel(request.getBaseLevel() != null ? request.getBaseLevel() : 1)
                .role(request.getRole())
                .contentPreference(request.getContentPreference())
                .lookingFor(request.getLookingFor() != null ? request.getLookingFor() : "BOTH")
                .experienceLevel(request.getExperienceLevel() != null ? request.getExperienceLevel() : "VETERAN")
                .guildName(request.getGuildName())
                .voiceChat(request.getVoiceChat() != null ? request.getVoiceChat() : "OPTIONAL")
                .playTimeStart(request.getPlayTimeStart())
                .playTimeEnd(request.getPlayTimeEnd())
                .bio(request.getBio())
                .build();

        profileRepository.save(profile);

        // 유저의 hasProfile을 true로 변경
        user.setHasProfile(true);
        userRepository.save(user);

        return ProfileResponse.from(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, ProfileRequest request) {
        GamerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));

        profile.setServerName(request.getServerName());
        profile.setServerType(request.getServerType());
        if (request.getServerRegion() != null) profile.setServerRegion(request.getServerRegion());
        profile.setJobClass(request.getJobClass());
        profile.setJobTier(request.getJobTier());
        if (request.getBaseLevel() != null) profile.setBaseLevel(request.getBaseLevel());
        profile.setRole(request.getRole());
        profile.setContentPreference(request.getContentPreference());
        if (request.getLookingFor() != null) profile.setLookingFor(request.getLookingFor());
        if (request.getExperienceLevel() != null) profile.setExperienceLevel(request.getExperienceLevel());
        profile.setGuildName(request.getGuildName());
        if (request.getVoiceChat() != null) profile.setVoiceChat(request.getVoiceChat());
        profile.setPlayTimeStart(request.getPlayTimeStart());
        profile.setPlayTimeEnd(request.getPlayTimeEnd());
        profile.setBio(request.getBio());

        profileRepository.save(profile);
        return ProfileResponse.from(profile);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile(Long userId) {
        GamerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다. 온보딩을 완료해주세요."));
        return ProfileResponse.from(profile);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Long userId) {
        GamerProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));
        return ProfileResponse.from(profile);
    }
}
