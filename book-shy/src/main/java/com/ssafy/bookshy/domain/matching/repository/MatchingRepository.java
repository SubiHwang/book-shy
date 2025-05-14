package com.ssafy.bookshy.domain.matching.repository;

import com.ssafy.bookshy.domain.matching.entity.Matching;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchingRepository extends JpaRepository<Matching, Long> {

}