pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = "/usr/local/bin/docker-compose"
        PROJECT_NAME = "todo-app"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                sh '''
                    docker --version
                    ${DOCKER_COMPOSE} --version
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "🔨 Building Docker images..."
                    ${DOCKER_COMPOSE} -f docker-compose.yaml build --no-cache
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                withCredentials([string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI')]) {
                    sh '''
                        echo "🚀 Stopping existing containers..."
                        ${DOCKER_COMPOSE} -f docker-compose.yaml down || true

                        echo "🚀 Starting containers..."
                        MONGO_URI=${MONGO_URI} ${DOCKER_COMPOSE} -f docker-compose.yaml up -d
                    '''
                }
            }
        }

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
    }
}
