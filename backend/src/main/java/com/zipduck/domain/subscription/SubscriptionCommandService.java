package com.zipduck.domain.subscription;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Service for Subscription write operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionCommandService {

    private final SubscriptionRepository subscriptionRepository;

    /**
     * Create new subscription
     */
    public Subscription create(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    /**
     * Merge PDF data with existing public database subscription
     * FR-029
     */
    public Subscription mergeWithPdfData(Subscription publicDbSubscription, String pdfDocumentId) {
        publicDbSubscription.markAsMerged(pdfDocumentId);
        return subscriptionRepository.save(publicDbSubscription);
    }

    /**
     * Deactivate expired subscriptions
     * FR-030, FR-031
     */
    public int deactivateExpiredSubscriptions() {
        List<Subscription> expiredSubscriptions =
                subscriptionRepository.findExpiredSubscriptions(LocalDate.now());

        for (Subscription subscription : expiredSubscriptions) {
            subscription.deactivate();
        }

        subscriptionRepository.saveAll(expiredSubscriptions);
        log.info("Deactivated {} expired subscriptions", expiredSubscriptions.size());
        return expiredSubscriptions.size();
    }

    /**
     * Update subscription
     */
    public Subscription update(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    /**
     * Delete subscription
     */
    public void delete(Long id) {
        subscriptionRepository.deleteById(id);
    }
}