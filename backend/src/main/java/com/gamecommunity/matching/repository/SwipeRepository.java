package com.gamecommunity.matching.repository;

import com.gamecommunity.matching.entity.Swipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SwipeRepository extends JpaRepository<Swipe, Long> {

    Optional<Swipe> findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);

    boolean existsByFromUserIdAndToUserId(Long fromUserId, Long toUserId);

    @Query("SELECT s.toUser.id FROM Swipe s WHERE s.fromUser.id = :userId")
    List<Long> findSwipedUserIds(@Param("userId") Long userId);
}
