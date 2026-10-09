package com.hemant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hemant.entities.Sport;
import com.hemant.entities.User;

@Repository
public interface SportRespository extends JpaRepository<Sport,Long>{

}
