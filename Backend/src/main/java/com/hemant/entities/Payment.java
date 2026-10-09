package com.hemant.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Payment {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private double amount;
	private String status;
	private String transaction_Id;
	
	@ManyToOne
	@JoinColumn(name = "membership_id")
	private Membership membership;
	
	@ManyToOne
	@JoinColumn(name = "player_id")
	private Player player;

}
