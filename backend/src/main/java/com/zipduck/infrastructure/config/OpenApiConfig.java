package com.zipduck.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * SpringDoc OpenAPI (Swagger) 설정
 * API 문서 자동 생성을 위한 설정 클래스
 *
 * Swagger UI 접근: http://localhost:8080/swagger-ui.html
 * OpenAPI JSON: http://localhost:8080/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI zipDuckOpenAPI() {
        return new OpenAPI()
            .info(apiInfo())
            .servers(servers())
            .components(securityComponents())
            .addSecurityItem(securityRequirement());
    }

    /**
     * API 기본 정보 설정
     */
    private Info apiInfo() {
        return new Info()
            .title("ZipDuck API")
            .description("""
                ## 청약 AI 추천 서비스 API

                ZipDuck은 사용자 맞춤형 청약 추천 서비스입니다.

                ### 주요 기능
                - **프로필 관리**: 사용자 자격 조건 입력 및 관리
                - **청약 추천**: 공공 데이터 기반 맞춤 청약 추천
                - **PDF 분석**: AI 기반 청약 공고 PDF 분석 (OCR 지원)
                - **적격성 확인**: 상세 자격 조건 분석 및 매칭

                ### 인증
                모든 API는 JWT Bearer 토큰 인증이 필요합니다.
                """)
            .version("v1.0.0")
            .contact(new Contact()
                .name("ZipDuck Team")
                .email("support@zipduck.com")
                .url("https://zipduck.com"))
            .license(new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT"));
    }

    /**
     * 서버 목록 설정
     */
    private List<Server> servers() {
        return List.of(
            new Server()
                .url("http://localhost:8080")
                .description("로컬 개발 서버"),
            new Server()
                .url("https://api.zipduck.com")
                .description("프로덕션 서버")
        );
    }

    /**
     * 보안 컴포넌트 (JWT) 설정
     */
    private Components securityComponents() {
        return new Components()
            .addSecuritySchemes("bearer-jwt",
                new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("JWT 토큰을 입력하세요 (Bearer 접두사 없이)"));
    }

    /**
     * 보안 요구사항 설정
     */
    private SecurityRequirement securityRequirement() {
        return new SecurityRequirement().addList("bearer-jwt");
    }
}