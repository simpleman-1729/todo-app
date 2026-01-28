pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = "/usr/local/bin/docker-compose" // Path to Docker Compose on EC2
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
                withCredentials([string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI')]) {
                    sh '''
                        echo "🔨 Creating backend .env for build..."
                        echo "MONGO_URI=${MONGO_URI}" > todo-backend/.env
                        echo "PORT=5000" >> todo-backend/.env

                        echo "🔨 Building Docker images..."
                        ${DOCKER_COMPOSE} -f docker-compose.yaml build --no-cache
                    '''
                }
            }
        }

        // =========================
        // 4️⃣ Deploy Application
        // =========================
        stage('Deploy Application') {
            steps {
                withCredentials([string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI')]) {
                    sh '''
                        echo "🚀 Stopping existing containers..."
                        ${DOCKER_COMPOSE} -f docker-compose.yaml down || true

                        echo "🚀 Creating backend .env for runtime..."
                        echo "MONGO_URI=${MONGO_URI}" > todo-backend/.env
                        echo "PORT=5000" >> todo-backend/.env

                        echo "🚀 Starting containers..."
                        ${DOCKER_COMPOSE} -f docker-compose.yaml up -d
                    '''
                }
            }
        }

        // =========================
        // 5️⃣ Health Check
        // =========================
        stage('Health Check') {
            steps {
                sh '''
                    echo "🩺 Waiting for frontend to start..."
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
            echo "❌ Deployment failed. Check Jenkins logs for details."
        }
        always {
            echo "🧹 Cleaning up temporary .env..."
            sh 'rm -f todo-backend/.env || true'
        }
    }
}
