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
public class Membership {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private String start_date;
	private String end_date;
	private String status;
	
	@ManyToOne
	@JoinColumn(name = "player_id")
	private Player player;
	
	@ManyToOne
	@JoinColumn(name = "batch_id")
	private Batch batch;
	
	@OneToMany(mappedBy = "membership")
	private List<Payment> payments;

}
