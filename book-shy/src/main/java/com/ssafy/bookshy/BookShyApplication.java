package com.ssafy.bookshy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BookShyApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookShyApplication.class, args);
    }

}
