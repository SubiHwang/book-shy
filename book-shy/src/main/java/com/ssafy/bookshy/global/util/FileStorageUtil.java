package com.ssafy.bookshy.global.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import com.ssafy.bookshy.global.config.FileUploadProperties;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FileStorageUtil {

    private final FileUploadProperties fileUploadProperties;

    public String storeFile(MultipartFile file) throws IOException {
        String uploadDir = fileUploadProperties.getUploadDir();

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String storedFileName = UUID.randomUUID() + extension;

        File dest = new File(uploadDir, storedFileName);
        file.transferTo(dest);

        return storedFileName;
    }
}
