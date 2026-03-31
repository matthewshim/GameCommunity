package com.gamecommunity.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "GameCommunity API");
    }

    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Welcome to GameCommunity!");
    }
}
