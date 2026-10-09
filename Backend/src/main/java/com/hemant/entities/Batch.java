package com.hemant.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Batch {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private String name;
	
	@ManyToOne
	@JoinColumn(name = "program_id")
	private TrainingProgram program;
	
	@ManyToOne
	@JoinColumn(name = "coach_id")
	private Coach coach;
	
	@OneToMany(mappedBy = "batch")
	private List<Membership> memberships;

}
