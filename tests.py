import unittest

import requests


class TestEndpointStatus(unittest.TestCase):
    def test_health_ok(self):
        r = requests.get("http://127.0.0.1:5000/health")
        self.assertEqual(r.status_code, 200)

    def test_readiness_ok(self):
        r = requests.get("http://127.0.0.1:5000/readiness")
        self.assertEqual(r.status_code, 200)


if __name__ == "__main__":
    unittest.main()
