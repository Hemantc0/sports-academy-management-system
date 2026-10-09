package com.hemant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hemant.entities.Batch;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long>{

}
