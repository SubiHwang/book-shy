package com.ssafy.bookshy.domain.matching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ssafy.bookshy.domain.matching.entity.Matching;

public interface MatchingRepository extends JpaRepository<Matching, Long> {

}