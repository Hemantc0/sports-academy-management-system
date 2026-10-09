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
public class Player {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id ;
	private String dob ;
	private String gender ;
	private String email ;
	private String phone ;
	
	@OneToOne(mappedBy = "player")
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "branch_id")
	private Branch branch;
	
	@OneToMany(mappedBy = "player")
	private List<Membership> memberships;
	
	@OneToMany(mappedBy = "player")
	private List<Payment> payments;

}
