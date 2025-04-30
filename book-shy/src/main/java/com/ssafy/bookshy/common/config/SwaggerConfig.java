package com.ssafy.bookshy.common.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.security.*;
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
                        .title("📚 북끄북끄 API 문서")
                        .description("React + Spring 기반 중고 도서 교환 플랫폼 Swagger UI")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("북끄북끄 개발팀")
                                .email("support@bookshy.com")
                        )
                )
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("로컬 서버")
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
