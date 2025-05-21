package com.ssafy.bookshy.domain.chat.repository;

import com.ssafy.bookshy.domain.chat.entity.ChatCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ChatCalendarRepository extends JpaRepository<ChatCalendar, Long> {

    /**
     * 사용자의 채팅방에서 특정 날짜에 해당하는 교환/대여 이벤트 조회
     */
    @Query("""
        SELECT c FROM ChatCalendar c
        JOIN c.chatRoom r
        WHERE (r.userAId = :userId OR r.userBId = :userId)
          AND (
            DATE(c.exchangeDate) = :date
            OR DATE(c.rentalStartDate) = :date
            OR DATE(c.rentalEndDate) = :date
          )
    """)
    List<ChatCalendar> findByUserIdAndDate(@Param("userId") Long userId,
                                           @Param("date") LocalDate date);

    Optional<ChatCalendar> findByChatRoomId(Long roomId);


    /**
     * 📌 특정 거래 요청(requestId)과 연결된 일정 단건 조회
     */
    Optional<ChatCalendar> findByRequestId(Long requestId);

    /**
     * 🗓 특정 사용자가 포함된 모든 일정 전체 조회
     */
    @Query("""
        SELECT c FROM ChatCalendar c
        JOIN c.chatRoom r
        WHERE r.userAId = :userId OR r.userBId = :userId
    """)
    List<ChatCalendar> findAllByUserId(@Param("userId") Long userId);
}
