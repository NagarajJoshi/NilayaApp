package com.scholarship.app.controller;

import com.scholarship.app.entity.StudentProfile;
import com.scholarship.app.repository.ProfileRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
@Tag(name = "Student Profile Controller", description = "APIs for managing scholarship student profiles")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    @PostMapping
    @Operation(summary = "Create a new student profile", description = "Saves student application data including academic history.")
    @ApiResponse(responseCode = "200", description = "Profile created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request payload")
    public ResponseEntity<StudentProfile> createProfile(@RequestBody StudentProfile profile) {
        StudentProfile savedProfile = profileRepository.save(profile);
        return ResponseEntity.ok(savedProfile);
    }

    @GetMapping
    @Operation(summary = "Get all student profiles", description = "Fetches a full list of all scholarship applicant records.")
    @ApiResponse(responseCode = "200", description = "Profiles retrieved successfully")
    public ResponseEntity<List<StudentProfile>> getAllProfiles() {
        return ResponseEntity.ok(profileRepository.findAll());
    }
}
