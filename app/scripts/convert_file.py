# convert_file.py
import sys
import os
import pdfplumber
import docx

def convert_file(file_path):
    ext = file_path.split('.')[-1].lower()
    text = ""

    if ext == "pdf":
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(1)

    elif ext == "docx":
        try:
            doc = docx.Document(file_path)
            for p in doc.paragraphs:
                text += p.text + "\n"
        except Exception as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(1)

    elif ext == "txt":
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        except Exception as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print("ERROR: Unsupported file type", file=sys.stderr)
        sys.exit(1)

    print(text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: No file provided", file=sys.stderr)
        sys.exit(1)
    file_path = sys.argv[1]
    convert_file(file_path)
