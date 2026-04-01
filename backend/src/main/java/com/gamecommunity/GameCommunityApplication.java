package com.gamecommunity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GameCommunityApplication {
    public static void main(String[] args) {
        SpringApplication.run(GameCommunityApplication.class, args);
    }
}
