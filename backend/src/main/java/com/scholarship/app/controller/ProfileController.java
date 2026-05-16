package com.scholarship.app.controller;

import com.scholarship.app.entity.StudentProfile;
import com.scholarship.app.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    // Define storage directory inside the Docker container
    private static final String UPLOAD_DIR = "/app/uploads";

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<StudentProfile> createProfile(
            @RequestPart("profile") StudentProfile profile,
            @RequestPart("file") MultipartFile file) throws IOException {

        // 1. Ensure upload directory exists
        File uploadFolder = new File(UPLOAD_DIR);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        // 2. Generate a unique file name to avoid overwriting duplicates
        String uniqueFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String targetPath = Paths.get(UPLOAD_DIR, uniqueFileName).toString();

        // 3. Save file data to the local container system
        file.transferTo(new File(targetPath));

        // 4. Save metadata to PostgreSQL database record
        profile.setDocumentPath(targetPath);
        StudentProfile savedProfile = profileRepository.save(profile);

        return ResponseEntity.ok(savedProfile);
    }

    @GetMapping
    public ResponseEntity<List<StudentProfile>> getAllProfiles() {
        return ResponseEntity.ok(profileRepository.findAll());
    }
}
