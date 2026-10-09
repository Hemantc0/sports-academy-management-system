package com.hemant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hemant.entities.Player;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long>{
	boolean existsByPhone(String phone);
	boolean existsByEmail(String email);


}
