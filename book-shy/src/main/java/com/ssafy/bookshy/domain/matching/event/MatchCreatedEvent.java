package com.ssafy.bookshy.domain.matching.event;

import com.ssafy.bookshy.domain.matching.entity.Matching;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MatchCreatedEvent {
    private final Matching matching;
}
