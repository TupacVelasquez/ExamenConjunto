# Usamos una imagen base ligera de Java 17
FROM eclipse-temurin:17-jdk-alpine

# Directorio temporal para Tomcat
VOLUME /tmp

# Copiamos el JAR generado (Asegúrate que el nombre coincida con el artifactId y version del pom.xml)
COPY target/VelasquezTupac_Leecion1-0.0.1-SNAPSHOT.jar app.jar

# Comando de entrada
ENTRYPOINT ["java","-jar","/app.jar"]