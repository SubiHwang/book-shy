FROM openjdk:17-jre-slim
WORKDIR /app
COPY build/libs/book-shy-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
