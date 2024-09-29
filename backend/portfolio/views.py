from django.http import JsonResponse
import requests

def github_stats(request):
    username = request.GET.get('username', None) 
    
    if username:
        user_url = f"https://api.github.com/users/{username}"
        user_response = requests.get(user_url)
        user_data = user_response.json()
        
        repos_url = f"https://api.github.com/users/{username}/repos"
        repos_response = requests.get(repos_url)
        repos_data = repos_response.json()
        
        repos_info = []
        for repo in repos_data:
            repos_info.append({
                'name': repo['name'],
                'language': repo['language'],
                'url': repo['html_url']
            })
        
        data = {
            'user_data': user_data,
            'repos_info': repos_info
        }
        return JsonResponse(data)
    
    return JsonResponse({'error': 'Username not provided'}, status=400)
