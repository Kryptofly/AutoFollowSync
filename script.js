document.getElementById('sync-form').addEventListener('submit', function(e) {
    e.preventDefault();
    syncFollows();
});

async function syncFollows() {
    const twitterUsername = document.getElementById('twitter-username').value;
    const warpcastUsername = document.getElementById('warpcast-username').value;

    const twitterFollows = await getTwitterFollows(twitterUsername);
    const warpcastFollows = await getWarpcastFollows(warpcastUsername);

    const newWarpcastFollows = twitterFollows.filter(user => !warpcastFollows.includes(user));
    const newTwitterFollows = warpcastFollows.filter(user => !twitterFollows.includes(user));

    await followOnWarpcast(warpcastUsername, newWarpcastFollows);
    await followOnTwitter(twitterUsername, newTwitterFollows);

    document.getElementById('status-message').textContent = `Synced ${newWarpcastFollows.length} new follows on Warpcast and ${newTwitterFollows.length} new follows on Twitter.`;
    document.getElementById('sync-status').classList.remove('hidden');
}

async function getTwitterFollows(username) {
    const apiKey = 'YOUR_TWITTER_API_KEY'; // Replace with your Twitter API key
    const url = `https://api.twitter.com/2/users/by/username/${username}/following`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await response.json();
        return data.data.map(user => user.username);
    } catch (error) {
        console.error('Error fetching Twitter follows:', error);
        return [];
    }
}

async function getWarpcastFollows(username) {
    // Replace with actual Warpcast API URL and key
    const apiKey = 'YOUR_WARPCAST_API_KEY';
    const url = `https://warpcast-api-url/users/${username}/following`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await response.json();
        return data.data.map(user => user.username);
    } catch (error) {
        console.error('Error fetching Warpcast follows:', error);
        return [];
    }
}

async function followOnWarpcast(username, users) {
    // Replace with actual Warpcast API URL and key
    const apiKey = 'YOUR_WARPCAST_API_KEY';
    const url = `https://warpcast-api-url/users/${username}/follow`;

    try {
        await Promise.all(users.map(user => {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ username: user })
            });
        }));
    } catch (error) {
        console.error('Error following on Warpcast:', error);
    }
}

async function followOnTwitter(username, users) {
    const apiKey = 'YOUR_TWITTER_API_KEY'; // Replace with your Twitter API key
    const url = `https://api.twitter.com/2/users/by/username/${username}/follow`;

    try {
        await Promise.all(users.map(user => {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ username: user })
            });
        }));
    } catch (error) {
        console.error('Error following on Twitter:', error);
    }
}
