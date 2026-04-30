# How to set up Java & Maven for the Spring Boot Backend

It seems Java and Maven are not currently in your system's PATH. To run the real Spring Boot backend, please follow these steps:

### 1. Install Java Development Kit (JDK) 17+
- Download from: [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#java17) or [Eclipse Temurin (Adoptium)](https://adoptium.net/).
- After installing, verify by running `java -version` in a new terminal.

### 2. Install Apache Maven
- Download from: [Maven Downloads](https://maven.apache.org/download.cgi).
- Extract the zip file and add the `bin` folder to your System `PATH` environment variable.
- Verify by running `mvn -version`.

### 3. Add Maven Wrapper (Alternative)
To avoid manual installation, you can add the Maven wrapper to your project by running this once (requires `mvn` installed elsewhere or a one-time use):
`mvn -N io.takari:maven:wrapper`

---

### 🚀 Running the Project RIGHT NOW
I have started a **Mock Backend** for you so you can see the app working immediately:
1. **Frontend**: [http://localhost:5173/](http://localhost:5173/)
2. **Mock Backend**: [http://localhost:8080/](http://localhost:8080/) (Handled by Node.js instead of Java for now)

Once you install Java/Maven, you can stop the `node mock-backend/server.js` process and run the real backend using:
```bash
cd backend
mvn spring-boot:run
```
