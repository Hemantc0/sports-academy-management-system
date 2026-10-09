package com.hemant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hemant.entities.Coach;
import com.hemant.entities.Sport;

@Repository

public interface CoachRepository extends JpaRepository<Coach,Long>{
		boolean existsByPhone(String phone);
		boolean existsByEmail(String email);
	}
