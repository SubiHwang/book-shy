package com.ssafy.bookshy.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass                     // JPA: 이 클래스는 테이블로 매핑되지 않고 자식 엔티티에 매핑 정보만 제공
@EntityListeners(AuditingEntityListener.class)  // JPA: 엔티티 변화 감지하는 리스너 등록 (Auditing 기능)
public abstract class TimeStampEntity {         // abstract: 직접 인스턴스화 안되고 상속해서만 사용 가능

    @CreatedDate                      // Spring Data: 엔티티 생성 시간 자동 저장
    @Column(name = "created_at", updatable = false)  // JPA: DB 컬럼명 지정, 수정 불가능 설정
    protected LocalDateTime createdAt;          // 생성 시간 필드

    @LastModifiedDate                 // Spring Data: 엔티티 마지막 수정 시간 자동 업데이트
    @Column(name = "updated_at")      // JPA: DB 컬럼명 지정
    protected LocalDateTime updatedAt;          // 수정 시간 필드
}
