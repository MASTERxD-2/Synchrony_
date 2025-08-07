import os
import shutil
import zipfile
import glob
from collections import Counter

def is_valid_entry(name):
    return not (name == "__MACOSX" or name.startswith("._"))

def find_main_folder(path):
    try:
        entries = sorted(os.listdir(path))
    except FileNotFoundError:
        return path
    valid_dirs = [d for d in entries if os.path.isdir(os.path.join(path, d)) and is_valid_entry(d)]
    if not valid_dirs:
        return path
    for d in valid_dirs:
        full_path = os.path.join(path, d)
        if any(os.path.exists(os.path.join(full_path, marker)) for marker in ("package.json", "README.md", ".git")):
            return full_path
    return os.path.join(path, valid_dirs[0])

def get_folder_structure(startpath, max_depth=6):
    structure = []
    for root, dirs, file_list in os.walk(startpath):
        dirs[:] = [d for d in dirs if is_valid_entry(d)]
        level = root.replace(startpath, '').count(os.sep)
        if level > max_depth:
            continue
        indent = '│   ' * level + '├── '
        structure.append(f"{indent}{os.path.basename(root)}/")
        subindent = '│   ' * (level + 1)
        for f in sorted(file_list):
            if is_valid_entry(f):
                structure.append(f"{subindent}└── {f}")
    return "\n".join(structure)

def analyze_zip_file(zip_path: str) -> str:
    extract_folder = "project_repo"

    # Clean up existing directory
    if os.path.exists(extract_folder):
        shutil.rmtree(extract_folder)
    os.makedirs(extract_folder, exist_ok=True)

    # Extract ZIP
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_folder)

    base_path = find_main_folder(extract_folder)
    project_name = os.path.basename(base_path)

    # Folder structure
    folder_structure = get_folder_structure(base_path)

    # Extract README
    readme_text = "No README.md file found."
    for root, dirs, file_list in os.walk(base_path):
        file_list = [f for f in file_list if is_valid_entry(f)]
        for file in file_list:
            if file.lower() == "readme.md":
                try:
                    with open(os.path.join(root, file), "r", encoding="utf-8", errors="ignore") as f:
                        lines = [line.strip() for line in f if line.strip()]
                        readme_text = "\n".join(lines[:6])
                    break
                except:
                    readme_text = "README.md found but could not be read."
                    break
        if readme_text != "No README.md file found.":
            break

    # Language detection
    ext_map = {
        '.py': 'Python', '.java': 'Java', '.js': 'JavaScript', '.ts': 'TypeScript',
        '.tsx': 'TypeScript', '.jsx': 'JavaScript', '.cpp': 'C++', '.c': 'C',
        '.html': 'HTML', '.css': 'CSS', '.go': 'Go', '.rs': 'Rust',
        '.php': 'PHP', '.kt': 'Kotlin'
    }

    language_counts = Counter()
    for root, dirs, file_list in os.walk(base_path):
        dirs[:] = [d for d in dirs if is_valid_entry(d)]
        for file in file_list:
            if not is_valid_entry(file):
                continue
            ext = os.path.splitext(file)[1]
            if ext in ext_map:
                language_counts[ext_map[ext]] += 1

    language_summary = ", ".join([f"{lang} ({count})" for lang, count in language_counts.items()])

    # Dependencies
    dependency_files = []
    common_deps = ['requirements.txt', 'package.json', 'pom.xml', 'setup.py', 'environment.yml', 'build.gradle']
    for dep in common_deps:
        found = glob.glob(f"{base_path}/**/{dep}", recursive=True)
        found = [f for f in found if all(is_valid_entry(part) for part in f.split(os.sep))]
        if found:
            dependency_files.extend(found)

    deps_summary = ', '.join(set(os.path.basename(f) for f in dependency_files))

    # Run hints
    run_hint = "No standard run command detected. Refer to README."
    if "package.json" in deps_summary:
        run_hint = "1. Run `npm install`\n2. Then `npm run dev` or `npm start`"
    elif "requirements.txt" in deps_summary or "setup.py" in deps_summary:
        run_hint = "1. Create a virtual environment\n2. Run `pip install -r requirements.txt`\n3. Then run the main script"

    # Compose summary
    summary_text = f"""# 📘 Project Summary

**📛 Project Name:** {project_name}

**📖 Description:**
{readme_text}

**🧠 Programming Languages Used:**
{language_summary if language_summary else "None detected."}

**📦 Dependency Files:**
{deps_summary if deps_summary else "None detected."}

**🗂️ Folder Structure:**
{folder_structure}

**🚀 How to Run the Project:**
{run_hint}

**✅ Summary generated automatically.**
"""
    return summary_text
