package com.gamecommunity.profile.controller;

import com.gamecommunity.common.dto.ApiResponse;
import com.gamecommunity.profile.dto.ProfileRequest;
import com.gamecommunity.profile.dto.ProfileResponse;
import com.gamecommunity.profile.service.ProfileService;
import com.gamecommunity.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.createProfile(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "RO 프로필이 생성되었습니다!"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> update(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response, "프로필이 수정되었습니다."));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> myProfile(@AuthenticationPrincipal User user) {
        ProfileResponse response = profileService.getMyProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(@PathVariable Long userId) {
        ProfileResponse response = profileService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
