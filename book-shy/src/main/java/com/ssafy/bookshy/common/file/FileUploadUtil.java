package com.ssafy.bookshy.common.file;

import java.io.IOException;
import java.nio.file.*;

import org.springframework.web.multipart.MultipartFile;

public class FileUploadUtil {

    /**
     * 📁 Multipart 파일을 지정된 경로에 저장합니다.
     *
     * @param file Multipart 파일
     * @param directory 저장할 디렉토리 경로 (절대 경로)
     * @param fileName 저장할 파일 이름 (예: uuid.jpg)
     * @return 저장된 절대 경로
     */
    public static Path saveFile(MultipartFile file, String directory, String fileName) {
        try {
            Path uploadPath = Paths.get(directory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path targetPath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return targetPath;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류 발생", e);
        }
    }
}
