package com.ssafy.bookshy.domain.matching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ssafy.bookshy.domain.matching.entity.Matching;

public interface MatchingRepository extends JpaRepository<Matching, Long> {

}