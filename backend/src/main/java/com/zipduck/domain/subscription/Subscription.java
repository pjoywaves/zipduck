package com.zipduck.domain.subscription;

import com.zipduck.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Subscription entity representing a housing subscription opportunity
 * FR-026: Data source tracking (PUBLIC_DB, PDF_UPLOAD, MERGED)
 */
@Entity
@Table(name = "subscriptions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Subscription extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 분양 단지명

    @Column(nullable = false)
    private String location; // 지역 (서울, 경기 등)

    @Column(length = 1000)
    private String address; // 상세 주소

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private HousingType housingType; // 주택 유형

    @Column(nullable = false)
    private Long minPrice; // 최저가 (KRW)

    @Column(nullable = false)
    private Long maxPrice; // 최고가 (KRW)

    // Eligibility criteria
    private Integer minAge; // 최소 연령
    private Integer maxAge; // 최대 연령
    private Long minIncome; // 최소 소득 (KRW)
    private Long maxIncome; // 최대 소득 (KRW)
    private Integer minHouseholdMembers; // 최소 세대원 수
    private Integer maxHouseholdMembers; // 최대 세대원 수
    private Integer maxHousingOwned; // 최대 주택 보유 수

    @Column(length = 2000)
    private String specialQualifications; // 특별 자격 조건

    @Column(length = 1000)
    private String preferenceCategories; // 우대 카테고리

    // Application period
    @Column(nullable = false)
    private LocalDate applicationStartDate;

    @Column(nullable = false)
    private LocalDate applicationEndDate;

    // Data source tracking (FR-026)
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DataSource dataSource = DataSource.PUBLIC_DB;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isMerged = false; // FR-029: Indicates if enhanced by multiple sources

    @Column(length = 500)
    private String publicDataId; // External ID from 공공데이터포털

    @Column(length = 500)
    private String pdfDocumentId; // Reference to uploaded PDF document

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true; // FR-030: For expiration management

    @Column(length = 2000)
    private String detailUrl; // 상세 정보 URL

    public enum HousingType {
        APARTMENT("아파트"),
        OFFICETEL("오피스텔"),
        VILLA("빌라"),
        TOWNHOUSE("타운하우스"),
        ETC("기타");

        private final String koreanName;

        HousingType(String koreanName) {
            this.koreanName = koreanName;
        }

        public String getKoreanName() {
            return koreanName;
        }
    }

    public enum DataSource {
        PUBLIC_DB("공공데이터"),
        PDF_UPLOAD("PDF 업로드"),
        MERGED("통합");

        private final String koreanName;

        DataSource(String koreanName) {
            this.koreanName = koreanName;
        }

        public String getKoreanName() {
            return koreanName;
        }
    }

    /**
     * Mark subscription as merged with PDF data
     * FR-029
     */
    public void markAsMerged(String pdfDocumentId) {
        this.isMerged = true;
        this.dataSource = DataSource.MERGED;
        this.pdfDocumentId = pdfDocumentId;
    }

    /**
     * Deactivate subscription (FR-030)
     */
    public void deactivate() {
        this.isActive = false;
    }

    /**
     * Check if subscription is expired
     */
    public boolean isExpired() {
        return LocalDate.now().isAfter(applicationEndDate);
    }
}