import os
import sys
import subprocess
import platform
import time

# Configuration
REPO_URL = "https://github.com/Tencent/Hunyuan3D-1.git"
REPO_DIR = "Hunyuan3D-1"
MODEL_HF_ID = "tencent/Hunyuan3D-1"

def print_colored(text, color="cyan"):
    colors = {
        "cyan": "\033[96m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "red": "\033[91m",
        "reset": "\033[0m"
    }
    if platform.system() == "Windows":
        print(text) # Simple print on Windows default console
    else:
        print(f"{colors.get(color, '')}{text}{colors['reset']}")

def run_command(command, cwd=None, shell=True):
    try:
        subprocess.check_call(command, cwd=cwd, shell=shell)
        return True
    except subprocess.CalledProcessError:
        print_colored(f"Error executing: {command}", "red")
        return False

def setup_environment():
    print_colored("--- 1. Checking Environment ---")
    
    # Check if repo exists
    if not os.path.exists(REPO_DIR):
        print_colored(f"Cloning {REPO_DIR}...", "yellow")
        if not run_command(f"git clone {REPO_URL}"):
            return False
    else:
        print_colored(f"{REPO_DIR} found.", "green")

    # Install dependencies
    print_colored("--- 2. Installing Dependencies ---", "yellow")
    # This assumes the user is running this script inside the desired python env
    pip_cmd = f"{sys.executable} -m pip install"
    
    # Install standard requirements
    req_file = os.path.join(REPO_DIR, "requirements.txt")
    if os.path.exists(req_file):
        print_colored("Installing requirements.txt...", "yellow")
        run_command(f"{pip_cmd} -r requirements.txt", cwd=REPO_DIR)
    
    # Install huggingface_hub for model downloading
    run_command(f"{pip_cmd} huggingface_hub")

    return True

def download_weights():
    print_colored("--- 3. Downloading Pre-trained Weights ---", "yellow")
    weights_dir = os.path.join(REPO_DIR, "weights")
    if not os.path.exists(weights_dir):
        os.makedirs(weights_dir)
    
    # Use huggingface-cli to download
    # This downloads the whole repo to weights dir
    cmd = f"huggingface-cli download {MODEL_HF_ID} --local-dir {weights_dir} --local-dir-use-symlinks False"
    run_command(cmd)

def generate_3d(image_path):
    print_colored(f"--- 4. Generating 3D Model from {image_path} ---", "green")
    
    # Absolute path for safety
    abs_image_path = os.path.abspath(image_path)
    if not os.path.exists(abs_image_path):
        print_colored("Image file not found!", "red")
        return

    # Construct standard inference command for Hunyuan3D-1
    # Note: Adjust arguments based on actual repo usage
    # Typically: python main.py --config config/inference.yaml --input_path ... --output_path ...
    
    # We will use the 'mvd_std' method or 'std' as default
    output_dir = os.path.join("outputs", os.path.splitext(os.path.basename(image_path))[0])
    
    cmd = f"{sys.executable} main.py --image_path \"{abs_image_path}\" --save_folder \"{output_dir}\" --render"
    
    print_colored(f"Running: {cmd}", "cyan")
    run_command(cmd, cwd=REPO_DIR)
    
    print_colored(f"\nDone! Check output in {os.path.join(REPO_DIR, output_dir)}", "green")

def main():
    print_colored("=== Hunyuan3D Local Generator ===", "cyan")
    print("This script helps you set up and run Hunyuan3D locally.")
    print("WARNING: A GPU with CUDA is highly recommended (NVIDIA). Mac/CPU support might be limited.")
    
    if not setup_environment():
        return

    # weights might be large, uncomment to auto-download
    # download_weights()
    print_colored("\n[NOTE] Weights are typically 10GB+. If you haven't downloaded them, please run 'huggingface-cli download tencent/Hunyuan3D-1 ...' manually or uncomment the download step in this script.", "yellow")

    while True:
        mode = input("\nDo you want to (1) Generate 3D Model or (2) Exit? [1/2]: ")
        if mode == "2":
            break
        
        if mode == "1":
            img_path = input("Enter path to image file (png/jpg): ").strip()
            # Remove quotes if user dragged file in terminal
            img_path = img_path.replace("'", "").replace('"', "")
            
            if os.path.exists(img_path):
                generate_3d(img_path)
            else:
                print_colored("File does not exist.", "red")

if __name__ == "__main__":
    main()
