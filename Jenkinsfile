pipeline {
    // Run the pipeline on any available Jenkins agent
    agent any  

    // Environment variables
    environment {
        // Path to docker-compose binary on EC2 (adjust if different)
        DOCKER_COMPOSE = "/usr/local/bin/docker-compose"  

        // Project name (optional, useful for labeling logs)
        PROJECT_NAME = "todo-app"  
    }

    stages {

        // =========================
        // 1️⃣ Checkout Stage
        // =========================
        stage('Checkout') {
            steps {
                echo "Checking out source code from GitHub..."
                
                // Pulls the code from GitHub using the Jenkins job SCM configuration
                checkout scm
            }
        }

        // =========================
        // 2️⃣ Verify Tools Stage
        // =========================
        stage('Verify Tools') {
            steps {
                // Ensure docker and docker-compose are installed and accessible
                sh '''
                    echo "Checking Docker version..."
                    docker --version
                    echo "Checking Docker Compose version..."
                    ${DOCKER_COMPOSE} --version
                '''
            }
        }

        // =========================
        // 3️⃣ Prepare Backend Environment Stage
        // =========================
        stage('Prepare Backend Environment') {
            steps {
                // Use Jenkins credentials securely
                withCredentials([
                    // 'MONGO_URI' is the Jenkins secret ID for your MongoDB Atlas connection string
                    string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI')
                ]) {
                    sh '''
                        echo "Creating backend .env file dynamically..."
                        echo "MONGO_URI=${MONGO_URI}" > todo-backend/.env
                        echo "PORT=5000" >> todo-backend/.env
                    '''
                }
            }
        }

        // =========================
        // 4️⃣ Build Docker Images Stage
        // =========================
        stage('Build Docker Images') {
            steps {
                echo "Building frontend and backend Docker images using docker-compose..."
                
                // Build images without cache to ensure latest code is used
                sh '''
                    ${DOCKER_COMPOSE} -f docker-compose.yaml build --no-cache
                '''
            }
        }

        // =========================
        // 5️⃣ Deploy Application Stage
        // =========================
        stage('Deploy Application') {
            steps {
                echo "Stopping any old containers and starting new ones..."
                
                // Stop old containers (if any) and remove them
                sh '''
                    ${DOCKER_COMPOSE} -f docker-compose.yaml down || true
                '''
                
                // Start all containers in detached mode
                sh '''
                    ${DOCKER_COMPOSE} -f docker-compose.yaml up -d
                '''
            }
        }

        // =========================
        // 6️⃣ Health Check Stage
        // =========================
        stage('Health Check') {
            steps {
                echo "Performing a health check to verify frontend is running..."
                
                // Wait a few seconds for containers to start properly
                sh '''
                    sleep 15
                    curl -f http://localhost || exit 1
                    echo "Frontend is running and reachable on port 80."
                '''
            }
        }
    }

    // =========================
    // Post Actions
    // =========================
    post {
        // Actions on successful pipeline run
        success {
            echo "✅ Deployment completed successfully!"
        }

        // Actions on failure
        failure {
            echo "❌ Deployment failed. Check Jenkins logs for errors."
        }

        // Actions that always run regardless of success or failure
        always {
            // Remove sensitive backend .env file after deployment
            sh 'rm -f todo-backend/.env || true'
        }
    }
}
