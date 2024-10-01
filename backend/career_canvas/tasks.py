from celery import shared_task
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from django.core.cache import cache
from career_canvas.career_scraper.career_scraper.spiders.github_spider import GitHubSpider
from career_canvas.career_scraper.career_scraper.spiders.hackerrank_spider import HackerRankSpider

@shared_task
def run_github_scraping(username):
    process = CrawlerProcess(get_project_settings())
    GitHubSpider.start_urls = [f'https://github.com/{username}']
    process.crawl(GitHubSpider)
    process.start()
    return 'GitHub scraping completed'

@shared_task
def run_hackerrank_scraping(username):
    process = CrawlerProcess(get_project_settings())
    HackerRankSpider.start_urls = [f'https://www.hackerrank.com/{username}']
    process.crawl(HackerRankSpider)
    process.start()
    return 'HackerRank scraping completed'
