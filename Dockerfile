# Stage 1: Build the Spring Boot JAR
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
# Download dependencies first (cached layer)
RUN chmod +x mvnw && ./mvnw dependency:resolve -B
COPY src/ src/
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Run the JAR
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/sportsbackend.jar app.jar

# Create uploads directory
RUN mkdir -p uploads/images

EXPOSE 2424
CMD ["java", "-jar", "app.jar"]
