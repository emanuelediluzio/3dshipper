import os
import sys
import subprocess
import platform
import time

# Configuration
REPO_URL = "https://github.com/Tencent/Hunyuan3D-1.git"
REPO_DIR = "Hunyuan3D-1"
MODEL_HF_ID = "tencent/Hunyuan3D-1"
VENV_DIR = ".venv"

def print_colored(text, color="cyan"):
    colors = {
        "cyan": "\033[96m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "red": "\033[91m",
        "reset": "\033[0m"
    }
    if platform.system() == "Windows":
        print(text)
    else:
        print(f"{colors.get(color, '')}{text}{colors['reset']}")

def get_venv_python():
    if platform.system() == "Windows":
        return os.path.join(VENV_DIR, "Scripts", "python.exe")
    return os.path.join(VENV_DIR, "bin", "python")

def run_command(command, cwd=None, shell=True):
    try:
        subprocess.check_call(command, cwd=cwd, shell=shell)
        return True
    except subprocess.CalledProcessError:
        print_colored(f"Error executing: {command}", "red")
        return False

def setup_environment():
    print_colored("--- 1. Checking Environment & Virtual Env ---")
    
    # Create venv if not exists
    if not os.path.exists(VENV_DIR):
        print_colored(f"Creating virtual environment in {VENV_DIR}...", "yellow")
        run_command(f"{sys.executable} -m venv {VENV_DIR}")
    else:
        print_colored(f"Virtual environment found in {VENV_DIR}.", "green")

    # Use the venv python for subsequent commands
    venv_python = get_venv_python()
    
    # Check if repo exists
    if not os.path.exists(REPO_DIR):
        print_colored(f"Cloning {REPO_DIR}...", "yellow")
        if not run_command(f"git clone {REPO_URL}"):
            return False
    else:
        print_colored(f"{REPO_DIR} found.", "green")

    # Install dependencies
    print_colored("--- 2. Installing Dependencies in Virtual Env ---", "yellow")
    pip_cmd = f"{venv_python} -m pip install"
    
    # Install standard requirements
    req_file = os.path.join(REPO_DIR, "requirements.txt")
    if os.path.exists(req_file):
        print_colored("Installing requirements.txt...", "yellow")
        run_command(f"{pip_cmd} -r requirements.txt", cwd=REPO_DIR)
    
    # Install huggingface_hub
    run_command(f"{pip_cmd} huggingface_hub")

    return True

def download_weights():
    # Weights handling remains manual or via hf-cli, usually outside python if massive,
    # but we can try invoking hf-cli from venv
    pass

def generate_3d(image_path):
    print_colored(f"--- 4. Generating 3D Model from {image_path} ---", "green")
    
    abs_image_path = os.path.abspath(image_path)
    if not os.path.exists(abs_image_path):
        print_colored("Image file not found!", "red")
        return

    output_dir = os.path.join("outputs", os.path.splitext(os.path.basename(image_path))[0])
    
    # CRITICAL: Use venv python to run main.py
    venv_python = get_venv_python()
    
    cmd = f"{venv_python} main.py --image_path \"{abs_image_path}\" --save_folder \"{output_dir}\" --render"
    
    print_colored(f"Running: {cmd}", "cyan")
    run_command(cmd, cwd=REPO_DIR)
    
    print_colored(f"\nDone! Check output in {os.path.join(REPO_DIR, output_dir)}", "green")

def main():
    print_colored("=== Hunyuan3D Local Generator (VENV Mode) ===", "cyan")
    print("This script helps you set up and run Hunyuan3D locally in an isolated environment.")
    print("WARNING: A GPU with CUDA is highly recommended (NVIDIA).")
    
    if not setup_environment():
        return

    print_colored("\n[NOTE] If weights are missing, download them manually or use hf-cli.", "yellow")

    while True:
        mode = input("\nDo you want to (1) Generate 3D Model or (2) Exit? [1/2]: ")
        if mode == "2":
            break
        
        if mode == "1":
            img_path = input("Enter path to image file (png/jpg): ").strip()
            # Remove quotes
            img_path = img_path.replace("'", "").replace('"', "")
            
            if os.path.exists(img_path):
                generate_3d(img_path)
            else:
                print_colored("File does not exist.", "red")

if __name__ == "__main__":
    main()
