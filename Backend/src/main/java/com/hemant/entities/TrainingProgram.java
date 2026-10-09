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
public class TrainingProgram {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private String name;
	private String duration;
	private String fees;
	
	@ManyToOne
	@JoinColumn(name = "sport_id")
	private Sport sport;
	
	@OneToMany(mappedBy = "program")
	private List<Batch> batches;

}
