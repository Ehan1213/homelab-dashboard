import sys
import urllib.request

try:
    response = urllib.request.urlopen("http://127.0.0.1:5000/api/health")
    if response.getcode() == 200:
        sys.exit(0)
except Exception:
    pass
sys.exit(1)
