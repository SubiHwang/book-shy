package com.ssafy.bookshy.common.config;  // 패키지 선언이요. 프로젝트 구조에 맞게 넣으신 거죠? 짱! 👍

import ch.qos.logback.core.util.Duration;
import jakarta.annotation.PostConstruct;  // 스프링 부트 3.x에서는 javax가 아니라 jakarta로 바뀌었어요. 트렌디~
import net.logstash.logback.appender.LogstashTcpSocketAppender;  // 로그스태시로 로그 보내는 클래스예요. 진짜 중요!
import net.logstash.logback.encoder.LogstashEncoder;  // JSON으로 로그 변환하는 인코더. 없으면 앙대요!
import org.slf4j.LoggerFactory;  // 로깅 팩토리 가져오는 임포트. 기본 중에 기본~
import org.springframework.beans.factory.annotation.Value;  // 프로퍼티 값 주입받는 어노테이션. 편해서 JMT!
import org.springframework.context.annotation.Configuration;  // 설정 클래스라고 알려주는 어노테이션이요
import org.springframework.context.annotation.Profile;  // 특정 프로필에서만 활성화하는 어노테이션. 꿀팁임!

// Logback 관련 클래스 임포트 - 이거 임포트 잘못하면 대참사나요 ㄹㅇ
import ch.qos.logback.classic.Logger;  // Log4j가 아니라 Logback 쓰는 거 잊지 마세요! 헷갈리면 큰일남ㅠㅠ
import ch.qos.logback.classic.LoggerContext;  // 얘도 Logback 패키지에서 가져와야 돼요. 패키지 확인 필수임!!!

@Configuration  // 스프링 설정 클래스라고 알려주는 거예요. 스프링 빈으로 등록됨!
@Profile("prod")  // 프로덕션 환경에서만 활성화. 개발할 땐 로그 보내기 귀찮으니까~ 현명한 선택!
public class LoggingConfig {  // 클래스 선언부. 이름은 딱 봐도 로깅 설정이구나 알 수 있게!

    @Value("${spring.application.name}")  // application.yml에서 앱 이름 가져오는 거예요. 없으면 에러날 수도 있어요!
    private String appName;  // 애플리케이션 이름 저장할 변수. 나중에 로그에 넣을 거예요.

    // Logstash 호스트와 포트 설정 (기본값 있어서 없어도 됨)
    @Value("${logging.logstash.host:logstash}")  // 프로퍼티 없으면 기본값 'logstash' 사용. 이런 거 진짜 센스 있음!
    private String logstashHost;  // 로그스태시 호스트 주소 저장 변수

    @Value("${logging.logstash.port:5000}")  // 포트도 마찬가지. 기본값 5000. 표준 포트라 바꿀 일은 없을 듯
    private int logstashPort;  // 로그스태시 포트 저장 변수. int 타입임 주의!

    @PostConstruct  // 빈 생성되고 의존성 주입 끝나면 자동으로 실행되는 메서드. 초기화할 때 짱 편함!
    public void init() {  // 초기화 메서드. 여기서 모든 로깅 설정을 다 함!
        // 로거 컨텍스트 가져오기. 캐스팅 필수! LoggerFactory는 SLF4J 인터페이스라 캐스팅 해줘야 해요.
        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
        // 루트 로거 가져오기. 모든 로거의 부모라서 여기에 설정하면 전체 적용돼요. 꿀팁!
        Logger rootLogger = loggerContext.getLogger(Logger.ROOT_LOGGER_NAME);

        // 로그스태시 TCP 어펜더 객체 생성. 로그를 TCP로 전송할 거예요.
        LogstashTcpSocketAppender logstashAppender = new LogstashTcpSocketAppender();
        logstashAppender.setName("logstash");  // 어펜더 이름 설정. 이름은 마음대로 해도 됨!
        logstashAppender.setContext(loggerContext);  // 로거 컨텍스트 설정. 이거 빼먹으면 큰일남!
        // 목적지 추가. 로그스태시 서버 주소:포트 형식으로 넣어줌. 여러 개 추가 가능!
        logstashAppender.addDestination(logstashHost + ":" + logstashPort);

        // 재연결 지연 시간 설정. 연결 끊기면 1초 후에 재시도. 너무 짧게 하면 서버에 부담이 갈 수도...
        logstashAppender.setReconnectionDelay(Duration.valueOf("1 second"));

        // 로그스태시 인코더 설정. 로그를 JSON 형식으로 변환해줌. 진짜 중요!!
        LogstashEncoder encoder = new LogstashEncoder();
        encoder.setIncludeMdc(true);  // MDC(Mapped Diagnostic Context) 포함. 쓰레드별 로그 추적에 좋음!
        encoder.setIncludeContext(true);  // 로거 컨텍스트 정보 포함. 더 많은 정보를 볼 수 있어요.
        // 커스텀 필드 추가. 앱 이름이랑 버전 정보를 JSON에 넣어줌. 여러 서비스 구분할 때 꿀팁!
        encoder.setCustomFields("{\"application\":\"" + appName + "\",\"version\":\"3.x\"}");

        // 어펜더에 인코더 설정. 이거 빼먹으면 로그가 제대로 안 감!
        logstashAppender.setEncoder(encoder);

        // 어펜더 시작. 이거 호출 안 하면 동작 안 함! 진짜 중요!!
        logstashAppender.start();
        // 루트 로거에 어펜더 추가. 이제 모든 로그가 로그스태시로 전송됨! 끝판왕!
        rootLogger.addAppender(logstashAppender);
    }
}