package com.ssafy.bookshy.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("📚 북끄북끄 API")
                        .description("Spring Boot 기반 도서 교환 플랫폼 API 문서입니다.")
                        .version("v1.0.0")
                        .contact(new Contact().name("북끄북끄 개발팀").email("support@bookshy.com"))
                )
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("🧪 로컬 개발 서버"),
                        new Server()
                                .url("http://k12d204.p.ssafy.io:8080")
                                .description("🚀 배포 서버")
                ));
    }


    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("v1-public")
                .pathsToMatch("/api/**") // 문서화할 API 경로 지정
                .build();
    }

}
