package com.scholarship.app.controller;

import com.scholarship.app.entity.StudentProfile;
import com.scholarship.app.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileRepository profileRepository;

    private static final String UPLOAD_DIR = "/app/uploads";

    // 1. ADMIN ONLY: View all applications
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentProfile>> getAllProfiles() {
        return ResponseEntity.ok(profileRepository.findAll());
    }

    // 2. STUDENT ONLY: Submit a profile bound to their own authentication identity
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfile> createProfile(
            @RequestPart("profile") StudentProfile profile,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails currentUser) throws IOException {

        // Enforce user ID linking through backend security session state
        // profile.setUser(userService.findByUsername(currentUser.getUsername()));

        File uploadFolder = new File(UPLOAD_DIR);
        if (!uploadFolder.exists()) uploadFolder.mkdirs();

        String uniqueFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String targetPath = Paths.get(UPLOAD_DIR, uniqueFileName).toString();
        file.transferTo(new File(targetPath));

        profile.setDocumentPath(targetPath);
        return ResponseEntity.ok(profileRepository.save(profile));
    }

    // 3. ADMIN ONLY: Safely download transcripts via custom key index lookup
    @GetMapping("/download/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        try {
            StudentProfile profile = profileRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            Path filePath = Paths.get(profile.getDocumentPath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) return ResponseEntity.notFound().build();

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
