# Deployment

To deploy the Docker image containing your FastAPI app to an Azure Virtual Machine (VM), you can follow these steps:

1. Create an Azure Virtual Machine:
   * Sign in to the Azure portal (portal.azure.com) and navigate to the Virtual Machines section.
   * Click on "Add" to create a new virtual machine.
   * Provide the necessary details, such as the VM name, region, operating system, and resource group.
   * Configure the desired VM size, networking options, and authentication settings.
   * Review and create the VM. Azure will provision the virtual machine based on the provided configuration.
2. Connect to the Azure Virtual Machine:
   * Once the VM is created, you can connect to it using various methods, such as SSH for Linux-based VMs or Remote Desktop for Windows-based VMs.
   * Obtain the necessary connection information, including the public IP address or DNS name of the VM, along with the credentials to access it.
3. Prepare the Azure VM:
   * Connect to the Azure VM using your preferred method (e.g., SSH, Remote Desktop).
   * Install Docker on the Azure VM by following the official Docker documentation for your VM's operating system.
4. Push the Docker Image to Docker Hub:
   * Docker Hub registry that can be used to store and manage your Docker images.
   * Push your Docker image to an Docker Hub by following the official Docker documentation for pushing Docker images to Docker Hub.
5. Pull and Run the Docker Image on Azure VM:
   * On the Azure VM, pull the Docker image from the Docker Hub using the following command: `docker pull <app-name>/fastapi-app`.
   * Replace `<app-name>` with the name of your Docker Hub.
   * Once the image is pulled, run the Docker container using the command: `docker run -d -p 8000:8000 <app-name>/fastapi-app`.
   * The `-d` flag runs the container in detached mode, and the `-p` flag maps the container's port 8000 to the host's port 8000, allowing access to the FastAPI app.
6. Access the FastAPI App on Azure VM:
   * With the Docker container running, you should be able to access the FastAPI app on the Azure VM by navigating to `http://<your-vm-public-ip>:5000` or `http://<your-vm-dns-name>:5000` in a api testing tool like Postman.

By following these steps, you can deploy the Docker image containing your FastAPI app to an Azure VM, leveraging Docker Hub to store and manage your Docker images. This allows you to run your Fast
