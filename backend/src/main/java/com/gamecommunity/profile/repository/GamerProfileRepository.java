package com.gamecommunity.profile.repository;

import com.gamecommunity.profile.entity.GamerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GamerProfileRepository extends JpaRepository<GamerProfile, Long> {
    Optional<GamerProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
