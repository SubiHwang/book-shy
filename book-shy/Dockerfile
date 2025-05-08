FROM openjdk:17-jdk-slim

WORKDIR /app

#COPY src/main/resources/application.yml /app/application.yml
COPY build/libs/*.jar /app/app.jar

COPY build/libs/book-shy-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
