package com.hemant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hemant.entities.TrainingProgram;

@Repository
public interface TrainingProgramRepository  extends JpaRepository<TrainingProgram, Long>{

}
