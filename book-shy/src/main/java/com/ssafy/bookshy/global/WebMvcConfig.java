package com.ssafy.bookshy.global;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload.cover-dir}")
    private String coverImagePath;

    @Value("${file.upload.profile-dir}")
    private String profileImagePath;

    @Value("${file.upload.chat-dir}")
    private String chatImagePath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 📚 도서 커버 이미지
        registry.addResourceHandler("/images/coverImage/**")
                .addResourceLocations("file:" + coverImagePath + "/");

        // 👤 유저 프로필 이미지
        registry.addResourceHandler("/images/profile/**")
                .addResourceLocations("file:" + profileImagePath + "/");

        // 💬 채팅 이미지
        registry.addResourceHandler("/images/chat/**")
                .addResourceLocations("file:" + chatImagePath + "/");
    }
}
