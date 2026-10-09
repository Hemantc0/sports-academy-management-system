package com.hemant.entities;

import com.hemant.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;
@Data
@Entity
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@Column(unique = true, nullable = false)
	private String username;
	private String email;
	private String password;
	@Enumerated(EnumType.STRING)
	private Role role;

	
	@OneToOne
	@JoinColumn(name = "coach_id")
	private Coach coach;
	
	@OneToOne
	@JoinColumn(name = "player_id")
	private Player player;
	}
	


