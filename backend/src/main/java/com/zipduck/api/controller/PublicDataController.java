package com.zipduck.api.controller;

import com.zipduck.api.dto.PublicSubscriptionDto;
import com.zipduck.application.collector.PublicDataCollector;
import com.zipduck.infrastructure.external.PublicDataClient;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public-data")
@RequiredArgsConstructor
public class PublicDataController {

    private final PublicDataClient publicDataClient;
    private final PublicDataCollector publicDataCollector;

    // 청약 목록 조회
    @GetMapping("/subscriptions")
    public List<PublicSubscriptionDto> getSubscriptions(
            @RequestParam("fromDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate) {
        return publicDataClient.fetchSubscriptions(fromDate);
    }

    @PostMapping("/trigger-collect")
    public String triggerCollect() {
        publicDataCollector.collectPublicData();
        return "Data collection triggered";
    }

    @PostMapping("/trigger-deactivate")
    public String triggerDeactivate() {
        publicDataCollector.deactivateExpiredSubscriptions();
        return "Deactivation triggered";
    }
}