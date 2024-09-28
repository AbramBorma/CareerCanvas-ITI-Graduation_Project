import scrapy

class HackerRankSpider(scrapy.Spider):
    name = "hackerrank"
    allowed_domains = ["hackerrank.com"]
    start_urls = ['https://www.hackerrank.com/profile/engabram_93']  # Replace 'username' with the actual username

    def parse(self, response):
        solved_stats = {
            'easy': response.css('.easy::text').get(),
            'medium': response.css('.medium::text').get(),
            'hard': response.css('.hard::text').get(),
        }
        latest_solved = response.css('.challenges-list .challenge-name::text').getall()

        yield {
            'solved_stats': solved_stats,
            'latest_solved': latest_solved
        }
