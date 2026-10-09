package com.hemant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hemant.entities.Branch;
import com.hemant.entities.User;

@Repository
public interface BranchRepository extends JpaRepository<Branch,Long>{

}
