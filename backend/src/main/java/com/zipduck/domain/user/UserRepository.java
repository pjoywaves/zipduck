package com.zipduck.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserId(String userId);

    Optional<User> findByEmail(String email);

    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.profile WHERE u.id = :id")
    Optional<User> findByIdWithProfile(@Param("id") Long id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.profile WHERE u.userId = :userId")
    Optional<User> findByUserIdWithProfile(@Param("userId") String userId);
}