package com.zipduck.infrastructure.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipduck.api.dto.PublicSubscriptionDto;
import com.zipduck.api.exception.PublicDataApiException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 공공데이터포털 API 클라이언트
 * 청약 정보를 공공데이터포털에서 수집합니다
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PublicDataClient {

    private static final int TIMEOUT_SECONDS = 10;
    private static final int DEFAULT_PAGE_SIZE = 100;
    private static final String ENDPOINT_LIST = "/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail";
    private static final DateTimeFormatter DATE_FORMAT_HYPHEN = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_FORMAT_COMPACT = DateTimeFormatter.ofPattern("yyyyMMdd");

    @Value("${app.public-data.base-url}")
    private String baseUrl;

    @Value("${app.public-data.api-key}")
    private String apiKey;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    private WebClient webClient;

    /**
     * WebClient 초기화
     */
    @PostConstruct
    public void init() {
        this.webClient = webClientBuilder
            .baseUrl(baseUrl)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
        log.info("PublicDataClient WebClient 초기화 완료: baseUrl={}", baseUrl);
    }

    /**
     * 청약 목록 조회 (페이지네이션 지원)
     *
     * @param fromDate 조회 시작일
     * @return 청약 정보 목록
     */
    @CircuitBreaker(name = "publicData", fallbackMethod = "fetchSubscriptionsFallback")
    @Retry(name = "publicData")
    public List<PublicSubscriptionDto> fetchSubscriptions(LocalDate fromDate) {
        log.info("공공데이터포털에서 청약 정보 조회 시작: fromDate={}", fromDate);

        List<PublicSubscriptionDto> allSubscriptions = new ArrayList<>();
        int currentPage = 1;
        int totalCount = 0;

        try {
            // 첫 페이지 조회로 전체 건수 파악
            String firstResponse = fetchPage(currentPage, fromDate);
            JsonNode firstRootNode = objectMapper.readTree(firstResponse);
            totalCount = firstRootNode.path("totalCount").asInt(0);

            List<PublicSubscriptionDto> firstPageData = parseSubscriptionResponse(firstResponse);
            allSubscriptions.addAll(firstPageData);

            log.info("첫 페이지 조회 완료: {} 건 / 전체 {} 건", firstPageData.size(), totalCount);

            // 나머지 페이지 조회
            int totalPages = (int) Math.ceil((double) totalCount / DEFAULT_PAGE_SIZE);
            for (currentPage = 2; currentPage <= totalPages; currentPage++) {
                String response = fetchPage(currentPage, fromDate);
                List<PublicSubscriptionDto> pageData = parseSubscriptionResponse(response);
                allSubscriptions.addAll(pageData);

                log.info("페이지 {} / {} 조회 완료: {} 건", currentPage, totalPages, pageData.size());

                // API 부하 방지를 위한 딜레이
                if (currentPage < totalPages) {
                    Thread.sleep(100);
                }
            }

            log.info("전체 청약 정보 조회 완료: {} 건", allSubscriptions.size());
            return allSubscriptions;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("청약 정보 조회 중단됨", e);
            throw new PublicDataApiException("청약 정보 조회가 중단되었습니다", e);
        } catch (Exception e) {
            log.error("공공데이터포털 API 호출 실패: {}", e.getMessage(), e);
            throw new PublicDataApiException("공공데이터포털에서 청약 정보를 가져오는데 실패했습니다", e);
        }
    }

    /**
     * 특정 페이지 데이터 조회
     */
    private String fetchPage(int page, LocalDate fromDate) {
        return this.webClient.get()
            .uri(uriBuilder -> {
                var builder = uriBuilder
                    .path(ENDPOINT_LIST)
                    .queryParam("serviceKey", apiKey)
                    .queryParam("page", page)
                    .queryParam("perPage", DEFAULT_PAGE_SIZE);

                // fromDate 필터 적용 (공고일 기준)
                if (fromDate != null) {
                    builder.queryParam("cond[RCRIT_PBLANC_DE::GTE]", fromDate.format(DATE_FORMAT_HYPHEN));
                }

                return builder.build();
            })
            .retrieve()
            .bodyToMono(String.class)
            .timeout(Duration.ofSeconds(TIMEOUT_SECONDS))
            .block();
    }

    /**
     * API 응답 파싱
     */
    private List<PublicSubscriptionDto> parseSubscriptionResponse(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);

            // ODCloud API 응답 구조: { "data": [...], "currentCount": 10, "totalCount": 2604 }
            JsonNode dataNode = rootNode.path("data");

            List<PublicSubscriptionDto> subscriptions = new ArrayList<>();

            if (dataNode.isArray()) {
                for (JsonNode item : dataNode) {
                    subscriptions.add(parseSubscriptionItem(item));
                }
            } else if (!dataNode.isMissingNode()) {
                subscriptions.add(parseSubscriptionItem(dataNode));
            }

            log.info("청약 정보 {} 건 파싱 완료 (전체: {}건)", subscriptions.size(), rootNode.path("totalCount").asInt(0));
            return subscriptions;
        } catch (Exception e) {
            log.error("API 응답 파싱 실패: {}", e.getMessage(), e);
            throw new PublicDataApiException("API 응답을 파싱하는데 실패했습니다", e);
        }
    }

    /**
     * 개별 청약 항목 파싱
     */
    private PublicSubscriptionDto parseSubscriptionItem(JsonNode item) {
        PublicSubscriptionDto.PublicSubscriptionDtoBuilder builder = PublicSubscriptionDto.builder();

        parseBasicInfo(item, builder);
        parseSchedule(item, builder);
        parseRank1Schedule(item, builder);
        parseRank2Schedule(item, builder);
        parseBusinessInfo(item, builder);
        parseContactInfo(item, builder);
        parseAdditionalInfo(item, builder);
        parseCharacteristics(item, builder);

        return builder.build();
    }

    private void parseBasicInfo(JsonNode item, PublicSubscriptionDto.PublicSubscriptionDtoBuilder builder) {
        builder.externalId(getTextValue(item, "PBLANC_NO"))
               .houseManageNo(getTextValue(item, "HOUSE_MANAGE_NO"))
               .name(getTextValue(item, "HOUSE_NM"))
               .location(getTextValue(item, "HSSPLY_ADRES"))
               .zipCode(getTextValue(item, "HSSPLY_ZIP"))
               .housingType(getTextValue(item, "HOUSE_SECD_NM"))
               .housingDetailType(getTextValue(item, "HOUSE_DTL_SECD_NM"))
               .rentType(getTextValue(item, "RENT_SECD_NM"))
               .supplyCount(getIntValue(item, "TOT_SUPLY_HSHLDCO"));
    }

    private void parseSchedule(JsonNode item, PublicSubscriptionDto.PublicSubscriptionDtoBuilder builder) {
        builder.announcementDate(parseDate(getTextValue(item, "RCRIT_PBLANC_DE")))
               .applicationStartDate(parseDate(getTextValue(item, "RCEPT_BGNDE")))
               .applicationEndDate(parseDate(getTextValue(item, "RCEPT_ENDDE")))
               .specialSupplyStartDate(parseDate(getTextValue(item, "SPSPLY_RCEPT_BGNDE")))
               .specialSupplyEndDate(parseDate(getTextValue(item, "SPSPLY_RCEPT_ENDDE")))
               .winnerAnnouncementDate(parseDate(getTextValue(item, "PRZWNER_PRESNATN_DE")))
               .contractStartDate(parseDate(getTextValue(item, "CNTRCT_CNCLS_BGNDE")))
               .contractEndDate(parseDate(getTextValue(item, "CNTRCT_CNCLS_ENDDE")));
    }

    private void parseRank1Schedule(JsonNode item, PublicSubscriptionDto.PublicSubscriptionDtoBuilder builder) {
        builder.generalRank1AreaStartDate(parseDate(getTextValue(item, "GNRL_RNK1_CRSPAREA_RCPTDE")))
               .generalRank1AreaEndDate(parseDate(getTextValue(item, "GNRL_RNK1_CRSPAREA_ENDDE")))
               .generalRank1EtcAreaStartDate(parseDate(getTextValue(item, "GNRL_RNK1_ETC_AREA_RCPTDE")))
               .generalRank1EtcAreaEndDate(parseDate(getTextValue(item, "GNRL_RNK1_ETC_AREA_ENDDE")))
               .generalRank1EtcGgStartDate(parseDate(getTextValue(item, "GNRL_RNK1_ETC_GG_RCPTDE")))
               .generalRank1EtcGgEndDate(parseDate(getTextValue(item, "GNRL_RNK1_ETC_GG_ENDDE")));
    }

    private void parseRank2Schedule(JsonNode item, PublicSubscriptionDto.PublicSubscriptionDtoBuilder builder) {
        builder.generalRank2AreaStartDate(parseDate(getTextValue(item, "GNRL_RNK2_CRSPAREA_RCPTDE")))
               .generalRank2AreaEndDate(parseDate(getTextValue(item, "GNRL_RNK2_CRSPAREA_ENDDE")))
               .generalRank2EtcAreaStartDate(parseDate(getTextValue(item, "GNRL_RNK2_ETC_AREA_RCPTDE")))
               .generalRank2EtcAreaEndDate(parseDate(getTextValue(item, "GNRL_RNK2_ETC_AREA_ENDDE")))
               .generalRank2EtcGgStartDate(parseDate(getTextValue(item, "GNRL_RNK2_ETC_GG_RCPTDE")))
               .generalRank2EtcGgEndDate(parseDate(getTextValue(item, "GNRL_RNK2_ETC_GG_ENDDE")));
    }

    private void parseBusinessInfo(JsonNode item, PublicSubscriptionDto.PublicSubscriptionDtoBuilder builder) {
        builder.constructorName(getTextValue(item, "BSNS_MBY_NM"))
               .builderName(getTextValue(item, "CNSTRCT_ENTRPS_NM"));
    }

    private void parseContactInfo(JsonNode item, PublicSubscriptionDto.PublicSubscriptionDtoBuilder builder) {
        builder.modelHousePhone(getTextValue(item, "MDHS_TELNO"))
               .homepageUrl(getTextValue(item, "HMPG_ADRES"))
               .announcementUrl(getTextValue(item, "PBLANC_URL"));
    }

    private void parseAdditionalInfo(JsonNode item, PublicSubscriptionDto.PublicSubscriptionDtoBuilder builder) {
        builder.subscriptionAreaCode(getTextValue(item, "SUBSCRPT_AREA_CODE"))
               .subscriptionAreaName(getTextValue(item, "SUBSCRPT_AREA_CODE_NM"))
               .moveInYearMonth(getTextValue(item, "MVN_PREARNGE_YM"))
               .newspaperName(getTextValue(item, "NSPRC_NM"));
    }

    private void parseCharacteristics(JsonNode item, PublicSubscriptionDto.PublicSubscriptionDtoBuilder builder) {
        builder.isSpeculationArea(getBooleanValue(item, "SPECLT_RDN_EARTH_AT"))
               .isAdjustmentTargetArea(getBooleanValue(item, "MDAT_TRGET_AREA_SECD"))
               .isPublicLand(getBooleanValue(item, "PUBLIC_HOUSE_EARTH_AT"))
               .isLargeScaleLand(getBooleanValue(item, "LRSCL_BLDLND_AT"))
               .isLoanRestricted(getBooleanValue(item, "PARCPRC_ULS_AT"))
               .isReconstructionBusiness(getBooleanValue(item, "IMPRMN_BSNS_AT"))
               .isPublicHousingDistrict(getBooleanValue(item, "NPLN_PRVOPR_PUBLIC_HOUSE_AT"))
               .hasPublicHousingSpecialSupply(getBooleanValue(item, "PUBLIC_HOUSE_SPCLW_APPLC_AT"));
    }

    private String getTextValue(JsonNode node, String fieldName) {
        JsonNode field = node.get(fieldName);
        return field != null && !field.isNull() ? field.asText() : null;
    }

    private int getIntValue(JsonNode node, String fieldName) {
        JsonNode field = node.get(fieldName);
        return field != null && !field.isNull() ? field.asInt(0) : 0;
    }

    private Boolean getBooleanValue(JsonNode node, String fieldName) {
        JsonNode field = node.get(fieldName);
        if (field == null || field.isNull()) {
            return null;
        }
        String value = field.asText();
        return "Y".equalsIgnoreCase(value);
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr, DATE_FORMAT_HYPHEN);
        } catch (Exception e) {
            try {
                return LocalDate.parse(dateStr, DATE_FORMAT_COMPACT);
            } catch (Exception e2) {
                log.warn("날짜 파싱 실패: {}", dateStr);
                return null;
            }
        }
    }

    /**
     * Fallback: 청약 목록 조회 실패 시
     */
    private List<PublicSubscriptionDto> fetchSubscriptionsFallback(LocalDate fromDate, Exception e) {
        log.error("공공데이터포털 API Circuit Breaker 작동 (목록 조회) - fromDate: {}, 사유: {}",
                  fromDate, e.getMessage());
        return Collections.emptyList();
    }

    /**
     * Fallback: 청약 상세 조회 실패 시
     */
    private PublicSubscriptionDto fetchSubscriptionDetailFallback(String externalId, Exception e) {
        log.error("공공데이터포털 API Circuit Breaker 작동 (상세 조회) - externalId: {}, 사유: {}",
                  externalId, e.getMessage());
        throw new PublicDataApiException("공공데이터포털 API가 현재 사용 불가능합니다. 잠시 후 다시 시도해주세요.", e);
    }
}
