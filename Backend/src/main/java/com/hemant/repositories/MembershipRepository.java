package com.hemant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hemant.entities.Batch;
import com.hemant.entities.Membership;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long>{

}
