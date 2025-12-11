package com.zipduck.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 공공데이터 청약 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicSubscriptionDto {
    // 기본 정보
    private String externalId;          // 공고번호 (PBLANC_NO)
    private String houseManageNo;       // 주택관리번호 (HOUSE_MANAGE_NO)
    private String name;                // 주택명 (HOUSE_NM)
    private String location;            // 공급위치 (HSSPLY_ADRES)
    private String zipCode;             // 우편번호 (HSSPLY_ZIP)
    private String housingType;         // 주택구분 (HOUSE_SECD_NM)
    private String housingDetailType;   // 주택상세구분 (HOUSE_DTL_SECD_NM) - 민영/국민
    private String rentType;            // 분양구분 (RENT_SECD_NM)
    private int supplyCount;            // 공급세대수 (TOT_SUPLY_HSHLDCO)

    // 청약 일정
    private LocalDate announcementDate;         // 공고일 (RCRIT_PBLANC_DE)
    private LocalDate applicationStartDate;     // 청약 시작일 (RCEPT_BGNDE)
    private LocalDate applicationEndDate;       // 청약 마감일 (RCEPT_ENDDE)
    private LocalDate specialSupplyStartDate;   // 특별공급 시작일 (SPSPLY_RCEPT_BGNDE)
    private LocalDate specialSupplyEndDate;     // 특별공급 마감일 (SPSPLY_RCEPT_ENDDE)
    private LocalDate winnerAnnouncementDate;   // 당첨자발표일 (PRZWNER_PRESNATN_DE)
    private LocalDate contractStartDate;        // 계약시작일 (CNTRCT_CNCLS_BGNDE)
    private LocalDate contractEndDate;          // 계약종료일 (CNTRCT_CNCLS_ENDDE)

    // 일반공급 1순위 일정
    private LocalDate generalRank1AreaStartDate;    // 1순위 해당지역 시작일 (GNRL_RNK1_CRSPAREA_RCPTDE)
    private LocalDate generalRank1AreaEndDate;      // 1순위 해당지역 마감일 (GNRL_RNK1_CRSPAREA_ENDDE)
    private LocalDate generalRank1EtcAreaStartDate; // 1순위 기타지역 시작일 (GNRL_RNK1_ETC_AREA_RCPTDE)
    private LocalDate generalRank1EtcAreaEndDate;   // 1순위 기타지역 마감일 (GNRL_RNK1_ETC_AREA_ENDDE)
    private LocalDate generalRank1EtcGgStartDate;   // 1순위 기타경기 시작일 (GNRL_RNK1_ETC_GG_RCPTDE)
    private LocalDate generalRank1EtcGgEndDate;     // 1순위 기타경기 마감일 (GNRL_RNK1_ETC_GG_ENDDE)

    // 일반공급 2순위 일정
    private LocalDate generalRank2AreaStartDate;    // 2순위 해당지역 시작일 (GNRL_RNK2_CRSPAREA_RCPTDE)
    private LocalDate generalRank2AreaEndDate;      // 2순위 해당지역 마감일 (GNRL_RNK2_CRSPAREA_ENDDE)
    private LocalDate generalRank2EtcAreaStartDate; // 2순위 기타지역 시작일 (GNRL_RNK2_ETC_AREA_RCPTDE)
    private LocalDate generalRank2EtcAreaEndDate;   // 2순위 기타지역 마감일 (GNRL_RNK2_ETC_AREA_ENDDE)
    private LocalDate generalRank2EtcGgStartDate;   // 2순위 기타경기 시작일 (GNRL_RNK2_ETC_GG_RCPTDE)
    private LocalDate generalRank2EtcGgEndDate;     // 2순위 기타경기 마감일 (GNRL_RNK2_ETC_GG_ENDDE)

    // 사업주체 정보
    private String constructorName;     // 시행사 (BSNS_MBY_NM)
    private String builderName;         // 건설업체 (CNSTRCT_ENTRPS_NM)

    // 연락처 및 URL
    private String modelHousePhone;     // 모델하우스 전화번호 (MDHS_TELNO)
    private String homepageUrl;         // 홈페이지 주소 (HMPG_ADRES)
    private String announcementUrl;     // 청약홈 공고 URL (PBLANC_URL)

    // 기타 정보
    private String subscriptionAreaCode;    // 청약지역코드 (SUBSCRPT_AREA_CODE)
    private String subscriptionAreaName;    // 청약지역명 (SUBSCRPT_AREA_CODE_NM)
    private String moveInYearMonth;         // 입주예정년월 (MVN_PREARNGE_YM)
    private String newspaperName;           // 신문사 (NSPRC_NM)

    // 특성 정보 (Y/N)
    private Boolean isSpeculationArea;      // 투기과열지구 (SPECLT_RDN_EARTH_AT)
    private Boolean isAdjustmentTargetArea; // 조정대상지역 (MDAT_TRGET_AREA_SECD)
    private Boolean isPublicLand;           // 공공택지 (PUBLIC_HOUSE_EARTH_AT)
    private Boolean isLargeScaleLand;       // 대규모택지 (LRSCL_BLDLND_AT)
    private Boolean isLoanRestricted;       // 분양가상한제 (PARCPRC_ULS_AT)
    private Boolean isReconstructionBusiness; // 정비사업 (IMPRMN_BSNS_AT)
    private Boolean isPublicHousingDistrict;  // 공공주택지구 (NPLN_PRVOPR_PUBLIC_HOUSE_AT)
    private Boolean hasPublicHousingSpecialSupply; // 공공주택 특별공급 (PUBLIC_HOUSE_SPCLW_APPLC_AT)
}