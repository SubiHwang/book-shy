package com.ssafy.bookshy.domain.matching.util;

import com.ssafy.bookshy.domain.users.entity.Users;

import java.time.LocalDateTime;

public class MatchingScoreCalculator {

    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    public static double distanceScore(double km) {
        if (km <= 3) return 3.0;
        else if (km <= 10) return 2.0;
        else if (km <= 30) return 1.0;
        return 0.0;
    }

    public static double temperatureScore(Float temperature) {
        if (temperature == null) return 0.0;
        if (temperature >= 30) return (temperature - 30) * 0.1;
        return 0.0;
    }

    public static double activityScore(LocalDateTime lastActiveAt) {
        if (lastActiveAt == null) return 0.0;
        LocalDateTime now = LocalDateTime.now();
        if (lastActiveAt.isAfter(now.minusDays(3))) return 3.0;
        if (lastActiveAt.isAfter(now.minusDays(7))) return 1.0;
        return 0.0;
    }

    public static double totalScore(Users me, Users other) {
        // 거리 점수 계산 (위도/경도 null 체크)
        if (me.getLatitude() == null || me.getLongitude() == null ||
                other.getLatitude() == null || other.getLongitude() == null) {
            return 0.0; // 위치 정보 없으면 거리 점수 제외
        }

        double distKm = calculateDistance(
                me.getLatitude(), me.getLongitude(),
                other.getLatitude(), other.getLongitude()
        );

        return distanceScore(distKm)
                + temperatureScore(other.getTemperature())
                + activityScore(other.getLastActiveAt());
    }
}
