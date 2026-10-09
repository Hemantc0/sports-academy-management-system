package com.hemant.entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Branch {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private String  name; 
	private String location;
	
	@OneToMany(mappedBy = "branch")
	private List<Coach> coaches;
	
	@OneToMany(mappedBy = "branch")
	private List<Player> players;

}
