package com.hemant.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Coach {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private String experience;
	private String email ;
	private String phone ;
	private String name;
	
	@OneToOne(mappedBy = "coach")
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "branch_id")
	private Branch branch;
	
	@OneToMany(mappedBy = "coach")
	private List<Batch> batches;

}
