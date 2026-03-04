const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "are",
  "was",
  "were",
  "will",
  "shall",
  "have",
  "of",
  "in",
  "you",
  "your",
  "our",
  "their",
  "them",
  "they",
  "is",
  "may",
  "include",
  "such",
  "all",
  "both",
  "under",
  "while",
  "us",
  "to",
  "a",
  "we",
  "or",
]);
const keyWords = [
  "computer",
  "support",
  "technician",
  "communication",
  "printer",
  "webcam",
  "software",
  "firmware",
  "data",
  "database",
  "ubuntu",
  "linux",
  "ethernet",
  "colocation",
  "remote compute",
  "wordpress",
  "office 365",
  "excel",
  "outlook",
  "google app",
  "google drive",
  "microsoft onedrive",
  "microsoft sharepoint",
  "skill",
  "technical",
];
function extractKeywords() {
  let text = document.getElementById("jobInput").value.toLowerCase();
  let words = text
    .split(/\s/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  let cleanedWords = words
    .filter((wd) => {
      return !stopWords.has(wd);
    })
    .map((wd) => wd.replace(/[^\w-]/g, "")); // remove punctuation, keep hyphen word

  let freq = {};
  cleanedWords.forEach((wd) => {
    if (!/^\d+$/.test(wd) && wd.length > 2) {
      freq[wd] = (freq[wd] || 0) + 1;
    }
  });
  let sorted = Object.entries(freq)
    .filter(([_, count]) => count >= 2)
    .sort((w1, w2) => w2[1] - w1[1]);
  displayResults(sorted);
}

function displayResults(keywords) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<div class='section-title'>Top Keywords:</div>";

  keywords.forEach((keyword) => {
    resultsDiv.innerHTML += `<span class="keyword">${keyword}</span>`;
  });
}

document
  .getElementById("jobInput")
  .addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      extractKeywords();
    }
  });
