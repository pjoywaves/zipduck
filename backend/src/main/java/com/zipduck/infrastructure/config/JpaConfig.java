package com.zipduck.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JPA Configuration
 * - Enables JPA Auditing for automatic timestamp management
 * - Configures JPA repositories
 * - Enables transaction management
 */
@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.zipduck.domain")
@EnableTransactionManagement
public class JpaConfig {
    // JPA configuration is handled by Spring Boot auto-configuration
    // This class is primarily for enabling JPA Auditing and explicit repository scanning
}