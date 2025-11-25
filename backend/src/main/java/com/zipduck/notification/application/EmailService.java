package com.zipduck.notification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Email Service
 * - AWS SES를 통한 이메일 발송
 * - 비동기 처리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.notification.email.from}")
    private String fromEmail;

    @Value("${app.notification.email.from-name:ZipDuck}")
    private String fromName;

    /**
     * Send email asynchronously
     */
    @Async("notificationExecutor")
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(String.format("%s <%s>", fromName, fromEmail));
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // HTML 지원

            mailSender.send(message);
            log.info("Email sent successfully: to={}, subject={}", to, subject);

        } catch (MessagingException e) {
            log.error("Failed to send email: to={}, subject={}, error={}",
                to, subject, e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Send new offer notification email
     */
    public void sendNewOfferNotification(String to, String userName, OfferInfo offer) {
        String subject = String.format("[ZipDuck] 새로운 청약 공고: %s", offer.name());

        String body = String.format("""
            <html>
            <body>
                <h2>안녕하세요, %s님!</h2>
                <p>조건에 맞는 새로운 청약 공고가 등록되었습니다.</p>

                <h3>%s</h3>
                <ul>
                    <li><strong>지역:</strong> %s</li>
                    <li><strong>신청 기간:</strong> %s ~ %s</li>
                    <li><strong>소득 기준:</strong> %s</li>
                </ul>

                <p><a href="https://zipduck.com/offers/%d">자세히 보기</a></p>

                <hr>
                <p><small>이 이메일은 알림 구독 설정에 따라 발송되었습니다.</small></p>
            </body>
            </html>
            """,
            userName,
            offer.name(),
            offer.region(),
            offer.startDate(),
            offer.endDate(),
            offer.incomeRequirement(),
            offer.id()
        );

        sendEmail(to, subject, body);
    }

    /**
     * Send deadline alert email
     */
    public void sendDeadlineAlertNotification(String to, String userName, OfferInfo offer, int daysLeft) {
        String subject = String.format("[ZipDuck] 마감 임박: %s (%d일 남음)", offer.name(), daysLeft);

        String body = String.format("""
            <html>
            <body>
                <h2>안녕하세요, %s님!</h2>
                <p><strong>청약 마감이 %d일 남았습니다!</strong></p>

                <h3>%s</h3>
                <ul>
                    <li><strong>지역:</strong> %s</li>
                    <li><strong>마감일:</strong> %s</li>
                </ul>

                <p><a href="https://zipduck.com/offers/%d">지금 확인하기</a></p>

                <hr>
                <p><small>이 이메일은 알림 구독 설정에 따라 발송되었습니다.</small></p>
            </body>
            </html>
            """,
            userName,
            daysLeft,
            offer.name(),
            offer.region(),
            offer.endDate(),
            offer.id()
        );

        sendEmail(to, subject, body);
    }

    /**
     * Offer Info record
     */
    public record OfferInfo(
        Long id,
        String name,
        String region,
        String startDate,
        String endDate,
        String incomeRequirement
    ) {}
}
