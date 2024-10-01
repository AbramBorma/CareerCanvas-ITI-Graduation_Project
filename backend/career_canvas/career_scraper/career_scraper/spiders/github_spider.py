import scrapy

class GitHubSpider(scrapy.Spider):
    name = "github"
    allowed_domains = ["github.com"]
    start_urls = ['https://github.com/AbramBorma']  # Replace 'username' with the actual username

    def parse(self, response):
        # 1. Extract the heatmap of contributions (SVG data)
        heatmap_data = response.css('svg.js-calendar-graph-svg g g rect::attr(data-count)').getall()
        yield {
            'heatmap': heatmap_data
        }

        # 2. Extract repository names and the URL to fetch languages
        for repo in response.css('li[itemprop="owns"]'):
            repo_name = repo.css('a[itemprop="name codeRepository"]::text').get().strip()
            repo_url = response.urljoin(repo.css("a[itemprop='name codeRepository']::attr(href)").get())
            languages_url = repo_url + '/languages'
            
            # Follow the link to scrape languages used in each repo
            yield scrapy.Request(languages_url, callback=self.parse_languages, meta={'repo_name': repo_name})

    def parse_languages(self, response):
        repo_name = response.meta['repo_name']
        languages = response.css('.language-color::text').getall()

        yield {
            'repo_name': repo_name,
            'languages': languages
        }
