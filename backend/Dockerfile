# Step 1: Build stage using Maven cache optimization
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy ONLY the pom.xml first to download and cache dependencies
COPY pom.xml .

# Download all dependencies into the image layer cache
RUN mvn dependency:go-offline -B

# Copy the rest of the application source code
COPY src ./src

# Build the project package (this will be lightning fast now)
RUN mvn clean package -DskipTests

# Step 2: Runtime stage
FROM openjdk:27-ea-17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/app-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
