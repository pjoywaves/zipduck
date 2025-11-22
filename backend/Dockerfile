# Multi-stage build for Spring Boot with Gradle

# Stage 1: Build
FROM gradle:8.5-jdk17 AS builder

WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Download dependencies (cached layer)
RUN gradle dependencies --no-daemon || return 0

# Copy source code
COPY src src

# Build application
RUN gradle bootJar --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:17-jre

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy JAR from builder
COPY --from=builder /app/build/libs/*.jar app.jar

# Create directory for PDF storage
RUN mkdir -p /app/pdfs && \
    chmod 755 /app/pdfs

# Create non-root user
RUN groupadd -r spring && useradd -r -g spring spring && \
    chown -R spring:spring /app

USER spring:spring

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
