import os
import unittest

import requests


class TestEndpointStatus(unittest.TestCase):
    def test_health_ok(self):
        r = requests.get("http://127.0.0.1:5000/health")
        self.assertEqual(r.status_code, 200)

    def test_readiness_ok(self):
        r = requests.get("http://127.0.0.1:5000/readiness")
        self.assertEqual(r.status_code, 200)


class TestConfig(unittest.TestCase):
    def setUp(self):
        # Load .env file in your test setup
        from dotenv import load_dotenv

        load_dotenv()

        from app.app import create_app

        self.app = create_app()

        self.app.config["TESTING"] = True

    def test_secret_key_loaded(self):
        # Assert that the secret key was loaded from the environment
        self.assertIsNotNone(os.environ.get("SECRET_KEY"))
        self.assertEqual(self.app.config["SECRET_KEY"], os.environ.get("SECRET_KEY"))


if __name__ == "__main__":
    unittest.main()
