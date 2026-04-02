package com.gamecommunity.matching.repository;

import com.gamecommunity.matching.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE (m.user1.id = :userId OR m.user2.id = :userId) AND m.status = 'ACTIVE' ORDER BY m.createdAt DESC")
    List<Match> findActiveMatchesByUserId(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END FROM Match m " +
           "WHERE ((m.user1.id = :userId1 AND m.user2.id = :userId2) " +
           "OR (m.user1.id = :userId2 AND m.user2.id = :userId1)) AND m.status = 'ACTIVE'")
    boolean existsActiveMatch(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
