# Stage 1: Build the Spring Boot JAR
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
# Download dependencies first (cached layer)
RUN chmod +x mvnw && ./mvnw dependency:resolve -B
COPY src/ src/
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Run the JAR with optimized JVM flags
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/sportsbackend.jar app.jar

# Create uploads directory
RUN mkdir -p uploads/images

EXPOSE 2424

# JVM tuning for Render free tier (512MB RAM):
# -Xms128m: Start with 128MB heap
# -Xmx384m: Max 384MB heap (leave room for OS + metaspace)
# -XX:+UseG1GC: Low-latency garbage collector
# -XX:+UseStringDeduplication: Reduce memory for duplicate strings
# -XX:MaxMetaspaceSize=128m: Cap metaspace growth
CMD ["java", "-Xms128m", "-Xmx384m", "-XX:+UseG1GC", "-XX:+UseStringDeduplication", "-XX:MaxMetaspaceSize=128m", "-jar", "app.jar"]
