from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class AccountProfileTests(TestCase):
    def test_profile_exposes_staff_flag_for_staff_routes(self):
        user = get_user_model().objects.create_user(
            email='staff@example.com',
            password='password123',
            is_staff=True,
        )
        client = APIClient()
        client.force_authenticate(user)

        response = client.get('/api/auth/profile/')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_staff'])
