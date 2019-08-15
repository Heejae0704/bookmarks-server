function makeBookmarksArray() {
    return [
        {
            "id": 1,
            "title": "Thinkful",
            "url": "https://www.thinkful.com",
            "description": "Think outside the classrom",
            "rating": "5"
        },
        {
            "id": 2,
            "title": "Google",
            "url": "https://www.google.com",
            "description": "where we find everything",
            "rating": "4"
        },
        {
            "id": 3,
            "title": "MDN",
            "url": "https://developer.mozilla.org",
            "description": "the place to find web doc",
            "rating": "5"
        },
        {
            "id": 4,
            "title": "ign",
            "url": "https://ign.com",
            "description": "the ultimate gaming website",
            "rating": "3"
        },
        {
            "id": 5,
            "title": "dc",
            "url": "https://www.dccomics.com/collectibles",
            "description": "DC collectibles",
            "rating": "2"
        },
        {
            "id": 6,
            "title": "toys",
            "url": "https://www.hottoys.com.hk/",
            "description": "toy store",
            "rating": "1"
        }
    ]
}

function makeMaliciousBookmark() {
    const maliciousBookmark = {
        id: 911,
        title: "Bug Life",
        url: 'Naughty naughty very naughty <script>alert("xss");</script>',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        rating: "1"
    }

    const expectedBookmark = {
        ...maliciousBookmark,
        url: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }

    return {
        maliciousBookmark,
        expectedBookmark,
    }
}

module.exports = {
    makeBookmarksArray,
    makeMaliciousBookmark
  }