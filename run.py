"""
AI Resume & ATS Optimization Engine - Main Launcher
Author: Prince Kumar (princekumar993408-stack)
Academic Affiliation: B.Tech CSE (IoT), Jain University
"""

import sys
import os
import argparse
import subprocess

def run_tests():
    """Run automated backend pytest suite."""
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    print("=" * 70)
    print("AI RESUME & ATS ANALYZER - RUNNING TEST SUITE")
    print("=" * 70)
    cmd = [sys.executable, "-m", "pytest", "tests", "-v"]
    result = subprocess.run(cmd, cwd=backend_dir)
    return result.returncode

def start_server(host="127.0.0.1", port=8000, reload=True):
    """Start FastAPI server with uvicorn."""
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    sys.path.insert(0, backend_dir)

    import uvicorn
    print("=" * 70)
    print("AI RESUME & ATS ANALYZER - STARTING API SERVER")
    print(f"Host: {host} | Port: {port} | Reload: {reload}")
    print(f"Docs: http://{host}:{port}/docs")
    print(f"Health: http://{host}:{port}/health")
    print("=" * 70)
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)

def main():
    parser = argparse.ArgumentParser(description="AI Resume & ATS Analyzer Launcher")
    parser.add_argument("--test", action="store_true", help="Run automated test suite and exit")
    parser.add_argument("--host", default="127.0.0.1", help="Server host (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8000, help="Server port (default: 8000)")
    parser.add_argument("--no-reload", action="store_true", help="Disable auto-reload")

    args = parser.parse_args()

    if args.test:
        code = run_tests()
        sys.exit(code)
    else:
        start_server(host=args.host, port=args.port, reload=not args.no-reload)

if __name__ == "__main__":
    main()
