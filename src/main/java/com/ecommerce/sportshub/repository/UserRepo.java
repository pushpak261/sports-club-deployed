package com.ecommerce.sportshub.repository;


import com.ecommerce.sportshub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    /**
     * N+1 FIX: Fetch user with address and order items + products in ONE query
     * instead of 1 query for user + 1 for address + N for order items + N for products
     */
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.address " +
           "LEFT JOIN FETCH u.orderItemList oi " +
           "LEFT JOIN FETCH oi.product " +
           "WHERE u.email = :email")
    Optional<User> findByEmailWithOrdersAndAddress(@Param("email") String email);
}
