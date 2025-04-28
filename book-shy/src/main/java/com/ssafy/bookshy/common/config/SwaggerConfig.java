package com.ssafy.bookshy.common.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openApi() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("BookShy API")
                        .description("부끄부끄 서비스의 API 문서")
                        .version("1.0.0"))
                .servers(List.of(new Server().url("https://k12d204.p.ssafy.io/")));
    }
}