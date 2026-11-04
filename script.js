function format(n){
  if(n >= 1e9) return (n/1e9).toFixed(1)+"B";
  if(n >= 1e6) return (n/1e6).toFixed(1)+"M";
  if(n >= 1e3) return (n/1e3).toFixed(1)+"K";
  return Math.floor(n);
}

let input = document.getElementById('userName');
let status = document.getElementById('status');
let searchBtn = document.getElementById('searchBtn');
let displayer = document.getElementById('display');
displayer.innerHTML = 'EMPTY';

async function searchUser(){
  let user = input.value.trim();
  
  if(!user){
    status.textContent = 'You Must Input a User Name First';
    return;
  };
  
  searchBtn.textContent = 'Loading...';
  searchBtn.disabled = true;
  status.textContent = `Getting Information on ${user}...`;
  displayer.innerHTML = 'Loading...';
  
  try {
    const res = await fetch(`https://api.github.com/users/${user}`);
    
    if(res.status === 404){
      status.textContent = 'User Not Found';
      displayer.innerHTML = 'EMPTY';
      return;
    }

    if(!res.ok){
      throw new Error('API Error');
    }
    
    const data = await res.json();
    
    status.textContent = `Found ${data.login} • ${data.public_repos} repos`;
    
    const joinDate = new Date(data.created_at).toLocaleDateString();

    displayer.innerHTML = `
      <div class='innerDisplay'>
        <img src="${data.avatar_url}" alt="${data.login}">
        <h2>${data.name || data.login}</h2>
        <p class="username">@${data.login}</p>
        <p class="bio">${data.bio || "No Bio Available"}</p>
        
        <div class="github-stats">
          <div><small>FOLLOWERS</small><b>${format(data.followers)}</b></div>
          <div><small>FOLLOWING</small><b>${format(data.following)}</b></div>
          <div><small>REPOS</small><b>${format(data.public_repos)}</b></div>
        </div>

        <div class="github-extra">
          <p>📍 ${data.location || "No location"}</p>
          <p>🏢 ${data.company || "No company"}</p>
          <p>🔗 ${data.blog ? `<a href="${data.blog.startsWith('http') ? data.blog : 'https://'+data.blog}" target="_blank">${data.blog}</a>` : "No website"}</p>
          <p>📅 Joined: ${joinDate}</p>
          <p>📦 Gists: ${data.public_gists} • Type: ${data.type}</p>
        </div>
      </div>
    `;
    
  } catch (e) {
    status.textContent = 'Error fetching user. Check internet / rate limit.';
    displayer.innerHTML = 'EMPTY';
    console.log(e);
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = 'SEARCH';
  }
}