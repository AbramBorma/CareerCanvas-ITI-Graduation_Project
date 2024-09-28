from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.cache import cache
from career_canvas.tasks import run_github_scraping, run_hackerrank_scraping

class GitHubDataView(APIView):
    def get(self, request, username):
        # Cache key for GitHub data
        cache_key = f'github_data_{username}'
        cached_data = cache.get(cache_key)

        if cached_data:
            # Return cached data if available
            return Response(cached_data)
        else:
            # Trigger Celery task to scrape GitHub data
            run_github_scraping.delay(username)
            
            # Inform the client that the scraping has started
            return Response({'message': 'GitHub scraping started, try again later.'})


class HackerRankDataView(APIView):
    def get(self, request, username):
        # Cache key for HackerRank data
        cache_key = f'hackerrank_data_{username}'
        cached_data = cache.get(cache_key)

        if cached_data:
            # Return cached data if available
            return Response(cached_data)
        else:
            # Trigger Celery task to scrape HackerRank data
            run_hackerrank_scraping.delay(username)

            # Inform the client that the scraping has started
            return Response({'message': 'HackerRank scraping started, try again later.'})
