package com.scholarship.app.repository;

import com.scholarship.app.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<StudentProfile, Long> {
}
