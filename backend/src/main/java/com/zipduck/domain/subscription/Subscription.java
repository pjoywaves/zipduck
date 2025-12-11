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

    // ===== Common Fields (공통 필드) =====

    @Column(nullable = false)
    private String name; // 분양 단지명

    @Column(nullable = false)
    private String location; // 지역 (서울, 경기 등)

    @Column(length = 1000)
    private String address; // 상세 주소

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private HousingType housingType; // 주택 유형

    // ===== PDF/Manual Input Fields (PDF 또는 수동 입력 필드) =====

    private Long minPrice; // 최저가 (KRW)

    private Long maxPrice; // 최고가 (KRW)

    // Eligibility criteria (자격 조건)
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

    // ===== Public Data API Fields (공공데이터 API 제공 필드) =====
    // Basic information
    @Column(length = 100)
    private String houseManageNo; // 주택관리번호

    @Column(length = 20)
    private String zipCode; // 우편번호

    @Column(length = 100)
    private String housingDetailType; // 주택상세구분 (민영/국민)

    @Column(length = 50)
    private String rentType; // 분양구분 (분양/임대)

    private Integer supplyCount; // 공급세대수

    // Schedule information
    private LocalDate announcementDate; // 공고일

    @Column(nullable = false)
    private LocalDate applicationStartDate; // 청약 시작일

    @Column(nullable = false)
    private LocalDate applicationEndDate; // 청약 마감일

    private LocalDate specialSupplyStartDate; // 특별공급 시작일
    private LocalDate specialSupplyEndDate; // 특별공급 마감일

    private LocalDate winnerAnnouncementDate; // 당첨자발표일

    private LocalDate contractStartDate; // 계약 시작일
    private LocalDate contractEndDate; // 계약 종료일

    // General supply rank 1 schedule (일반공급 1순위 일정)
    private LocalDate generalRank1AreaStartDate; // 1순위 해당지역 시작일
    private LocalDate generalRank1AreaEndDate; // 1순위 해당지역 마감일
    private LocalDate generalRank1EtcAreaStartDate; // 1순위 기타지역 시작일
    private LocalDate generalRank1EtcAreaEndDate; // 1순위 기타지역 마감일
    private LocalDate generalRank1EtcGgStartDate; // 1순위 기타경기 시작일
    private LocalDate generalRank1EtcGgEndDate; // 1순위 기타경기 마감일

    // General supply rank 2 schedule (일반공급 2순위 일정)
    private LocalDate generalRank2AreaStartDate; // 2순위 해당지역 시작일
    private LocalDate generalRank2AreaEndDate; // 2순위 해당지역 마감일
    private LocalDate generalRank2EtcAreaStartDate; // 2순위 기타지역 시작일
    private LocalDate generalRank2EtcAreaEndDate; // 2순위 기타지역 마감일
    private LocalDate generalRank2EtcGgStartDate; // 2순위 기타경기 시작일
    private LocalDate generalRank2EtcGgEndDate; // 2순위 기타경기 마감일

    // Business & contact information

    @Column(length = 200)
    private String constructorName; // 시행사

    @Column(length = 200)
    private String builderName; // 건설업체

    @Column(length = 50)
    private String modelHousePhone; // 모델하우스 전화번호

    @Column(length = 500)
    private String homepageUrl; // 홈페이지 주소

    // Region information

    @Column(length = 50)
    private String subscriptionAreaCode; // 청약지역코드

    @Column(length = 100)
    private String subscriptionAreaName; // 청약지역명

    @Column(length = 10)
    private String moveInYearMonth; // 입주예정년월 (YYYYMM)

    @Column(length = 100)
    private String newspaperName; // 신문사

    // Characteristics (특성 정보)

    private Boolean isSpeculationArea; // 투기과열지구

    private Boolean isAdjustmentTargetArea; // 조정대상지역

    private Boolean isPublicLand; // 공공택지

    private Boolean isLargeScaleLand; // 대규모택지

    private Boolean isLoanRestricted; // 분양가상한제

    private Boolean isReconstructionBusiness; // 정비사업

    private Boolean isPublicHousingDistrict; // 공공주택지구

    private Boolean hasPublicHousingSpecialSupply; // 공공주택 특별공급

    // Data source tracking

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