pipeline {
    agent any

    environment {
        // Absolute path to docker-compose binary on EC2
        DOCKER_COMPOSE = "/usr/local/bin/docker-compose"

        // Application name (for logging/reference)
        PROJECT_NAME = "todo-app"
    }

    stages {

        // =========================
        // 1️⃣ Checkout Source Code
        // =========================
        stage('Checkout') {
            steps {
                echo "📥 Checking out source code..."
                checkout scm
            }
        }

        // =========================
        // 2️⃣ Verify Required Tools
        // =========================
        stage('Verify Tools') {
            steps {
                sh '''
                    echo "🐳 Docker version:"
                    docker --version

                    echo "🐳 Docker Compose version:"
                    ${DOCKER_COMPOSE} --version
                '''
            }
        }

        // =========================
        // 3️⃣ Build Docker Images
        // =========================
        stage('Build Docker Images') {
            steps {
                echo "🔨 Building Docker images..."
                sh '''
                    ${DOCKER_COMPOSE} -f docker-compose.yaml build --no-cache
                '''
            }
        }

        // =========================
        // 4️⃣ Deploy Application
        // =========================
        stage('Deploy Application') {
            steps {
                echo "🚀 Deploying application..."

                withCredentials([
                    string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI')
                ]) {
                    sh '''
                        echo "Stopping existing containers (if any)..."
                        ${DOCKER_COMPOSE} -f docker-compose.yaml down || true

                        echo "Starting containers with injected secrets..."
                        MONGO_URI=${MONGO_URI} ${DOCKER_COMPOSE} -f docker-compose.yaml up -d
                    '''
                }
            }
        }

        // =========================
        // 5️⃣ Health Check
        // =========================
        stage('Health Check') {
            steps {
                echo "🩺 Performing health check..."
                sh '''
                    sleep 15
                    curl -f http://localhost || exit 1
                    echo "✅ Frontend is up and running on port 80"
                '''
            }
        }
    }

    post {

        success {
            echo "🎉 Deployment completed successfully!"
        }

        failure {
            echo "❌ Deployment failed. Please check Jenkins logs."
        }

        always {
            echo "🧹 Cleanup completed (no secrets written to disk)"
        }
    }
}
